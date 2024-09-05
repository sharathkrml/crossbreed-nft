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

export default Question
