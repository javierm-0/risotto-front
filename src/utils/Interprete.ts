import { compareTwoStrings } from './stringSimilarity';
import { StrSimilarityResults } from '../types/StrSimilarityResult';

const sinonimos: Record<string, string[]> = {
    "consultar": ["preguntar", "ver", "revisar", "chequear", "buscar","hablar","conversar","comentar"],
    "técnico": ["tens", "profesional", "especialista"],
    "familia": ["parientes", "padres", "madre", "padre", "hermanos", "hermana", "hermano","hermanas","hermanos"],
    "antecedentes": ["historia", "historial", "registro"],
    "cambiar": ["modificar", "actualizar", "editar", "ajustar"],
    "enfermedad": ["patología", "condición", "diagnóstico"],
  };
  
  function reemplazarSinonimos(texto: string): string {
    Object.entries(sinonimos).forEach(([base, variantes]) => {
      variantes.forEach((variante) => {
        const regex = new RegExp(`\\b${variante}\\b`, 'gi');
        texto = texto.replace(regex, base);
      });
    });
    return texto;
  }


function quitarTildes(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  //lista de obj StrSimilarityResults
  export function evaluarSimilitud(frasesValidas: string[], inputUsuario: string): StrSimilarityResults[] {
    const inputNormalizado = quitarTildes(reemplazarSinonimos(inputUsuario.toLowerCase()));
  
    return frasesValidas.map((cadaFrase) => {
      const fraseNormalizada = reemplazarSinonimos(quitarTildes(cadaFrase.toLowerCase()));
      const rating = compareTwoStrings(inputNormalizado, fraseNormalizada);
      return {
        fraseValida: cadaFrase,
        fraseInput: inputUsuario,
        similarityRating: rating
      };
    });
  }
  
//esta funcion auxiliar recibe el array de frases validas, y la frase del usuario
//retornara la frase valida que mas se asemeje a la frase del usuario (mejor obj StrSimilarityResults)
//restringiendo a que la similitud sea mayor al ratingMinimo
function Interprete(frasesValidas: string[], inputUsuario: string) : StrSimilarityResults | null {
    const ratingMinimo = 0.38;// ← ajusta esto si quieres que sea mas o menos estricto(1 == imposible, 0 == permite todo xd)

    if(inputUsuario.length === 0) {
        return null;
    }
    const resultados : StrSimilarityResults[] = evaluarSimilitud(frasesValidas, inputUsuario);
    
    resultados.forEach(strRes => {
        console.log("Frase valida: " + strRes.fraseValida +
                     " - Frase input: " + strRes.fraseInput + 
                     " - Similarity: " + strRes.similarityRating);
    });

    const frasesAprobadas = resultados.filter((resultado) => resultado.similarityRating >= ratingMinimo);
    if (frasesAprobadas.length > 0) {
        let mejorFraseAprobada : StrSimilarityResults = frasesAprobadas[0];
        frasesAprobadas.forEach(fraseAprobada => {
            if(fraseAprobada.similarityRating > mejorFraseAprobada.similarityRating) {
                mejorFraseAprobada = fraseAprobada;
            }
        });
        return mejorFraseAprobada;
    }
    else{
        //la length es cero, entonces nadie cumplio el rating minimo
        return null;
    }


}

export default Interprete;


