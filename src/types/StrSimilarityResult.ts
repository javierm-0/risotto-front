
//la idea de esto es que este objeto guarda la frase valida, junto a la frase de input del usuario,
//y el resultado de que tan parecidas son estas dos frases
export interface StrSimilarityResults {
    fraseValida: string;//frase valida desde el back
    fraseInput: string;//lo que el usuario ingreso
    similarityRating: number;//entre 0 y 1, 1 siendo practicamente igual
}