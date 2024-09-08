"use client"
import { useState } from "react"
import {
  BreedNFT,
  DalleNFT,
  galadrielExplorerPrefix,
  questions,
} from "../../utils/constants"
import QuizPage from "./ui/QuizPage"
import SubmitPage from "./ui/SubmitPage"
import ConnectWeb3AuthButton from "./ui/Web3AuthButton"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import { NFTInfo, pollMetadata } from "../../utils/viemRPC"
import Header from "./ui/Header"
import NFTModal from "./ui/NftModal"
// Landing Page
const LandingPage = () => {
  const { isConnected } = useWeb3Auth()
  const [nft, setNft] = useState<NFTInfo>({} as NFTInfo)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [page, setPage] = useState(0)
  const [mintSubmitted, setMintSubmitted] = useState(false)

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

  const showNFT = async (tokenId: bigint) => {
    setMintSubmitted(true)
    const nftDetails = await pollMetadata(tokenId)
    if (!nftDetails) return
    setNft(nftDetails.nftInfos[0])
    setIsModalOpen(true)
    setMintSubmitted(false)
  }

  return (
    <div className="min-h-screen">
      <Header pathname="/" />
      <div className="h-[80vh] flex flex-col item-center justify-center">
        {page === 0 && (
          <div className="">
            <h1 className="text-4xl text-center">
              🐱
              <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">
                Mint & Crossbreed
              </span>
              🐶
            </h1>
            <div className="flex items-center justify-center my-2 ">
              <img
                src="./cooking.gif"
                alt=""
                className="w-[450px] rounded-lg mt-4"
              />
            </div>
            <div className=" flex item-center justify-center pt-4">
              {isConnected ? (
                <button
                  onClick={() => {
                    if (isConnected) {
                      setPage(1)
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                >
                  Start Quiz
                </button>
              ) : (
                <ConnectWeb3AuthButton />
              )}
            </div>
            <div className="flex flex-col items-center justify-center mt-4 text-center text-sm space-y-2">
              <a
                href={galadrielExplorerPrefix + DalleNFT}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent hover:text-blue-700 underline"
              >
                Dall-E Contract: {DalleNFT}
              </a>
              <a
                href={galadrielExplorerPrefix + BreedNFT}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent hover:text-blue-700 underline"
              >
                Breed Contract: {BreedNFT}
              </a>
            </div>
          </div>
        )}
        {page > 0 && page < 3 && (
          <div className="px-[35%]">
            <QuizPage
              pageNumber={page}
              questions={questions}
              formData={formData}
              setFormData={setFormData}
              incrementPage={incrementPage}
              decrementPage={decrementPage}
            />
          </div>
        )}
        {page === 3 && (
          <SubmitPage
            showNFT={showNFT}
            formData={formData}
            setPageNo={setPageNo}
            mintSubmitted={mintSubmitted}
          />
        )}
        {isModalOpen && (
          <NFTModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            nft={nft}
            tokenIdToNftInfo={{} as Record<string, NFTInfo>}
          />
        )}
      </div>
    </div>
  )
}

export default LandingPage
