import sqlite3

from dataclasses import dataclass, asdict
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from openai_gpt import OpenAiGptModel
from dto_models import *


def create_connection():
    connection = sqlite3.connect("discharge.sqlite3", check_same_thread=False)
    return connection


db_conn = create_connection()
app = FastAPI(docs_url="/swagger", redoc_url="/redoc")  # TODO: sprovoznit krasne definovany swagger

gpt_model = OpenAiGptModel(
    model="gpt-3.5-turbo-1106",
    # extra condition "STRUČNĚ" to be closer to the FT model
    system_message_content="Jste český mluvící zdravotní profesionál specializující "
                           "se na hospitalizační postupy. Generujte podrobné a přesné "
                           "popisy průběhu hospitalizace na základě informací z ostatních "
                           "částí lékařské zprávy. Ujistěte se, že vaše odpovědi jsou "
                           "STRUČNÉ, relevantní a vytvořené pouze na základě informací "
                           "poskytnutých uživatelem."
)
gpt_ft_model = OpenAiGptModel(
    model="ft:gpt-3.5-turbo-1106:czech-technical-university-in-prague::8OkdEykf",
    system_message_content="Jste český mluvící zdravotní profesionál specializující "
                           "se na hospitalizační postupy. Generujte podrobné a přesné "
                           "popisy průběhu hospitalizace na základě informací z ostatních "
                           "částí lékařské zprávy. Ujistěte se, že vaše odpovědi jsou "
                           "relevantní a vytvořené pouze na základě informací "
                           "poskytnutých uživatelem."
)


@dataclass
class Operation:
    oper_id: int
    hosp_id: int
    description: str
    oper_proc: str

    @classmethod
    def get_operations_for_hospitalization(cls, hosp_id: int):
        cursor = db_conn.cursor()
        operations_for_patient = cursor.execute(
            "SELECT * FROM Operations WHERE hosp_id = ?", (hosp_id,)
        ).fetchall()
        return [cls(*operation) for operation
                in operations_for_patient]

    def to_string(self):
        return ', '.join(f"Procedura: {self.oper_proc}, Popis operace: {self.description}")


@dataclass
class Hospitalization:
    hosp_id: int
    adm_cur_problems: str
    adm_findings: str
    adm_conclusion: str
    dis_hosp_reason: str
    dis_opers: str
    dis_exams: str

    @staticmethod
    def get_all_ids():
        cursor = db_conn.cursor()
        rows = cursor.execute("SELECT hosp_id FROM Hospitalization").fetchall()
        return [str(row[0]) for row in rows]

    @classmethod
    def get_detail(cls, hosp_id: int):
        cursor = db_conn.cursor()
        hospitalization_row = cursor.execute(
            "SELECT "
            "hosp_id, "
            "adm_cur_problems, "
            "adm_findings, "
            "adm_conclusion, "
            "dis_hosp_reason, "
            "dis_opers, "
            "dis_exams FROM Hospitalization WHERE hosp_id = ?", (hosp_id,)
        ).fetchone()
        return cls(*hospitalization_row)

    def to_string(self, operations: List[Operation]):
        sections = []
        if self.adm_cur_problems:
            sections.append(f"Problémy pacienta při příjetí: {self.adm_cur_problems}")
        if self.adm_findings:
            sections.append(f"Nálezy při přijetí: {self.adm_findings}")
        if self.adm_conclusion:
            sections.append(f"Závěr při přijetí: {self.adm_conclusion}")
        if self.dis_hosp_reason:
            sections.append(f"Důvod hospitalizace: {self.dis_hosp_reason}")
        if self.dis_opers:
            sections.append(f"Operace při propuštění: {self.dis_opers}")
        if self.dis_exams:
            sections.append(f"Testy při propuštění: {self.dis_exams}")
        if operations:
            sections.append(f"Provedené operace: "
                            f"{[operation.to_string() for operation in operations]}")

        return ', '.join(sections)


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # FE URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def hello():
    return "Hello"


@app.get("/hospitalizations")
def get_all():
    """
    Return all hospitalizations ids.
    """
    return {'hosp_ids': Hospitalization.get_all_ids()[-100:]}  # todo: show more later


@app.get("/hospitalizations/{id}")
def get_detail(id: str):
    id_int = int(id)
    operations = Operation.get_operations_for_hospitalization(id_int)
    hospitalization = Hospitalization.get_detail(id_int)
    return asdict(hospitalization) | {"operations": operations}


@app.get("/hospitalizations/{id}/gpt")
def gpt(id: str):
    """
    Generate hospitalization procedure with fined tuned GPT-3.5
    :param id:
    :return:
    """
    hosp_id = int(id)
    operations = Operation.get_operations_for_hospitalization(hosp_id)
    hospitalization = Hospitalization.get_detail(hosp_id)
    return {"result": gpt_model.ask(hospitalization.to_string(operations))}


@app.get("/hospitalizations/{id}/gpt-ft")
def gpt_ft(id: str):
    """
    Generate hospitalization procedure with fined tuned GPT-3.5
    :param id:
    :return:
    """
    hosp_id = int(id)
    operations = Operation.get_operations_for_hospitalization(hosp_id)
    hospitalization = Hospitalization.get_detail(hosp_id)
    return {"result": gpt_ft_model.ask(hospitalization.to_string(operations))}


@app.get("/hospitalizations/{id}/human")
def human(id: str):
    """
    todo:
    :param id:
    :return:
    """
    cursor = db_conn.cursor()
    human_discharge = cursor.execute(
        "SELECT dis_hosp_summary FROM Hospitalization WHERE hosp_id = ?", (int(id),)
    ).fetchone()
    return {"result": human_discharge[0]}
