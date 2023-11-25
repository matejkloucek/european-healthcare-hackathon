import axios from "axios";
import {apirUrl} from "../constants/apirUrl";

export const getHumanResponse = async (id: string): Promise<string> => {
    const response = await axios.get(apirUrl+ `/hospitalizations/${id}/human`);
    console.log("Human response:", response.data.result)
    return response.data.result;
};