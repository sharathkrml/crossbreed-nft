import { questions } from "./constants"

export const getBreedInputs = (formData: { [key: string]: string }) => {
  // loop through the questions and get the breed inputs
  const breedInputs: number[] = []
  for (const question of questions) {
    let answerChose = formData[question.question]
    let optionIndex = question.options.indexOf(answerChose)
    breedInputs.push(optionIndex)
  }
  return breedInputs
}
