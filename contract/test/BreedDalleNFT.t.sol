// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";

import {BreedDalleNFT} from "../src/BreedDalleNFT.sol";
import {DalleNFTMock} from "./mock/DalleNFTMock.sol";

contract MoxiePowerTest is Test {
    BreedDalleNFT public breedDalleNFT;
    DalleNFTMock public dalleNFTMock;

    function setUp() public {
        dalleNFTMock = new DalleNFTMock();
        breedDalleNFT = new BreedDalleNFT(address(dalleNFTMock));
    }

    function test_Animal() public {
        for (uint8 i = 0; i < 10; i++) {
            console.log(
                breedDalleNFT.generatePrompt([i, 1, 1, 1, 1, 1, 1, 1, 1, 1])
            );
        }
    }
}
