import axios from "axios";
import { apirUrl } from "../constants/apirUrl";

export const getHospitalizationList = async (): Promise<string[]> => {
  console.log("calling api");
  const response = await axios.get(apirUrl + "/hospitalizations");
  return response.data.hosp_ids;
};
