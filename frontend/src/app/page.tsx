"use client"
import Link from "next/link"
import { useState } from "react"
import { questions } from "../../utils/constants"
import QuizPage from "./ui/QuizPage"
import SubmitPage from "./ui/SubmitPage"

// Landing Page
const LandingPage = () => {
  const [formData, setFormData] = useState({})
  const [page, setPage] = useState(0)
  const [wallet, setWallet] = useState(false)

  const incrementPage = () => {
    setPage((page) => {
      return page + 1
    })
  }

  const decrementPage = () => {
    setPage((page) => {
      return page - 1
    })
  }

  const setPageNo = (page: number) => {
    setPage(page)
  }
  if (page === 0)
    return (
      <div className="text-center">
        <h2 className="text-2xl">Welcome to the NFT Personality Quiz</h2>
        <p className="mb-8">Create your unique NFT based on your personality!</p>
        <button
          onClick={() => {
            if (wallet) {
              setPage(1)
            } else setWallet(true)
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          {wallet ? `Start Quiz` : `Connect Wallet`}
        </button>
      </div>
    )
  if (page > 0 && page < 4) {
    return <QuizPage pageNumber={page} questions={questions} formData={formData} setFormData={setFormData} incrementPage={incrementPage} decrementPage={decrementPage} />
  }
  if (page === 4) {
    return <SubmitPage formData={formData} setPageNo={setPageNo} />
  }
  return (
    <div className="text-center">
      <h2 className="text-2xl">Welcome to the NFT Personality Quiz</h2>
      <p className="mb-8">Create your unique NFT based on your personality!</p>
      <button
        onClick={() => {
          if (wallet) {
            setPage(1)
          } else setWallet(true)
        }}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
      >
        {wallet ? `Start Quiz` : `Connect Wallet`}
      </button>
    </div>
  )
}

export default LandingPage
