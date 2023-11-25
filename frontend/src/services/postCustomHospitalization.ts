import { Hospitalization } from "../model/Hospitalization";
import axios from "axios";
import { apirUrl } from "../constants/apirUrl";

export const postCustomHospitalization = async (
  hospitalization: Hospitalization,
): Promise<string> => {
  const data = {
    adm_cur_problems: hospitalization.problemsAtAdmission,
    adm_findings: hospitalization.findingsAtAdmission,
    adm_conclusion: hospitalization.conclusionAtAdmission,
    dis_hosp_reason: hospitalization.reasonForHospitalisation,
    dis_opers: hospitalization.reasonForHospitalisation,
    dis_exams: hospitalization.examsAtDischarge,
    operations: [
      {
        description: "",
        oper_proc: "",
      },
    ],
  };
  const response = await axios.post(apirUrl + `/hospitalizations/create`, data);
  console.log(response.data);
  return response.data;
};
