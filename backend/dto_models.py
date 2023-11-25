from typing import List
from dataclasses import dataclass

from pydantic import BaseModel


# todo: add models for swagger


class OperationInDto(BaseModel):
    """
    Input Data Transfer Object (DTO) for representing an operation.

    Attributes:
    - oper_id (int): The unique identifier for the operation.
    - description (str): A description of the operation.
    - oper_proc (str): The procedural details of the operation.
    """
    description: str
    oper_proc: str


class HospitalizationInDto(BaseModel):
    """
    Input Data Transfer Object (DTO) for representing a hospitalization.

    Attributes:
    - hosp_id (int): The unique identifier for the hospitalization.
    - adm_cur_problems (str): Current problems observed during admission.
    - adm_findings (str): Findings observed during admission.
    - adm_conclusion (str): Conclusion drawn during admission.
    - dis_hosp_reason (str): Reason for discharge from the hospital.
    - dis_opers (str): Details of any operations performed during discharge.
    - dis_exams (str): Details of any examinations conducted during discharge.
    - operations (List[OperationInDto]): List of OperationInDto objects representing operations associated with the hospitalization.
    """
    adm_cur_problems: str
    adm_findings: str
    adm_conclusion: str
    dis_hosp_reason: str
    dis_opers: str
    dis_exams: str
    operations: List[OperationInDto]
