import { NFTInfo } from "../../../utils/viemRPC"

import { questions } from "../../../utils/constants"
type NFTModalProps = {
  isOpen: boolean
  onClose: () => void
  nft: NFTInfo
  tokenIdToNftInfo: {
    [key: string]: NFTInfo
  }
}
const NFTModal = ({
  isOpen,
  onClose,
  nft,
  tokenIdToNftInfo,
}: NFTModalProps) => {
  if (!isOpen) return null
  const imageUri1 = tokenIdToNftInfo[nft.parent1.toString()]?.imageUrl || ""
  const imageUri2 = tokenIdToNftInfo[nft.parent2.toString()]?.imageUrl || ""
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black/80 rounded-lg shadow-lg p-6 w-3/4 max-w-4xl">
        <p className="text-center">
          <span className="font-bold">Token ID:</span> {nft.tokenId.toString()}
        </p>
        <div className="flex">
          <div className="w-1/2 p-4">
            <img
              src={nft.imageUrl}
              alt="NFT"
              width={350}
              height={350}
              className="object-cover rounded-lg"
            />
            <p className="mt-2">
              <span className="font-bold">Owner:</span> {nft.owner}
            </p>
            {/* <p className="mt-2">
              <span className="font-bold">Current Owner:</span>{" "}
              {nft.currentOwner}
            </p> */}
            {imageUri1 && imageUri2 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Parents</h3>
                <div className="flex items-center space-x-4">
                  {imageUri1 != "" && (
                    <div className="text-center">
                      <img
                        src={imageUri1}
                        alt="Parent 1"
                        className="rounded-lg"
                      />
                      <p className="mt-2 font-bold">
                        Token ID: {nft.parent1.toString()}
                      </p>
                    </div>
                  )}
                  {imageUri2 != "" && (
                    <div className="text-center">
                      <img
                        src={imageUri2}
                        alt="Parent 2"
                        className="rounded-lg"
                      />
                      <p className="mt-2 font-bold">
                        Token ID: {nft.parent2.toString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="w-1/2 p-4">
            <div className="mt-4">
              <span className="font-bold">Attributes:</span>
              {questions.map((question, index) => (
                <div key={question.id} className="mt-2 flex justify-around">
                  <p>{question.question} </p>
                  <p>{question.options[nft.answers[index]]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 mr-2"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default NFTModal
