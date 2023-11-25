import torch
from transformers import MBartForConditionalGeneration
from transformers import MBartTokenizerFast
from sentence_splitter import SentenceSplitter, split_text_into_sentences
from collections import OrderedDict


class Summarizer:
    def __init__(self,model, tokenizer, inference_cfg):
        self.model = model
        self.model
        self.tokenizer = tokenizer
        self.inference_cfg = inference_cfg
        self.enc_max_len = 1024
    
    #summarize input text
    def __call__(self, texts, inference_cfg=None):
        if type(texts) == str:
            texts = [texts]
        assert type(texts) == list, "Expected string or list of strings"
        summaries = []
        self.inference_cfg = inference_cfg if inference_cfg is not None else self.inference_cfg
        for text in texts:
            text = self.tokenizer.eos_token.join(SentenceSplitter(language='cs').split(text))
            ttext = self.tokenizer(text,max_length = self.enc_max_len, truncation=True, padding="max_length",return_tensors="pt")
            # print(f"{len(ttext['input_ids'][0])=}")
            # print(f"{ttext=}")
            summaries.append(self._summarize(ttext,**self.inference_cfg)[0])
        return summaries
    
    #summarize batch of data
    def _summarize(self, data, num_beams=1, do_sample=False, 
                    top_k=50, 
                    top_p=1.0,
                    temperature=1.0,
                    repetition_penalty=1.0,
                    no_repeat_ngram_size = None,
                    max_length=1024,
                    min_length=10,
                    decode_decoder_ids = False,
                    early_stopping = False,**kwargs):
        summary = self.model.generate(input_ids=data["input_ids"],attention_mask=data["attention_mask"],
                                    num_beams= num_beams,
                                   do_sample= do_sample,
                                   top_k=top_k,
                                   top_p=top_p,
                                   temperature=temperature,
                                   repetition_penalty=repetition_penalty,
                                   max_length=max_length,
                                   min_length=min_length,
                                   early_stopping=early_stopping,
                                 forced_bos_token_id=self.tokenizer.lang_code_to_id['cs_CZ'],
                                 remove_invalid_values=True)
        return self.tokenizer.batch_decode(summary,skip_special_tokens=True)


def summ_config():
    cfg = OrderedDict([
        # summarization model - checkpoint from website
        ("model_name", "ctu-aic/mbart-at2h-cs-smesum-2"),
        ("inference_cfg", OrderedDict([
            ("num_beams", 1),
            ("top_k", 40),
            ("top_p", 0.92),
            ("do_sample", True),
            # ("temperature", 0.89),
            ("temperature", 0.2),
            ("repetition_penalty", 1.2),
            ("no_repeat_ngram_size", None),
            ("early_stopping", False),
            ("max_length", 250),
            ("min_length", 10),
        ])),
        #texts to summarize
        ("text",
            [
                'Basketbalisty Nového Jičína dělí jediná výhra od postupu do finále Mattoni NBL.</s>Rovněž ve druhé semifinálové bitvě Národní basketbalové ligy podala děčínská parta heroický výkon, opět to na vítězství nestačilo.</s>Ve velmi kvalitním utkání zvedali aktéři diváky v zaplněné hale ze sedaček, nakonec se z vítězství 86:85 radovali favorizovaní hosté z Nového Jičína.</s>Ti vedou v sérii 2:0 na zápasy a v pátek mohou slavit postup do finále.</s>"Víme, že teď bude složité soupeře porazit třikrát v řadě, ale oba zápasy byly vyrovnané a v tom třetím nás čeká nová partie.</s>My nic nevzdáváme," řekl děčínský trenér Pavel Budínský.</s>Utkání mělo dramatický průběh.</s>Hosté zlomili děčínský odpor až v úplném závěru.</s>V dresu domácích hráli dobře pivoti, avšak roli lídra opět prokázal americký rozehrávač Hatcher.</s>"Naštěstí on na vše nestačil.</s>Jsem šťastný, že vedeme 2:0.</s>Tentokrát jsme měli asi i štěstí," uvedl Zbyněk Choleva, kouč Nového Jičína.</s>Oba týmy se střídaly ve vedení.</s>Závěr však vyšel hostům.</s>"V klíčových momentech utkání jejich hráči předvedli něco extra.</s>Lídři soupeře nás na konci zlomili," dodal trenér Děčína.</s>Děčín – Nový Jičín 85:86 (28:20, 43:42, 67:60)</s>Body: Hatcher 25, Williams 16, P.</s>Houška 13, J.</s>Houška 10 – Muirhead 23, Ubilla 19, Walker 17.</s>Trojky: 25/8:19/9.</s>TH: 19/13:16/9.</s>Doskoky: 34:35.</s>Chyby: 20:18.</s>Rozhodčí: Vyklický, Lukeš, Hošek.</s>Diváci: 1020.</s>Nejlepší hráč: Muirhead (NJ).</s>Stav série: 0:2.'
            ]
        ),
    ])
    return cfg


def get_summarizer():
    cfg = summ_config()
    model = MBartForConditionalGeneration.from_pretrained('checkpoints/loss-900')
    tokenizer = MBartTokenizerFast.from_pretrained("facebook/mbart-large-cc25", src_lang="cs_CZ", tgt_lang="cs_CZ")
    summarize = Summarizer(model, tokenizer, cfg["inference_cfg"])
    return summarize
