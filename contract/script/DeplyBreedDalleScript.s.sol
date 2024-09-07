// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {BreedDalleNFT} from "../src/BreedDalleNFT.sol";

contract DeplyBreedDalleScript is Script {
    address public dalleNft = 0x4440b5eBEBac3DC6C4d4Eca62520ef783067EdDf;

    BreedDalleNFT breedDalleNFT =
        BreedDalleNFT(0x0d6181BabDeA5D3A2546636Ed8672a21D954d181);

    function run() public {
        vm.startBroadcast();
        // BreedDalleNFT breedDalleNFT = new BreedDalleNFT(dalleNft);
        // uint256 mint1TokenId = breedDalleNFT.mint(
        //     [1, 2, 3, 1, 1, 1, 1, 1, 1, 1]
        // );
        // console.log("minted mint1TokenId", mint1TokenId);
        // uint256 mint2TokenId = breedDalleNFT.mint(
        //     [2, 1, 1, 2, 1, 1, 1, 1, 1, 1]
        // );
        // console.log("minted mint2TokenId", mint2TokenId);

        // uint256 mint3TokenId = breedDalleNFT.breedAndMint(
        //     mint1TokenId,
        //     mint2TokenId
        // );
        // console.log("minted mint3TokenId cross breed", mint3TokenId);

        // uint256[] memory tokenIds = new uint256[](3);
        // tokenIds[0] = 235;
        // tokenIds[1] = 236;
        // tokenIds[2] = 237;
        breedDalleNFT.getTokenIds();
        // breedDalleNFT.batchGetTokenOwners(tokenIds);
        // breedDalleNFT.batchGetTokenUris(tokenIds);

        vm.stopBroadcast();
    }
}
