"use client"
import React, { useEffect, useState } from "react"
import ConnectWeb3AuthButton from "../ui/Web3AuthButton"
import Header from "../ui/Header"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Hash } from "viem"
import {
  breedAndMint,
  getMetaData,
  getAllTokenIds,
  getMintInputs,
  getTokenOwners,
  getTokenUris,
  NFTInfo,
} from "../../../utils/viemRPC"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"

const crossbreed = () => {
  const { isConnected, provider } = useWeb3Auth()

  const [data, setData] = useState<NFTInfo[]>([])

  const [tokenId1, setTokenId1] = useState<number | null>(null)
  const [tokenIdToNftInfo, setTokenIdToNftInfo] = useState<{
    [key: string]: NFTInfo
  }>({})
  const [tokenId2, setTokenId2] = useState<number | null>(null)
  const [crossBreedTxHash, setCrossBreedTxHash] = useState<string>("")

  const pathname = usePathname()
  useEffect(() => {
    const fetch = async () => {
      let allTokenIds = await getAllTokenIds()
      console.log({ allTokenIds })
      const { nftInfos, tokenIdToNftInfo } = await getMetaData(allTokenIds)
      setTokenIdToNftInfo(tokenIdToNftInfo)
      setData(nftInfos.reverse())
      console.log(nftInfos)
    }
    fetch()
    // return () => {
    //   second
    // }
  }, [])
  const handleCrossBreed = async (event: React.FormEvent) => {
    event.preventDefault()
    console.log("Token ID 1:", tokenId1)
    console.log("Token ID 2:", tokenId2)
    if (!provider) return
    let data = await breedAndMint(provider, tokenId1!, tokenId2!)
    if (data == null) return
    setData((prev) => data.nftInfos.concat(prev))
  }

  const handleReset = () => {
    setTokenId1(null)
    setTokenId2(null)
    setCrossBreedTxHash("")
  }
  return (
    <div className="min-h-screen">
      <Header pathname={pathname} />
      <div className="">
        <h1 className="text-3xl font-bold p-4">Crossbreed</h1>
        <form className="p-4" onSubmit={handleCrossBreed}>
          <div className="mb-4">
            <label
              htmlFor="tokenId1"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Token ID 1
            </label>
            <input
              type="number"
              id="tokenId1"
              name="tokenId1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              value={tokenId1 ?? ""}
              onChange={(e) => setTokenId1(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="tokenId2"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Token ID 2
            </label>
            <input
              type="number"
              id="tokenId2"
              name="tokenId2"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              value={tokenId2 ?? ""}
              onChange={(e) => setTokenId2(Number(e.target.value))}
            />
          </div>
          {crossBreedTxHash.length == 0 ? (
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Crossbreed
            </button>
          ) : (
            <div className="">
              <a
                href={crossBreedTxHash}
                target="_blank"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                View Transaction
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Reset
              </button>
            </div>
          )}
        </form>
      </div>
      <div className="container p-4 flex w-full flex-wrap">
        {data.length > 0 ? (
          data.map((event, index) => (
            <div className="border-2 shadow-md rounded-lg p-4 mb-4 w-1/3">
              <h2 className="text-xl font-bold mb-2">
                {event.tokenId.toString()} -{" "}
                {event.parent1 > BigInt(0) &&
                  `child of ${event.parent1.toString()}
                and ${event.parent1.toString()}`}
              </h2>
              <p className="text-gray-700">Original Owner: {event.owner}</p>
              <p className="text-gray-700">
                Current Owner: {event.currentOwner}
              </p>
              <img
                src={event.imageUrl}
                alt={event.tokenId.toString()}
                className="w-[500px] h-auto"
              />
            </div>
          ))
        ) : (
          <p>Loading events...</p>
        )}
      </div>
    </div>
  )
}

export default crossbreed
