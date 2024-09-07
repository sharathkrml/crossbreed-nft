import React from "react"
import ConnectWeb3AuthButton from "./Web3AuthButton"
import Link from "next/link"

const Header = ({ pathname }: { pathname: string }) => {
  console.log({ pathname })
  return (
    <header className="p-4 flex justify-end ">
      {pathname == "/" ? (
        <Link
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
          href="/crossbreed"
        >
          Crossbreed
        </Link>
      ) : (
        <Link
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
          href="/"
        >
          Home
        </Link>
      )}
      <ConnectWeb3AuthButton />
    </header>
  )
}

export default Header
