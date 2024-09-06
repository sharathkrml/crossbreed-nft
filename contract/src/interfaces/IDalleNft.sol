// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// @title IDalleNft
// @notice This interface defines the functions for interacting with the DalleNft contract.
interface IDalleNft {
    // @notice Event emitted when a new mint input is created
    event MintInputCreated(address indexed owner, uint indexed chatId);

    // @notice Event emitted when the prompt is updated
    event PromptUpdated(string indexed newPrompt);

    // @notice Event emitted when the oracle address is updated
    event OracleAddressUpdated(address indexed newOracleAddress);

    // @notice Retrieves the owner of the contract
    // @return The address of the owner
    function owner() external view returns (address);

    // @notice Retrieves the oracle address
    // @return The address of the oracle contract
    function oracleAddress() external view returns (address);

    // @notice Retrieves the prompt used for generating the NFTs
    // @return The current prompt string
    function prompt() external view returns (string memory);

    // @notice Updates the prompt used for generating the NFTs
    // @param newPrompt The new prompt to set
    function setPrompt(string memory newPrompt) external;

    // @notice Updates the oracle address
    // @param newOracleAddress The new oracle address to set
    function setOracleAddress(address newOracleAddress) external;

    // @notice Initializes the minting process for a new NFT
    // @param message The user input to generate the NFT
    // @return The ID of the created mint input
    function initializeMint(string memory message) external returns (uint);

    // @notice Handles the response from the oracle for the function call
    // @param runId The ID of the mint input
    // @param response The response from the oracle (token URI)
    function onOracleFunctionResponse(
        uint runId,
        string memory response,
        string memory errorMessage
    ) external;

    // @notice Retrieves the message history contents for a given chat ID
    // @param chatId The ID of the chat
    // @return An array of message contents
    function getMessageHistoryContents(
        uint chatId
    ) external view returns (string[] memory);

    // @notice Retrieves the roles for a given chat
    // @return An array with a single role "user"
    function getRoles(
        address _owner,
        uint _chatId
    ) external pure returns (string[] memory);

    //     *
    //  * Requirements:
    //  *
    //  * - `from` cannot be the zero address.
    //  * - `to` cannot be the zero address.
    //  * - `tokenId` token must exist and be owned by `from`.
    //  * - If the caller is not `from`, it must have been allowed to move this token by either {approve} or
    //  *   {setApprovalForAll}.
    //  * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon
    //  *   a safe transfer.
    //  *
    //  * Emits a {Transfer} event.
    //  */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}
