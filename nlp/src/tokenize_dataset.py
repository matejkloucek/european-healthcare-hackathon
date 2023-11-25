import torch
import numpy as np

from collections import OrderedDict

import pandas as pd

import datasets
from datasets import DatasetDict

import json
from pathlib import Path

from sumeczech.rouge_raw import RougeRaw

from transformers import MBartForConditionalGeneration
from transformers import MBartTokenizerFast

from sentence_splitter import SentenceSplitter, split_text_into_sentences
from transformers.models.mbart.modeling_mbart import shift_tokens_right

import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(name)s | %(levelname)s | %(message)s')


#
def tokenization_config():
    return OrderedDict([
        #path to the dataset, expected each split in json file
        ("dataset_path", "../dataset"),
        # ("splits", ["trn","tst","dev"]),
        ("splits", ["trn"]),
        
        #save directory
        ("save_dir", "../tokenized_dataset"),
        
        # task ftext2headline = AT2H, htext2abstract = HT2A, text2abstract = T2A...
        ("text_column", "information"),
        ("summary_column", "summary"),
        
        # input tokens - truncation and padding
        ("encoder_input_ids", 512),
        ("decoder_input_ids", 64),

        #("encoder_input_ids", 512),
        #("decoder_input_ids", 128),
        
        #comment to tokenize whole dataset
        # ("max_samples", 8),
    ])

def load_dataset_splits(dataset_path, splits, max_samples=None, **kwargs):
    data_files = {}
    for split in splits:
        data_files[split] = str(Path(dataset_path,f"{split}.csv"))
    dst = datasets.load_dataset("csv", data_files=data_files)
    logging.info(f"load splits from {data_files}")
    if max_samples is not None:
        logging.info(f"setting max samples {max_samples} per each split")
        for split in splits:
            dst[split] = dst[split].select(range(max_samples))
    return dst

def prepare_batch(batch,tokenizer, sentence_separator, text_column, summary_column, encoder_input_ids, decoder_input_ids,**kwargs):
    #create AT2H or HT2A task
    if text_column == "ftext":
        batch[text_column] = [(" " if z[0].endswith(".") else ". ").join(z) for z in zip(batch["abstract"],batch["text"])]
    elif text_column == "htext":
        batch[text_column] = [(" " if z[0].endswith(".") or z[0].endswith("?") or z[0].endswith("!") else ". ").join(z) for z in zip(batch["headline"],batch["text"])]
    
    # separate input sentences with sentence separator token 
    batch[text_column] = [tokenizer.eos_token.join(sentence_separator.split(t)) for t in batch[text_column]]
    return batch


def tokenize_batch(batch, tokenizer, encoder_input_ids, decoder_input_ids, text_column, summary_column="",**kwargs):
    tokenized_encoder_input = tokenizer(batch[text_column], truncation=True, padding="max_length", max_length=encoder_input_ids,return_tensors="pt")
    if summary_column!="":
        with tokenizer.as_target_tokenizer():
            tokenized_decoder_input = tokenizer(batch[summary_column], truncation=True, padding="max_length", max_length=decoder_input_ids,return_tensors="pt")
        #create labels and padding tokens in the labels replace by -100 so the cross_entriopy loss ignores the pad tokens when computing the loss.
        labels = tokenized_decoder_input["input_ids"].clone()
        labels[tokenized_decoder_input["attention_mask"]==0] = -100
        #shift decoder input ids
        tokenized_decoder_input["input_ids"] = shift_tokens_right(tokenized_decoder_input["input_ids"], tokenizer.pad_token_id)
        return {"input_ids": tokenized_encoder_input["input_ids"].tolist(), "attention_mask" : tokenized_encoder_input["attention_mask"].tolist(),
                "decoder_input_ids" : tokenized_decoder_input["input_ids"].tolist(), "decoder_attention_mask": tokenized_decoder_input["attention_mask"].tolist(),
                "labels" : labels.tolist()
               }
    else:
        return {"input_ids": tokenized_encoder_input["input_ids"].tolist(), "attention_mask" : tokenized_encoder_input["attention_mask"].tolist() }
    
    
if __name__ == "__main__":
    
    cfg = tokenization_config()
    cfg["sentence_separator"] = SentenceSplitter(language='cs')
    cfg["tokenizer"] = MBartTokenizerFast.from_pretrained("facebook/mbart-large-cc25", src_lang="cs_CZ", tgt_lang="cs_CZ")
    dst = load_dataset_splits(**cfg)
    prepared_dst = dst.map(prepare_batch,batched=True, batch_size=1024, fn_kwargs=cfg)
    # tokenized_dst = prepared_dst.map(tokenize_batch,batched=True, batch_size=1024, fn_kwargs=cfg,remove_columns=["abstract","headline","text"])
    tokenized_dst = prepared_dst.map(tokenize_batch,batched=True, batch_size=1024, fn_kwargs=cfg)
    tokenized_dst.save_to_disk(f"{Path(cfg['save_dir'],cfg['text_column']+'2'+cfg['summary_column'])}")
    
    
