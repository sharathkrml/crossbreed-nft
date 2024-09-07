import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import { getChainId } from "viem/actions"
import { getBreedInputs } from "../../../utils/utils"
import { mint } from "../../../utils/viemRPC"

const SubmitPage = ({
  formData,
  setPageNo,
  showNFT,
}: {
  formData: { [key: string]: string }
  setPageNo: (page: number) => void
  showNFT: (tokenId: bigint) => Promise<void>
}) => {
  const { isConnected, connect, web3Auth, initModal, provider } = useWeb3Auth()
  const handleSubmit = async () => {
    if (isConnected && provider) {
      let data = await mint(provider, getBreedInputs(formData))
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
    </div>
  )
}

export default SubmitPage
