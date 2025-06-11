import axios from "axios";
import { Case } from "../types/NPCTypes";


export async function UpdateCasoAux(backurl: string, updatedCase: Case) : Promise<boolean>{
    try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(backurl+updatedCase._id,updatedCase,{headers: { Authorization: `Bearer ${token}` }});
        if(response.status === 200 ){
            console.log("UpdateCasoAux: Data actualizada");
            console.log("por si acaso(200): ",response.data);
            return true;
        }
        console.warn(`UpdateCasoAux: Unexpected status ${response.status}`);
        return false;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error("UpdateCasoAux: Axios error", error.response?.data || error.message);
        } else {
            console.error("UpdateCasoAux: Unknown error", error);
        }
        return false;
    }
}