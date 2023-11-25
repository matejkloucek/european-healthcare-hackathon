import sqlite3

from dataclasses import dataclass, asdict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def create_connection():
    connection = sqlite3.connect("discharge.sqlite3", check_same_thread=False)
    return connection


db_conn = create_connection()
app = FastAPI(docs_url="/swagger", redoc_url="/redoc")  # TODO: sprovoznit krasne definovany swagger


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
    return {'hosp_ids': Hospitalization.get_all_ids()[:100]}  # todo: show more later


@app.get("/hospitalizations/{id}")
def get_detail(id: str):
    id_int = int(id)
    operations = Operation.get_operations_for_hospitalization(id_int)
    hospitalization = Hospitalization.get_detail(id_int)
    return asdict(hospitalization) | {"operations": operations}
