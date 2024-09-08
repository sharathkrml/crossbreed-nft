import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import { getBreedInputs } from "../../../utils/utils"
import { mint } from "../../../utils/viemRPC"

const SubmitPage = ({
  formData,
  setPageNo,
  showNFT,
  mintSubmitted,
}: {
  formData: { [key: string]: string }
  setPageNo: (page: number) => void
  showNFT: (tokenId: bigint) => Promise<void>
  mintSubmitted: boolean
}) => {
  const { isConnected, provider } = useWeb3Auth()
  const handleSubmit = async () => {
    if (isConnected && provider) {
      console.log(provider)
      const data = await mint(provider, getBreedInputs(formData))
      if (!data) return
      showNFT(data.tokenId)
    }
    // Here you would typically send the data to your blockchain
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-6">Review Your Answers</h2>
      <div className="flex flex-col gap-2">
        {Object.entries(formData).map(([key, value]: [string, string]) => (
          <div key={key} className="mb-2 flex justify-between">
            <p className="mr-2">{key}</p>
            <p> {value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        {!mintSubmitted ? (
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
            >
              Create My NFT
            </button>
            <button
              onClick={() => setPageNo(1)}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="loader mb-4"></div>
              <div>Loading...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubmitPage
