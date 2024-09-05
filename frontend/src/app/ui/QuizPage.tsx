import clsx from "clsx"
import Question from "./Question"

const QuizPage = ({ pageNumber, questions, formData, setFormData, incrementPage, decrementPage }: { pageNumber: number; questions: { id: string; question: string; options: string[] }[]; formData: { [key: string]: string }; setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>; incrementPage: () => void; decrementPage: () => void }) => {
  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <div>
      <h2 className="text-2xl mb-6 text-center">Page {pageNumber} of 3</h2>
      {questions.slice((pageNumber - 1) * 5, (pageNumber - 1) * 5 + 5).map((q: { id: string; question: string; options: string[] }) => (
        <Question key={q.id} question={q.question} options={q.options} value={formData[q.id] || ""} onChange={(e) => handleChange(q.id, e.target.value)} />
      ))}
      <div className={clsx(pageNumber !== 1 ? "flex justify-between" : "flex justify-end")}>
        {pageNumber > 1 && (
          <button onClick={decrementPage} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">
            Previous
          </button>
        )}
        <button onClick={incrementPage} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
          {pageNumber === 3 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  )
}

export default QuizPage
