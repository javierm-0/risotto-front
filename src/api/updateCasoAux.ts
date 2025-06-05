import axios from "axios";
import { Case } from "../types/NPCTypes";

export async function UpdateCasoAux(backurl: string, updatedCase: Case) : Promise<boolean>{
    try {
        const response = await axios.patch(backurl,updatedCase);
        if(response.status === 200 ){
            console.log("UpdateCasoAux: Data actualizada");
            console.log("por si acaso(200): ",response.data);
            return true;
        }
        else if (response.status === 204){
            console.warn("UpdateCasoAux: No context");
            console.log("por si acaso (204): ",response.data);
            return true;
        }
        else{
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
    return false;
}