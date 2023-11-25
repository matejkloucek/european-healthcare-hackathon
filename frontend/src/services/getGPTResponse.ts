import axios from "axios";
import { apirUrl } from "../constants/apirUrl";

export const getGPTResponse = async (id: string): Promise<string> => {
  const response = await axios.get(apirUrl + `/hospitalizations/${id}/gpt`);
  return response.data.result;
};
