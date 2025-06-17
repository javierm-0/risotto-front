// Interprete.ts
import { compareTwoStrings } from './stringSimilarity';
import { StrSimilarityResults } from '../types/StrSimilarityResult';

const sinonimos: Record<string, string[]> = {
  consultar: ['preguntar', 'ver', 'revisar', 'chequear', 'buscar', 'hablar', 'conversar', 'comentar', 'decir'],
  tecnico: ['tens', 'profesional', 'especialista', 'paramédico', 'auxiliar'],
  familia: ['parientes', 'madre', 'padre', 'mamá', 'papá', 'hermano', 'hermana', 'cuidadora', 'cuidador', 'acompañante', 'hijo', 'hija'],
  antecedentes: ['historial', 'historia', 'registro', 'eventos previos'],
  medicación: ['remedios', 'medicinas', 'fármacos', 'tratamiento', 'pastillas', 'tabletas'],
  enfermedad: ['patología', 'condición', 'diagnóstico', 'problema', 'afección'],
  cambiar: ['modificar', 'ajustar', 'editar', 'alterar', 'variar'],
  sonda: ['catéter', 'tubo', 'sng', 'alimentación enteral'],
};

function reemplazarSinonimos(texto: string): string {
  const palabras = texto.split(/\b/);
  return palabras
    .map((palabra) => {
      const base = Object.entries(sinonimos).find(([_, variantes]) =>
        variantes.includes(palabra.toLowerCase())
      );
      return base ? base[0] : palabra;
    })
    .join('');
}

function quitarTildes(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function evaluarSimilitud(frasesValidas: string[], inputUsuario: string): StrSimilarityResults[] {
  const inputNormalizado = quitarTildes(reemplazarSinonimos(inputUsuario.toLowerCase()));

  return frasesValidas.map((cadaFrase) => {
    const fraseNormalizada = reemplazarSinonimos(quitarTildes(cadaFrase.toLowerCase()));
    const rating = compareTwoStrings(inputNormalizado, fraseNormalizada);
    return {
      fraseValida: cadaFrase,
      fraseInput: inputUsuario,
      similarityRating: rating,
    };
  });
}

function Interprete(
  frasesValidas: string[],
  inputUsuario: string,
  ratingMinimo: number = 0.45
): StrSimilarityResults | null {
  if (inputUsuario.trim().length === 0) return null;

  const resultados: StrSimilarityResults[] = evaluarSimilitud(frasesValidas, inputUsuario);


  const frasesAprobadas = resultados.filter((r) => r.similarityRating >= ratingMinimo);
  if (frasesAprobadas.length > 0) {
    return frasesAprobadas.reduce((mejor, actual) =>
      actual.similarityRating > mejor.similarityRating ? actual : mejor
    );
  }

  return null;
}

/**
 * Interprete con contexto del tipo de análisis
 * @param tipo "clinica" o "comando"
 * @param ratingMinimoCustom opcional
 */
export function interpretarConContexto(
  frasesValidas: string[],
  inputUsuario: string,
  tipo: 'clinica' | 'comando' = 'clinica',
  ratingMinimoCustom?: number
): StrSimilarityResults | null {
  const umbral = ratingMinimoCustom ?? (tipo === 'comando' ? 0.35 : 0.6);
  return Interprete(frasesValidas, inputUsuario, umbral);
}

export default Interprete;
