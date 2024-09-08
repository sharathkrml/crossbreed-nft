"use client"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import { useEffect, useState } from "react"
import { getAccount } from "../../../utils/viemRPC"
const ConnectWeb3AuthButton = () => {
  const {
    connect,
    logout,
    isConnected,
    initModal,
    isInitialized,
    provider,
    web3Auth,
  } = useWeb3Auth()
  const [account, setAccount] = useState<string>("")

  const connectWallet = async () => {
    if (!isInitialized) {
      await initModal()
    }
    await connect()
  }

  const disconnectWallet = async () => {
    await logout()
    setAccount("")
  }
  useEffect(() => {
    if (isConnected && provider) {
      const getAcc = async () => {
        console.log("Connected to wallet")
        const address = await getAccount(provider)
        setAccount(address)
      }
      getAcc()
    }
  }, [isConnected, provider])
  return (
    <>
      {isConnected && web3Auth ? (
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={disconnectWallet}
        >
          {account.length == 42
            ? `${account.substring(0, 6)}...${account.substring(
                account.length - 2
              )}`
            : account}
        </button>
      ) : (
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </>
  )
}
export default ConnectWeb3AuthButton
