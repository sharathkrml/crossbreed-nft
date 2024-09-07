"use client"
import { useEffect, useState } from "react"
import { questions } from "../../utils/constants"
import QuizPage from "./ui/QuizPage"
import SubmitPage from "./ui/SubmitPage"
import ConnectWeb3AuthButton from "./ui/Web3AuthButton"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import {
  decodeBreedEvent,
  getMetaData,
  NFTInfo,
  pollMetadata,
} from "../../utils/viemRPC"
import Header from "./ui/Header"
import NFTModal from "./ui/NftModal"
// Landing Page
const LandingPage = () => {
  const { isConnected } = useWeb3Auth()
  const [nft, setNft] = useState<NFTInfo | {}>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [page, setPage] = useState(0)

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
    const nftDetails = await pollMetadata(tokenId)
    if (!nftDetails) return
    setNft(nftDetails.nftInfos[0])
    setIsModalOpen(true)
  }
  useEffect(() => {
    const getTotalMints = async () => {
      decodeBreedEvent(
        "0x5debfa194eb51956e1027ff1b40cf1f5acfd0fec5daecfa7dd250edf4f9aadb0"
      )
    }
    getTotalMints()
  }, [])
  return (
    <div className="min-h-screen">
      <Header pathname="/" />
      {page === 0 && (
        <>
          <h2 className="text-2xl text-center">🐱 Mint yout Pet 🐶</h2>

          <div className="flex flex item-center justify-center">
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
        </>
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
        />
      )}
      {isModalOpen && (
        <NFTModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          nft={nft}
        />
      )}
    </div>
  )
}

export default LandingPage
