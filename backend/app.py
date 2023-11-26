import random
import sqlite3

from dataclasses import asdict, dataclass

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from openai_gpt import OpenAiGptModel
from os_model import get_summarizer
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

os_model_fn = get_summarizer()


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
    allow_origins=["http://localhost:3000", "http://20.218.157.209:3000",
                   "http://disquill.mild.blue:3000", "http://disquill.mild.blue"],  # FE URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/hospitalizations", response_model=HospitalizationIdsOutDto)
def get_all():
    """
    Get all hospitalizations IDs.
    """
    return {'hosp_ids': Hospitalization.get_all_ids()}


@app.get("/hospitalizations/{id}", response_model=HospitalizationOutDto)
def get_detail(id: str):
    """
    Get detail of the hospitalization.
    :param id:
    :return:
    """
    id_int = int(id)
    operations = Operation.get_operations_for_hospitalization(id_int) or []
    hospitalization = Hospitalization.get_detail(id_int)
    return asdict(hospitalization) | {"operations": operations}


@app.post("/hospitalizations/create")
def create_new_hospitalization(hosp_dto: HospitalizationInDto):
    """
    Create new hospitalization record.
    :param hosp_dto:
    :return:
    """
    # generate hosp id todo: make this logic better by using UUID or autoincrement in DB
    hosp_id = random.randrange(1, 5000)

    cursor = db_conn.cursor()
    try:
        # create operations for hospitalization
        if hosp_dto.operations:
            oper_id = random.randrange(1, 5000)  # todo: make this logic better by using UUID or autoincrement in DB
            opers_query = "INSERT INTO Operations (oper_id, hosp_id, description, oper_proc)" \
                          " VALUES (?, ?, ?, ?)"
            cursor.executemany(opers_query, [(oper_id,
                                              hosp_id,
                                              oper.description,
                                              oper.oper_proc) for oper in hosp_dto.operations])
        # create hospitalization itself
        cursor.execute("INSERT INTO Hospitalization "
                       "(hosp_id, adm_cur_problems, adm_findings, adm_conclusion, "
                       "dis_hosp_reason, dis_opers, dis_exams) VALUES (?, ?, ?, ?, ?, ?, ?)",
                       (hosp_id,
                        hosp_dto.adm_cur_problems,
                        hosp_dto.adm_findings,
                        hosp_dto.adm_conclusion,
                        hosp_dto.dis_hosp_reason,
                        hosp_dto.dis_opers,
                        hosp_dto.dis_exams))
    except sqlite3.IntegrityError as ex:
        raise HTTPException(status_code=400, detail=f"{str(ex)}")
    db_conn.commit()
    return hosp_id


@app.get("/hospitalizations/{id}/gpt", response_model=LLModelOutDto)
def gpt(id: str):
    """
    Generate hospitalization summary with GPT-3.5
    :param id:
    :return:
    """
    hosp_id = int(id)
    operations = Operation.get_operations_for_hospitalization(hosp_id)
    hospitalization = Hospitalization.get_detail(hosp_id)
    return {"result": gpt_model.ask(hospitalization.to_string(operations))}


@app.get("/hospitalizations/{id}/gpt-ft", response_model=LLModelOutDto)
def gpt_ft(id: str):
    """
    Generate hospitalization summary with fined tuned GPT-3.5
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
    Get hospitalization summary (dis_hosp_summary) as ground truth.
    :param id:
    :return:
    """
    cursor = db_conn.cursor()
    human_discharge = cursor.execute(
        "SELECT dis_hosp_summary FROM Hospitalization WHERE hosp_id = ?", (int(id),)
    ).fetchone()
    return {"result": human_discharge[0]}


@app.get("/hospitalizations/{id}/os-model", response_model=LLModelOutDto)
def os_model(id: str):
    """
    Generate hospitalization summary with our own open source LLM.
    :param id:
    :return:
    """
    # todo: Skip operations for the os model now
    hosp_id = int(id)
    hospitalization = Hospitalization.get_detail(hosp_id)
    return {"result": os_model_fn(hospitalization.to_string([]))}
