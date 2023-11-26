from typing import List

from pydantic import BaseModel


class OperationInDto(BaseModel):
    description: str
    oper_proc: str


class HospitalizationInDto(BaseModel):
    adm_cur_problems: str
    adm_findings: str
    adm_conclusion: str
    dis_hosp_reason: str
    dis_opers: str
    dis_exams: str
    operations: List[OperationInDto]


class HospitalizationIdsOutDto(BaseModel):
    hosp_ids: List[int]


class OperationOutDto(BaseModel):
    oper_id: int
    description: str
    oper_proc: str


class HospitalizationOutDto(BaseModel):
    hosp_id: int
    adm_cur_problems: str
    adm_findings: str
    adm_conclusion: str
    dis_hosp_reason: str
    dis_opers: str
    dis_exams: str
    operations: List[OperationOutDto]


class LLModelOutDto(BaseModel):
    result: str
