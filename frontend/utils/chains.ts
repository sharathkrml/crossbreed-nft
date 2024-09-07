import { CHAIN_NAMESPACES, CustomChainConfig } from "@web3auth/base"

export const chain: {
  [key: string]: CustomChainConfig
} = {
  galadriel: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xAA289",
    displayName: "Galadriel",
    rpcTarget: "https://devnet.galadriel.com",
    blockExplorerUrl: "https://explorer.galadriel.com",
    ticker: "GAL",
    tickerName: "Galadriel",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
}
