export type Hospitalization = {
  id: string;
  problemsAtAdmission: string;
  findingsAtAdmission: string;
  conclusionAtAdmission: string;
  reasonForHospitalisation: string;
  operationsAtDischarge: string;
  examsAtDischarge: string;
  operations?: string[];
};
