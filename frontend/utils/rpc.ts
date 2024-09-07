import { UX_MODE } from "@toruslabs/openlogin-utils"
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { Web3AuthOptions } from "@web3auth/modal"
import { OpenloginAdapter } from "@web3auth/openlogin-adapter"
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin"
import { chain } from "./chains"
import { MetamaskAdapter } from "@web3auth/metamask-adapter"
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter"
import exp from "constants"
const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || ""

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig: chain.galadriel,
  },
})

const web3AuthOptions: Web3AuthOptions = {
  chainConfig: chain.galadriel,
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
}

const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: "optional",
  },
  adapterSettings: {
    uxMode: UX_MODE.REDIRECT, // "redirect" | "popup"
  },
})

const walletServicesPlugin = new WalletServicesPlugin({
  wsEmbedOpts: {},
  walletInitOptions: {
    whiteLabel: { showWidgetButton: true, buttonPosition: "bottom-right" },
  },
})
const metamaskAdapter = new MetamaskAdapter({
  clientId,
  sessionTime: 3600, // 1 hour in seconds
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  chainConfig: chain.galadriel,
})

const web3AuthContextConfig = {
  web3AuthOptions,
  adapters: [openloginAdapter, metamaskAdapter],
  plugins: [walletServicesPlugin],
}
export default web3AuthContextConfig
