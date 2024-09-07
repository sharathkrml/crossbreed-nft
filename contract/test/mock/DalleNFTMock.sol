// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract DalleNFTMock {
    uint256 public id = 0;

    function initializeMint(string memory /*message*/) external returns (uint) {
        id++;
        return id;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external {}
}
