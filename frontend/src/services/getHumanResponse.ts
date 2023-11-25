import axios from "axios";
import { apirUrl } from "../constants/apirUrl";

export const getHumanResponse = async (id: string): Promise<string> => {
  const response = await axios.get(apirUrl + `/hospitalizations/${id}/human`);
  return response.data.result;
};
