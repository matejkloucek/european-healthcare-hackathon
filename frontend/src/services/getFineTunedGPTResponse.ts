import axios from "axios";
import { apirUrl } from "../constants/apirUrl";

export const getFineTunedGPTResponse = async (id: string): Promise<string> => {
  const response = await axios.get(apirUrl + `/hospitalizations/${id}/gpt-ft`);
  return response.data.result;
};
