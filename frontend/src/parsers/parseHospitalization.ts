import { Hospitalization } from "../model/Hospitalization";

export const parseHospitalization = (data: any): Hospitalization => {
  return {
    id: data.hosp_id,
    problemsAtAdmission: data.adm_cur_problems,
    findingsAtAdmission: data.adm_findings,
    conclusionAtAdmission: data.adm_conclusion,
    reasonForHospitalisation: data.dis_hosp_reason,
    operationsAtDischarge: data.dis_opers,
    examsAtDischarge: data.dis_exams,
  };
};
