"use client"
import React, { useState } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/router"
import { questions } from "../../utils/constants"

// Shared layout component
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">NFT Personality Quiz</h1>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// Question component
const Question = ({ question, options, value, onChange }: { question: string; options: string[]; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
  <div className="space-y-2 mb-6">
    <label className="block font-medium">{question}</label>
    <select value={value} onChange={onChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
      <option value="">Select an option</option>
      {options.map((option, index) => (
        <option key={index} value={`${String.fromCharCode(97 + index)}) ${option}`}>
          {option}
        </option>
      ))}
    </select>
  </div>
)

// Landing Page
// const LandingPage = () => {
//   const router = useRouter()

//   return (
//     <Layout>
//       <div className="text-center">
//         <h2 className="text-2xl mb-4">Welcome to the NFT Personality Quiz</h2>
//         <p className="mb-8">Create your unique NFT based on your personality!</p>
//         <button onClick={() => router.push("/quiz/1")} className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
//           Start Quiz
//         </button>
//       </div>
//     </Layout>
//   )
// }

// Quiz Pages
const QuizPage = ({ pageNumber, questions, formData, setFormData }: { pageNumber: number; questions: { id: string; question: string; options: string[] }[]; formData: { [key: string]: string }; setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: string }>> }) => {
  const router = useRouter()

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleNext = () => {
    if (pageNumber < 3) {
      router.push(`/quiz/${pageNumber + 1}`)
    } else {
      router.push("/submit")
    }
  }

  return (
    <Layout>
      <div>
        <h2 className="text-2xl mb-6">Page {pageNumber} of 3</h2>
        {questions.map((q: { id: string; question: string; options: string[] }) => (
          <Question key={q.id} question={q.question} options={q.options} value={formData[q.id] || ""} onChange={(e) => handleChange(q.id, e.target.value)} />
        ))}
        <div className="flex justify-between">
          {pageNumber > 1 && (
            <button onClick={() => router.push(`/quiz/${pageNumber - 1}`)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">
              Previous
            </button>
          )}
          <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
            {pageNumber === 3 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </Layout>
  )
}

// Submit Page
const SubmitPage = ({ formData }: { formData: { [key: string]: string } }) => {
  const router = useRouter()

  const handleSubmit = () => {
    // Here you would typically send the data to your blockchain
    console.log("Submitting to blockchain:", formData)
    // For now, we'll just redirect to a success page
    router.push("/success")
  }

  return (
    <Layout>
      <div>
        <h2 className="text-2xl mb-6">Review Your Answers</h2>
        {Object.entries(formData).map(([key, value]: [string, string]) => (
          <p key={key} className="mb-2">
            <strong>{key}:</strong> {value}
          </p>
        ))}
        <button onClick={handleSubmit} className="mt-6 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200">
          Create My NFT
        </button>
      </div>
    </Layout>
  )
}

// Main App Component
export default function NFTPersonalityQuiz() {
  const [formData, setFormData] = useState({})
  const router = useRouter()
  const { page } = router.query

  const getQuestionsForPage = (pageNumber: number) => {
    const startIndex = (pageNumber - 1) * 5
    return questions.slice(startIndex, startIndex + 5)
  }

  // if (router.pathname === "/") {
  //   return <LandingPage />
  // }

  if (router.pathname === "/submit") {
    return <SubmitPage formData={formData} />
  }

  if (router.pathname.startsWith("/quiz/")) {
    const pageNumber = parseInt(page as string)
    return <QuizPage pageNumber={pageNumber} questions={getQuestionsForPage(pageNumber)} formData={formData} setFormData={setFormData} />
  }

  return <div>Loading...</div>
}
