import axios from "axios";
import { Case } from "../types/NPCTypes";

    export async function CrearCaso(backUrl: string, jsonCase:Case) : Promise<boolean> {
        try {
            const response = await axios.post(backUrl,jsonCase)
            if(response.status === 201){
                console.log("Caso creado, epico");
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
    };