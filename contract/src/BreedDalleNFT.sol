// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import {IDalleNft} from "./interfaces/IDalleNft.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract BreedDalleNFT is IERC721Receiver {
    error NotActualOwner();
    string[4][15] public s_answerOptions = [
        [
            "Cozy living room",
            "Lush forest",
            "Creative art studio",
            "Vibrant city street"
        ],
        [
            "TV remote and popcorn",
            "Decadent junk food spread",
            "Whisper bubbles with secrets",
            "Pile of shopping bags"
        ],
        [
            "Partially transparent body parts",
            "Floating or flying elements",
            "Swirling thought bubbles",
            "Spiraling clock hands"
        ],
        [
            "Energetic and playful",
            "Bold and confident",
            "Romantic and dreamy",
            "Mysterious and elusive"
        ],
        [
            "Tropical paradise",
            "Historic elegance",
            "Serene nature",
            "Urban excitement"
        ],
        ["Sunny beach", "Cozy cabin", "Busy city street", "Mysterious forest"],
        [
            "Vibrant city street",
            "Cozy living room",
            "Lush forest",
            "Creative art studio"
        ],
        [
            "Decadent junk food spread",
            "TV remote and popcorn",
            "Whisper bubbles with secrets",
            "Pile of shopping bags"
        ],
        [
            "Floating or flying elements",
            "Partially transparent body parts",
            "Swirling thought bubbles",
            "Spiraling clock hands"
        ],
        [
            "Bold and confident",
            "Energetic and playful",
            "Romantic and dreamy",
            "Mysterious and elusive"
        ],
        [
            "Historic elegance",
            "Tropical paradise",
            "Serene nature",
            "Urban excitement"
        ],
        ["Cozy cabin", "Sunny beach", "Busy city street", "Mysterious forest"],
        [
            "Cozy living room",
            "Vibrant city street",
            "Creative art studio",
            "Lush forest"
        ],
        [
            "TV remote and popcorn",
            "Pile of shopping bags",
            "Decadent junk food spread",
            "Whisper bubbles with secrets"
        ],
        [
            "Floating or flying elements",
            "Spiraling clock hands",
            "Partially transparent body parts",
            "Swirling thought bubbles"
        ]
    ];
    IDalleNft public dalleNft;
    uint256 public s_tokenId = 0;

    struct MintInput {
        address owner;
        uint256 dalleTokenId;
        uint8[15] answers;
        bool isMinted;
    }

    mapping(uint256 tokenId => MintInput mintInput) public mintInputs;
    uint256[] public dalleTokenIds;

    event BreedMint(
        address indexed owner,
        uint256 indexed tokenId,
        uint256 indexed dalleTokenId
    );
    event CrossBreed(
        address indexed owner,
        uint256 indexed tokenId1,
        uint256 indexed tokenId2,
        uint256 dalleTokenId
    );

    // @param initialOracleAddress Initial address of the oracle contract
    // @param initialPrompt Initial prompt for generating the NFTs
    constructor(address _dalleNft) {
        dalleNft = IDalleNft(_dalleNft);
    }

    // @notice Initializes the minting process for a new NFT
    // @param message The user input to generate the NFT
    // @return The ID of the created mint input
    function mint(uint8[15] memory _answers) public returns (uint256) {
        uint256 currentId = s_tokenId++;
        MintInput storage mintInput = mintInputs[currentId];

        mintInput.owner = msg.sender;
        mintInput.answers = _answers;

        string memory fullPrompt = generatePrompt(_answers);
        uint256 dalleTokenId = dalleNft.initializeMint(fullPrompt);
        mintInput.dalleTokenId = dalleTokenId;
        emit BreedMint(msg.sender, currentId, dalleTokenId);

        return dalleTokenId;
    }

    function crossBreedAndMint(
        uint256 tokenId1,
        uint256 tokenId2
    ) public returns (uint256) {
        MintInput memory mintInput1 = mintInputs[tokenId1];
        MintInput memory mintInput2 = mintInputs[tokenId2];

        if (mintInput1.owner != msg.sender || mintInput2.owner != msg.sender) {
            revert NotActualOwner();
        }

        uint8[15] memory mixedAnswers = mixAnswers(
            mintInput1.answers,
            mintInput2.answers
        );

        uint256 dalleTokenId = mint(mixedAnswers);

        uint256 currentId = s_tokenId++;
        MintInput storage mintInput = mintInputs[currentId];

        mintInput.owner = msg.sender;
        mintInput.answers = _answers;
        mintInput.dalleTokenId = dalleTokenId;

        emit CrossBreed(msg.sender, tokenId1, tokenId2, dalleTokenId);

        return dalleTokenId;
    }

    function mixAnswers(
        uint8[15] memory _answers1,
        uint8[15] memory _answers2
    ) public view returns (uint8[15] memory mixedAnswers) {
        for (uint i = 0; i < 15; i++) {
            bool isEventBlock = block.timestamp % 2 == 0;
            mixedAnswers[i] = _answers1[i] > _answers2[i] && isEventBlock
                ? _answers1[i]
                : _answers2[i];
        }
    }

    function withdraw(uint256 tokenId) public {
        MintInput memory mintInput = mintInputs[tokenId];
        if (mintInput.owner != msg.sender) {
            revert NotActualOwner();
        }
        // Transfer the NFT to the contract owner
        dalleNft.safeTransferFrom(
            address(this),
            mintInput.owner,
            mintInput.dalleTokenId
        );
    }

    function getPrompt(uint256 tokenId) public view returns (string memory) {
        MintInput memory mintInput = mintInputs[tokenId];
        return generatePrompt(mintInput.answers);
    }

    function generatePrompt(
        uint8[15] memory answers
    ) public view returns (string memory) {
        string[4][15] memory _answerOptions = s_answerOptions;
        string[6] memory styleModifiers = [
            "digital painting",
            "vintage illustration",
            "futuristic 3D render",
            "abstract watercolor",
            "pixel art",
            "pop art"
        ];

        uint8 styleIndex = answers[0] % 6; // Use the first answer to determine style

        string memory query = string(
            abi.encodePacked(
                "Generate a ",
                styleModifiers[styleIndex],
                " of a ",
                _answerOptions[9][answers[9]],
                " in ",
                _answerOptions[0][answers[0]],
                " with ",
                _answerOptions[1][answers[1]],
                ", ",
                _answerOptions[2][answers[2]],
                ", ",
                _answerOptions[6][answers[6]],
                ", ",
                _answerOptions[10][answers[10]],
                ", and ",
                _answerOptions[11][answers[11]],
                ". "
            )
        );

        query = string(
            abi.encodePacked(
                query,
                "The image should have a ",
                _answerOptions[3][answers[3]],
                " atmosphere ",
                "and include ",
                _answerOptions[13][answers[13]],
                ". ",
                "Overall theme: ",
                _answerOptions[4][answers[4]],
                ". ",
                "Include ",
                _answerOptions[5][answers[5]],
                " and ",
                _answerOptions[14][answers[14]],
                ". "
            )
        );

        query = string(
            abi.encodePacked(
                query,
                "Dress the character in ",
                _answerOptions[7][answers[7]],
                ". ",
                "Apply ",
                _answerOptions[8][answers[8]],
                " visual style. ",
                "Add ",
                _answerOptions[12][answers[12]],
                " in the background."
            )
        );

        return query;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
