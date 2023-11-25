import torch
import numpy as np

from collections import OrderedDict
import pandas as pd
import json
from utils.impexp import read_json, write_json
from pathlib import Path

import torch.distributed

import datasets
from transformers import TrainerCallback
from transformers import MBartForConditionalGeneration
from transformers import MBartTokenizerFast
from transformers import Trainer, Seq2SeqTrainingArguments
from transformers import set_seed

import wandb


import logging

def summarization_config():
    cfg = OrderedDict([
        # from mBART checkpoint name
        ("base_model_name", "facebook/mbart-large-cc25"), #name of model
        ("save_training_dir", "checkpoints"), #subdirectory where the progress will be stored
        #full directory is outputTrain/dataset_name/task/save_training_dir
        ("last_name", "base"), #last model name - displayed in wandb (account required)

         #name of dataset
        ("dataset", OrderedDict([
            #("name", "cnc_sum"),
            #("name", "cnc-v4"),
            ("name", "sumeczech"),
        ])),
        
        ("resume", OrderedDict([
            #if continue from checkpoint then path_checkpoint is required
            ("continue", False),      
            #if the path_checkpoint is HuggingFace checkpoint = True or just saved model = False
            ("is_checkpoint", False),  
            ("path_checkpoint", ""), #ecpected .../name-steps
            ("path_cfg", ""),
            #If true - keep same last_name and save_training_dir as in config, it will overwrite
            ("keep_same_directory_as_loaded_cfg", False),
            ("count", 0), # number of resumed checkpoints
            ("change_lr", 1.5e-6), #to change learning rate
        ])),

        # AT2H task
       ("text_column", "ftext"),
       ("summary_column", "headline"),
        
        # HT2A task
#          ("text_column", "htext"),
#          ("summary_column", "abstract"),

        ("seed", 666),
        ("learning_rate", 3e-5),
        ("batch_size", 8),
        ("batch_size_eval", 8),
        ("gradient_accumulation_steps", 8),

        ("num_train_epochs", 10),
        ("logging_steps", 500),
        ("save_steps", 500),
        ("eval_steps", 2000),
        ("warmup_steps", 5000),
        ("save_total_limit", 5),
    ])
    
    #get dataset name into path
    dst = cfg["dataset"]["name"] if not cfg["dataset"]["name"].startswith("cnc-") else f'{cfg["dataset"]["name"][0:3]}/{cfg["dataset"]["name"][4:]}'
    
    #get tokenized dataset directory, or change to your dataset directory
    # expected train and validation sets stored in Datasets Arrow format
    cfg["dataset_dir"] =  f"/home/krotima1/projects/python/data/{dst}/prepared/{cfg['text_column']}2{cfg['summary_column']}"
    
    if cfg.get("resume", False) and cfg["resume"].get("continue",False):
        assert cfg["resume"].get("path_checkpoint", "") != ""
        logging.info(f"Training will resume from the checkpoint in file {cfg['resume']['path_checkpoint']}.")
        
        if cfg["resume"]["path_cfg"] != "":
            logging.warning(f'Loading configuration from file {cfg["resume"]["path_cfg"]}')
            #get current config of checkpoint
            tmp = cfg["resume"]
            #save names from current config
            save_training_dir, last_name = cfg["save_training_dir"],cfg["last_name"]
            #load config
            cfg = read_json(Path(cfg["resume"]["path_cfg"], "train_summarization_cfg.json"))
            #get same path and name as loaded config if requested
            cfg["save_training_dir"], cfg["last_name"] = return_saving_directory(save_training_dir,last_name,resume_=tmp, **cfg)
            #increase count
            tmp["count"] = cfg["resume"].get("count",0) + 1
            #get previous checkpoints
            tmp["previous"] = cfg["resume"].get("previous", [])
            cfg["resume"] = tmp
        
        # add previous checkpoints if not loaded from checkpoint:
        if not cfg["resume"].get("is_checkpoint", False):
            cfg["resume"]["previous"] = cfg["resume"].get("previous", []) + [cfg["resume"]["path_checkpoint"]]
    
    #set run name and output directory
    cfg["run_name"] = f'mBart_{cfg["dataset"]["name"]}_{cfg["text_column"]}2{cfg["summary_column"]}_{cfg["last_name"]}'
    cfg["output_dir"] = f'outputTrain/{cfg["dataset"]["name"]}/{cfg["text_column"]}2{cfg["summary_column"]}/{cfg["save_training_dir"]}'
    
    #save configuration
    if not Path(f'{cfg["output_dir"]}/config').exists():
        Path(f'{cfg["output_dir"]}/config').mkdir(parents=True, exist_ok=True)
    logging.warning(f"Saving configuration to {cfg['output_dir']}/config")
    write_json(Path(f'{cfg["output_dir"]}/config', "train_summarization_cfg.json"), cfg)
    return cfg

