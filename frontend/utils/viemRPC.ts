import {
  ContractFunctionExecutionError,
  createPublicClient,
  createWalletClient,
  custom,
  decodeEventLog,
  defineChain,
  getContract,
  Hash,
  http,
} from "viem"
import { mainnet, polygonAmoy, sepolia } from "viem/chains"
import BreedDalleNFT from "./abi/BreedDalleNFT.json"
import ERC721 from "./abi/ERC721.json"
import type { IProvider } from "@web3auth/base"
import { BreedTopic, BreedNFT, DalleNFT } from "./constants"

const galadriel = defineChain({
  id: 696969,
  name: "Galadriel Devnet",
  nativeCurrency: { name: "Galadriel", symbol: "GAL", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://devnet.galadriel.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Galadriel Explorer",
      url: "https://explorer.galadriel.com",
    },
  },
})

const publicClient = createPublicClient({
  chain: galadriel,
  transport: http(),
})

export function getBlockNumber(): Promise<bigint> {
  return publicClient.getBlockNumber()
}

export const totalMints = async () => {
  const data: bigint = (await publicClient.readContract({
    address: BreedNFT,
    abi: BreedDalleNFT.abi,
    functionName: "s_tokenId",
  })) as bigint
  return data
}

export const getAccount = async (provider: IProvider) => {
  const accounts: string[] = (await provider.request({
    method: "eth_accounts",
  })) as string[]
  return accounts[0]
}

export const getWalletClient = (provider: IProvider) => {
  const walletClient = createWalletClient({
    chain: galadriel, // for mainnet
    transport: custom(provider),
  })
  return walletClient
}

export const mint = async (provider: IProvider, input: number[]) => {
  let client = getWalletClient(provider)
  const [account] = await client.getAddresses()
  const response = await client.writeContract({
    address: BreedNFT,
    abi: BreedDalleNFT.abi,
    functionName: "mint",
    args: [input],
    account,
  })

  const data = decodeBreedEvent(response)

  return data
}

export const breedAndMint = async (
  provider: IProvider,
  input1: bigint,
  input2: bigint
) => {
  let client = getWalletClient(provider)
  const [account] = await client.getAddresses()
  try {
    const response = await client.writeContract({
      address: BreedNFT,
      abi: BreedDalleNFT.abi,
      functionName: "breedAndMint",
      args: [input1, input2],
      account,
    })
    return response
  } catch (e) {
    console.log(e)
  }
}

export const pollMetadata = async (tokenId: bigint) => {
  // max amount of time to wait
  for (let i = 0; i < 120; i++) {
    try {
      console.log("Polling metadata attempt", i, tokenId)
      const uri = await getMetaData([tokenId])
      if (uri) return uri
    } catch (e) {}
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}
export const decodeBreedEvent = async (hash: Hash) => {
  try {
    const data = await publicClient.waitForTransactionReceipt({
      hash: hash,
    })
    if (data.status === "reverted") {
      alert("Transaction Reverted")
      return
    }

    for (let i = 0; i < data.logs.length; i++) {
      if (data.logs[i].topics[0] == BreedTopic) {
        let decodedEvent = decodeEventLog({
          abi: BreedDalleNFT.abi,
          eventName: "Breed",
          topics: data.logs[i].topics,
          data: data.logs[i].data,
        })
        console.log(decodedEvent)
        if (decodedEvent.eventName && decodedEvent.args) {
          const data = decodedEvent.args as { [key: string]: any }
          return {
            owner: data["owner"] as string,
            tokenId: data["tokenId"] as bigint,
            tokenId1: data["tokenId1"] as bigint,
            tokenId2: data["tokenId2"] as bigint,
          }
        }
      }
    }
  } catch (e) {
    console.log(e)
  }

  return {
    owner: "",
    tokenId: BigInt(0),
    tokenId1: BigInt(0),
    tokenId2: BigInt(0),
  }
}

export const getDalleNFTUrl = async (tokenId: string) => {
  let tokenURI = await publicClient.readContract({
    address: DalleNFT,
    abi: ERC721,
    functionName: "tokenURI",
    args: [tokenId],
  })
  return tokenURI as string
}

export const getDalleNFTOwner = async (tokenId: string) => {
  let owner = await publicClient.readContract({
    address: DalleNFT,
    abi: ERC721,
    functionName: "ownerOf",
    args: [tokenId],
  })
  return owner
}

export const getAllTokenIds = async () => {
  let tokenIds = await publicClient.readContract({
    address: BreedNFT,
    abi: BreedDalleNFT.abi,
    functionName: "getTokenIds",
  })
  return tokenIds as bigint[]
}

export const getTokenOwners = async (tokenIds: bigint[]) => {
  let owners = await publicClient.readContract({
    address: BreedNFT,
    abi: BreedDalleNFT.abi,
    functionName: "batchGetTokenOwners",
    args: [tokenIds],
  })
  return owners as Hash[]
}

export const getMintInputs = async (tokenIds: bigint[]) => {
  let mintInputs = await publicClient.readContract({
    address: BreedNFT,
    abi: BreedDalleNFT.abi,
    functionName: "batchGetMintInputs",
    args: [tokenIds],
  })
  return mintInputs as MintInput[]
}

type MintInput = {
  owner: Hash
  answers: number[]
  parent1: bigint
  parent2: bigint
}
export const getTokenUris = async (tokenIds: bigint[]) => {
  let tokenUris = await publicClient.readContract({
    address: BreedNFT,
    abi: BreedDalleNFT.abi,
    functionName: "batchGetTokenUris",
    args: [tokenIds],
  })
  return tokenUris as string[]
}

export type NFTInfo = {
  owner: string
  currentOwner: string
  answers: number[]
  parent1: bigint
  parent2: bigint
  imageUrl: string
  tokenId: bigint
}
export const getMetaData = async (tokenIds: bigint[]) => {
  const [owners, mintInputs, tokenUris] = await Promise.all([
    getTokenOwners(tokenIds),
    getMintInputs(tokenIds),
    getTokenUris(tokenIds),
  ])
  let nftInfos: NFTInfo[] = []
  let tokenIdToNftInfo: { [key: string]: NFTInfo } = {}
  for (let i = 0; i < tokenIds.length; i++) {
    const nftInfo = {
      tokenId: tokenIds[i],
      currentOwner: owners[i],
      owner: mintInputs[i].owner,
      answers: mintInputs[i].answers,
      parent1: mintInputs[i].parent1,
      parent2: mintInputs[i].parent2,
      imageUrl: tokenUris[i] as string,
    }
    nftInfos.push(nftInfo)
    tokenIdToNftInfo[tokenIds[i].toString()] = nftInfo
  }
  return { nftInfos, tokenIdToNftInfo }
}
