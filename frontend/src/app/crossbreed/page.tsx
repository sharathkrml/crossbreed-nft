"use client"
import React, { useEffect, useState } from "react"
import ConnectWeb3AuthButton from "../ui/Web3AuthButton"
import { usePathname } from "next/navigation"
import {
  breedAndMint,
  getMetaData,
  getAllTokenIds,
  NFTInfo,
  pollMetadata,
  decodeBreedEvent,
} from "../../../utils/viemRPC"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import NFTModal from "../ui/NftModal"
import Header from "../ui/Header"

const Crossbreed = () => {
  const { isConnected, provider } = useWeb3Auth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nft, setNft] = useState<NFTInfo>({} as NFTInfo)
  const [tokenIdToNftInfo, setTokenIdToNftInfo] = useState<{
    [key: string]: NFTInfo
  }>({})

  const [data, setData] = useState<NFTInfo[]>([])

  const [selected, setSelected] = useState<bigint[]>([])

  const handleDivClick = (tokenId: bigint) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(tokenId)) {
        return prevSelected.filter((id) => id !== tokenId)
      } else {
        if (prevSelected.length >= 2) {
          return [prevSelected[1], tokenId] // Remove the oldest selection
        }
        return [...prevSelected, tokenId]
      }
    })
  }

  const handleNFT = async (tokenId: bigint) => {
    const nftDetails = await pollMetadata(tokenId)
    if (!nftDetails) return
    setNft(nftDetails.nftInfos[0])
    setIsModalOpen(true)
    setData((prev) => nftDetails.nftInfos.concat(prev))
    setTokenIdToNftInfo((prev) => {
      prev[tokenId.toString()] = nftDetails.nftInfos[0]
      return prev
    })
  }

  const [loading, setLoading] = useState<boolean>(false)

  const pathname = usePathname()
  useEffect(() => {
    const fetch = async () => {
      const allTokenIds = await getAllTokenIds()
      const { nftInfos, tokenIdToNftInfo } = await getMetaData(allTokenIds)
      setData(nftInfos.reverse())

      setTokenIdToNftInfo(tokenIdToNftInfo)
    }
    fetch()
    // return () => {
    //   second
    // }
  }, [])
  const handleCrossBreed = async () => {
    setLoading(true)
    if (!provider) return
    const txHash = await breedAndMint(provider, selected[0], selected[1])
    if (txHash) {
      const nftInfo = await decodeBreedEvent(txHash)
      if (nftInfo) {
        handleNFT(nftInfo.tokenId)
      }
    }
  }
  const getButtonText = () => {
    if (!loading) {
      if (selected.length === 0) {
        return "Choose Your Tokens to Begin!"
      } else if (selected.length === 1) {
        return `Token ${selected[0]} Selected! Pick One More!`
      } else if (selected.length === 2) {
        return `Ready to Crossbreed: ${selected[0]} & ${selected[1]}!`
      }
    } else {
      return "Loading..."
    }
  }
  const handleDivDoubleClick = async (tokenId: bigint) => {
    const metadata = await pollMetadata(tokenId)
    if (!metadata) return
    setNft(metadata.nftInfos[0])
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="min-w-full">
        <Header pathname={pathname} />
      </div>
      <div className="">
        <h1 className="text-3xl font-bold p-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Crossbreed
        </h1>
      </div>
      <div className="container p-4 flex w-full flex-wrap gap-3">
        {data.length > 0 ? (
          data.map((event) => (
            <div
              key={event.tokenId}
              className={`border-2 shadow-md rounded-lg p-4 mb-4 w-[calc(25%-0.75rem)] hover:cursor-pointer ${
                selected.includes(event.tokenId)
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => handleDivClick(event.tokenId)}
              onDoubleClick={() => handleDivDoubleClick(event.tokenId)}
            >
              <h2 className="text-2xl font-extrabold mb-4 ">
                {event.tokenId.toString()}
                {event.parent1 > BigInt(0) && (
                  <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent text-sm">
                    {"( child of " +
                      event.parent1.toString() +
                      " & " +
                      event.parent2.toString() +
                      ")"}
                  </span>
                )}
              </h2>
              <img
                src={event.imageUrl}
                alt={event.tokenId.toString()}
                className="w-[500px] h-auto"
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg mt-4 animate-pulse">
            Loading NFTs...
          </p>
        )}
      </div>
      <div
        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 py-2 px-4 `}
      >
        {isConnected ? (
          <button
            className={`rounded shadow-lg
              py-2 px-4 
              ${
                selected.length === 2
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-gray-300"
              }`}
            onClick={handleCrossBreed}
          >
            {getButtonText()}
          </button>
        ) : (
          <ConnectWeb3AuthButton />
        )}
      </div>
      {isModalOpen && (
        <NFTModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setLoading(false)
            setSelected([])
          }}
          nft={nft}
          tokenIdToNftInfo={tokenIdToNftInfo}
        />
      )}
    </div>
  )
}

export default Crossbreed
