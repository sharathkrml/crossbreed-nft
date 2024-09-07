import { useEffect, useState } from "react"
import Image from "next/image"
import {
  getAccount,
  getDalleNFTOwner,
  getDalleNFTUrl,
  NFTInfo,
} from "../../../utils/viemRPC"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
type NFTModalProps = {
  isOpen: boolean
  onClose: () => void
  nft: NFTInfo
}
const NFTModal = ({ isOpen, onClose, nft }: NFTModalProps) => {
  const { isConnected, provider } = useWeb3Auth()

  return (
    <div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-4 border-2 border-white rounded-lg">
        <div className="relative">
          <>
            <img
              src={nft.imageUrl}
              alt="NFT"
              className="w-[200px] h-[200px] object-cover"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="spinner"></div>
            </div>
          </>
        </div>
        <div className="mt-4">
          <p className="mt-2">
            <span className="font-bold">Token ID:</span>{" "}
            {nft.tokenId.toString()}
          </p>
          <p className="mt-2">
            <span className="font-bold">Owner Address:</span> {nft.owner}
          </p>
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 mr-2"
            onClick={onClose}
          >
            Close
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
            Claim
          </button>
        </div>
      </div>
    </div>
  )
}

export default NFTModal
