// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {BreedDalleNFT} from "../src/BreedDalleNFT.sol";

contract DeplyBreedDalleScript is Script {
    address public dalleNft = 0x4440b5eBEBac3DC6C4d4Eca62520ef783067EdDf;

    // BreedDalleNFT breedDalleNFT =
    //     BreedDalleNFT(0x1E8561fe88d20Db57938677566B0f329Ffd3FFF6);

    function run() public {
        vm.startBroadcast();
        console.log("msg.sender", msg.sender);
        BreedDalleNFT breedDalleNFT = new BreedDalleNFT(dalleNft);
        console.log(
            "minted dalleTokenId",
            breedDalleNFT.mint([1, 2, 3, 1, 1, 1, 1, 1, 1, 1])
        );
        console.log(
            "minted dalleTokenId",
            breedDalleNFT.mint([2, 1, 1, 2, 1, 1, 1, 1, 1, 1])
        );
        (address owner0, uint256 dalleTokenId0, ) = breedDalleNFT.mintInputs(0);
        console.log(owner0, dalleTokenId0);
        (address owner1, uint256 dalleTokenId1, ) = breedDalleNFT.mintInputs(1);
        console.log(owner1, dalleTokenId1);
        breedDalleNFT.breedAndMint(0, 1);
        vm.stopBroadcast();
    }
}
