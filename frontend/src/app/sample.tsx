"use client"
import React, { useState } from "react"
import { useTheme } from "next-themes"
import { questions } from "../../utils/constants"

export default function NFTPersonalityQuiz() {
  const [formData, setFormData] = useState<{ [key: string]: string }>({})
  const [prompt, setPrompt] = useState("")
  const { theme, setTheme } = useTheme()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const choices = Object.values(formData)
    const styleModifiers = ["painterly", "vintage", "digital art", "abstract"]
    const styleIndex =
      choices.reduce((acc: number, choice: string) => {
        return acc + ["a", "b", "c", "d"].indexOf(choice.charAt(0))
      }, 0) % 4
    const style = styleModifiers[styleIndex]

    const character = formData.magicalCreature || ("character" as string)
    const setting = formData.weekendActivity || formData.vacationDestination || ("setting" as string)
    const element1 = formData.guiltyPleasure || formData.hobby || formData.socialMediaPlatform || formData.transportation || ("element1" as string)
    const element2 = formData.superpower || formData.foodCuisine || ("element2" as string)
    const mood = formData.karaokeSong || ("mood" as string)

    const generatedPrompt = `Generate a ${style} style image of a ${character} in a ${setting} with ${element1} and ${element2}, mood: ${mood}`
    setPrompt(generatedPrompt)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">NFT Personality Quiz</h1>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <label className="block font-medium">{q.question}</label>
              <select name={q.id} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                <option value="">Select an option</option>
                {q.options.map((option, index) => (
                  <option key={index} value={`${String.fromCharCode(97 + index)}) ${option}`}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
            Generate NFT Prompt
          </button>
        </form>
        {prompt && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <h2 className="text-xl font-bold mb-2">Generated Prompt:</h2>
            <p>{prompt}</p>
          </div>
        )}
      </div>
    </div>
  )
}