def return_saving_directory(save_training_dir2, last_name2, resume_, save_training_dir, last_name, **kwargs):
    if not resume_.get("keep_same_directory_as_loaded_cfg", True):
        return save_training_dir2, last_name2
    else:
        return save_training_dir, last_name



def get_training_args(**cfg):
    training_args = Seq2SeqTrainingArguments(
        run_name=cfg["run_name"],
        output_dir=cfg["output_dir"],
        evaluation_strategy="steps",
        per_device_train_batch_size=cfg['batch_size'],
        per_device_eval_batch_size=cfg['batch_size_eval'],
        learning_rate=cfg['learning_rate'],
        fp16=True,
        save_total_limit=cfg["save_total_limit"],
        logging_steps=cfg["logging_steps"],
        save_steps=cfg["save_steps"],
        eval_steps=cfg["eval_steps"],
        warmup_steps=cfg["warmup_steps"],
        num_train_epochs=cfg["num_train_epochs"],
        #weight_decay=0.00001,
        report_to="wandb", #comment if not having wandb account set up
    ) 
    rank = training_args.local_rank
    logging.info(f"created training arguments, rank: {rank}")
    return training_args


def get_tokenizer(base_model_name, resume=None, **kwargs):
    if resume is not None and resume.get("continue",False) and resume.get("is_checkpoint", True):
        logging.info(f"loading MBartTokenizerFast from checkpoint {resume['path_checkpoint']}")
        tokenizer = MBartTokenizerFast.from_pretrained(
            resume["path_checkpoint"], src_lang="cs_CZ", tgt_lang="cs_CZ")
    else:
        logging.info(f"loading MBartTokenizerFast")
        tokenizer = MBartTokenizerFast.from_pretrained(
            base_model_name, src_lang="cs_CZ", tgt_lang="cs_CZ")
    return tokenizer

def get_model(base_model_name,run_name, resume=None,  **kwargs):
    if resume is not None and resume.get("continue",False): #and not resume.get("is_checkpoint", True):
        logging.info("loading MBartForConditionalGeneration from file")
        model = MBartForConditionalGeneration.from_pretrained(resume["path_checkpoint"])
        logging.info(f'name = {run_name}')
        logging.info(f'checkpoint_model_name = {resume["path_checkpoint"]}')
    else:
        logging.info("loading MBartForConditionalGeneration")
        model = MBartForConditionalGeneration.from_pretrained(base_model_name)
        logging.info(f'name = {run_name}')
        logging.info(f'checkpoint_model_name = {base_model_name}')
    return model
    

