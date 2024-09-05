const SubmitPage = ({ formData, setPageNo }: { formData: { [key: string]: string }; setPageNo: (page: number) => void }) => {
  const handleSubmit = () => {
    // Here you would typically send the data to your blockchain
    console.log("Submitting to blockchain:", formData)
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-6">Review Your Answers</h2>
      {Object.entries(formData).map(([key, value]: [string, string]) => (
        <p key={key} className="mb-2">
          <strong>{key}:</strong> {value}
        </p>
      ))}
      <div className="flex gap-3">
        <button onClick={handleSubmit} className="mt-6 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200">
          Create My NFT
        </button>
        <button onClick={() => setPageNo(1)} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
          Back
        </button>
      </div>
    </div>
  )
}

export default SubmitPage
