import axios from "axios";
import { apirUrl } from "../constants/apirUrl";

export const getOssResponse = async (id: string): Promise<string> => {
  const response = await axios.get(
    apirUrl + `/hospitalizations/${id}/os-model`,
  );
  return response.data.result;
};