# rotate dataset to continue training from last seen docs - only if checkoint is saved model
def rotate_trn_dataset_based_on_checkpoint(ds_trn, resume, batch_size, num_train_epochs, **kwargs):
    ep = 0
    if resume is not None and resume.get("continue",False) and not resume.get("is_checkpoint", True):
        s = 0
        if resume.get("previous", False):
            for path in resume["previous"]:
                s += int(Path(path).name.split("-")[-1])
        else:
            s = int(Path(resume["path_checkpoint"]).name.split("-")[-1])
        l = len(ds_trn)
        ep = (s * batch_size / l)
        ds_trn = datasets.concatenate_datasets([ds_trn.select(range((s*batch_size)%l,l))
            ,ds_trn.select(range(0,(s*batch_size)%l))])
        logging.info(f"The data set has been rotated with respect to the already trained steps {s} = {s*batch_size} documents = {ep} epochs")
    return ds_trn, ep

# set warmup steps to 0 and remaining epochs based on the checkpoint- only if checkoint is saved model
def repair_config_based_on_checkpoint(c, done_epochs, resume, **kwargs):
    if resume is not None and resume.get("continue",False) and not resume.get("is_checkpoint", True):
        c["num_train_epochs"] = c["num_train_epochs"] - done_epochs
        c["warmup_steps"] = 0
        logging.info("warmup_steps has been set to 0")
        logging.info(f"num_train_epochs has been set to {c['num_train_epochs']}")
    return c

# save best model based on evaluation loss
class BestEvalSaver(TrainerCallback):
    def __init__(self):
        self.min_loss = np.inf

    def on_evaluate(self, args, state, control, metrics, model, **kwargs):
        logging.info(f"on_evaluate rank: {args.local_rank}")
        if args.local_rank == 0 or args.local_rank == -1: #ensure saving by one GPU process
            loss = metrics["eval_loss"]
            if loss < self.min_loss:
                logging.info(f"lower evaluation loss {loss} (previous: {self.min_loss})")
                out_dir = Path(args.output_dir,"best", f"loss-{state.global_step}")
                self.min_loss = loss
                model.save_pretrained(out_dir)
                
                
                
                
                
if __name__ == "__main__":
    
    logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(name)s | %(levelname)s | %(message)s')
    
    cfg = summarization_config()
    
    #set seed
    set_seed(cfg["seed"])
    
    logging.info(f'Loading tokenized dataset from {cfg["dataset_dir"]}')
    dset = datasets.load_from_disk(cfg["dataset_dir"])
    
    if cfg.get("resume", False) and cfg["resume"].get("continue", False):
        dset["trn"], done_epochs = rotate_trn_dataset_based_on_checkpoint(dset["trn"], **cfg)
        cfg = repair_config_based_on_checkpoint(cfg,done_epochs=done_epochs,**cfg)
    
    training_args = get_training_args(**cfg)
    
    #change lr
    if cfg.get("resume", False) and cfg["resume"].get("continue", False):
        training_args.learning_rate = cfg["resume"].get("change_lr", training_args.learning_rate)
        logging.info(f"Learning step is set to: {training_args.learning_rate}")
        

    tokenizer = get_tokenizer(**cfg)
    model = get_model(**cfg)
    model.cuda() #comment if not using GPUs
    

    trainer = Trainer(
        model=model,
        tokenizer=tokenizer,
        args=training_args,
        train_dataset=dset["trn"],
        eval_dataset=dset["dev"],
        callbacks=[BestEvalSaver],
    )
    
    logging.info(f"Task is {cfg['text_column']}2{cfg['summary_column']} for {cfg['dataset']['name']} dataset")
    logging.info(f"Progress will be saved in the directory: {cfg['output_dir']}")
    
    if cfg.get("resume", False) and cfg["resume"].get("continue", False):
        if cfg["resume"].get("is_checkpoint", False):
            #training from saved HGFT checkpoint
            logging.info("Training from the checkpoint")
            trainer.train(cfg["resume"]["path_checkpoint"])
        else:
            #training from saved model
            logging.info("Training from the saved model")
            trainer.train()
    else:
        #training from base checkpoint
        logging.info("Training from the beginning")
        trainer.train()
    
    
    
