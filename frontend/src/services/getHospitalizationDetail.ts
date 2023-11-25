import { Hospitalization } from "../model/Hospitalization";
import axios from "axios";
import { parseHospitalization } from "../parsers/parseHospitalization";
import { apirUrl } from "../constants/apirUrl";

export const getHospitalizationDetail = async (
  id: string,
): Promise<Hospitalization> => {
  const response = await axios.get(apirUrl + `/hospitalizations/${id}`);
  return parseHospitalization(response.data);
};
