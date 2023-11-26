from typing import List, Optional

from pydantic import BaseModel


class OperationInDto(BaseModel):
    description: Optional[str]
    oper_proc: Optional[str]


class HospitalizationInDto(BaseModel):
    adm_cur_problems: Optional[str]
    adm_findings: Optional[str]
    adm_conclusion: Optional[str]
    dis_hosp_reason: Optional[str]
    dis_opers: Optional[str]
    dis_exams: Optional[str]
    operations: List[OperationInDto]


class HospitalizationIdsOutDto(BaseModel):
    hosp_ids: List[int]


class OperationOutDto(BaseModel):
    oper_id: int
    hosp_id: int
    description: Optional[str]
    oper_proc: Optional[str]


class HospitalizationOutDto(BaseModel):
    hosp_id: int
    adm_cur_problems: Optional[str]
    adm_findings: Optional[str]
    adm_conclusion: Optional[str]
    dis_hosp_reason: Optional[str]
    dis_opers: Optional[str]
    dis_exams: Optional[str]
    operations: List[str]


class LLModelOutDto(BaseModel):
    result: Optional[str]
