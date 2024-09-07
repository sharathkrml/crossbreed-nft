// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import {IDalleNft} from "./interfaces/IDalleNft.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract BreedDalleNFT is IERC721Receiver {
    error NotActualOwner();

    // string[10][5] public s_quizOptions = [
    //     [
    //         "Dog 🐶",
    //         "Cat 😺",
    //         "Bird 🐦",
    //         "Exotic 🦄",
    //         "Rabbit 🐰",
    //         "Fish 🐠",
    //         "Hamster 🐹",
    //         "Turtle 🐢",
    //         "Fox 🦊",
    //         "Penguin 🐧"
    //     ],
    //     [
    //         "Unusual eye color 👁️",
    //         "Striking fur/feather pattern 🌈",
    //         "Adorable expression 😊",
    //         "Magical element ✨",
    //         "Unique markings 🔮",
    //         "Iridescent scales/feathers 🌟",
    //         "Glowing aura 🌠",
    //         "Robotic parts 🤖",
    //         "Tiny wings 🧚",
    //         "Rainbow tail 🌈"
    //     ],
    //     [
    //         "Fancy collar or bow tie 🎀",
    //         "Cute hat or headpiece 🎩",
    //         "Glasses or monocle 👓",
    //         "Flower crown or nature element 🌺",
    //         "Stylish bandana 🧣",
    //         "Shimmering jewelry 💎",
    //         "Superhero cape 🦸",
    //         "Wizard's wand 🪄",
    //         "Steampunk goggles 🥽",
    //         "Tiny backpack 🎒"
    //     ],
    //     [
    //         "Cozy home interior 🏠",
    //         "Lush nature scene 🌳",
    //         "Whimsical fantasy landscape 🏰",
    //         "Urban cityscape 🏙️",
    //         "Underwater wonderland 🌊",
    //         "Starry night sky 🌠",
    //         "Candy land 🍭",
    //         "Futuristic space station 🚀",
    //         "Ancient ruins 🏛️",
    //         "Volcanic landscape 🌋"
    //     ],
    //     [
    //         "Happy and playful 😄",
    //         "Regal and proud 👑",
    //         "Mysterious and alluring 🔮",
    //         "Relaxed and content 😌",
    //         "Curious and inquisitive 🧐",
    //         "Brave and adventurous 🦸",
    //         "Shy and sweet 🥺",
    //         "Mischievous and clever 😏",
    //         "Zen and wise 🧘",
    //         "Energetic and sporty 🏃"
    //     ],
    //     [
    //         "Daytime ☀️",
    //         "Sunset 🌅",
    //         "Night 🌙",
    //         "Dawn 🌄",
    //         "Stormy weather ⛈️",
    //         "Rainbow sky 🌈",
    //         "Aurora borealis 🌌",
    //         "Eclipse 🌚",
    //         "Foggy mist 🌫️",
    //         "Shooting stars 🌠"
    //     ],
    //     [
    //         "Spring bloom 🌸",
    //         "Summer heat 🌞",
    //         "Autumn leaves 🍂",
    //         "Winter snow ❄️",
    //         "Cherry blossom season 🌸",
    //         "Monsoon rains 🌧️",
    //         "Desert sandstorm 🏜️",
    //         "Tropical paradise 🏝️",
    //         "Arctic tundra 🧊",
    //         "Jungle humidity 🌴"
    //     ],
    //     [
    //         "Magic potion 🧪",
    //         "Ancient scroll 📜",
    //         "Crystal ball 🔮",
    //         "Flying carpet 🧞",
    //         "Enchanted mirror 🪞",
    //         "Time-turner ⏳",
    //         "Magical seeds 🌱",
    //         "Invisibility cloak 👻",
    //         "Fairy dust ✨",
    //         "Dragon egg 🥚"
    //     ],
    //     [
    //         "Pixel art style 👾",
    //         "Watercolor effect 🎨",
    //         "Comic book style 💥",
    //         "Neon glow 🌈",
    //         "Minimalist design ⬜",
    //         "Impressionist painting 🖼️",
    //         "3D rendered 🧊",
    //         "Retro 80s vibe 📼",
    //         "Anime inspired 🇯🇵",
    //         "Photorealistic 📸"
    //     ],
    //     [
    //         "Playing an instrument 🎸",
    //         "Doing yoga 🧘",
    //         "Cooking 👨‍🍳",
    //         "Reading a book 📚",
    //         "Painting 🎨",
    //         "Gardening 🌱",
    //         "Stargazing 🔭",
    //         "Surfing 🏄",
    //         "Meditating 🧘‍♀️",
    //         "Dancing 💃"
    //     ]
    // ];

    string[10][10] public s_translations = [
        [
            "friendly dog",
            "curious cat",
            "colorful bird",
            "mysterious [specific exotic animal]",
            "fluffy rabbit",
            "shimmering fish",
            "adorable hamster",
            "wise turtle",
            "clever fox",
            "playful penguin"
        ],
        [
            "[color] eyes",
            "[pattern] fur/feather pattern",
            "an endearing [specific expression]",
            "[magical element] aura",
            "[shape] markings",
            "[color-changing] scales/feathers",
            "a [color] glowing outline",
            "[metal] robotic [body part]",
            "delicate [color] wings",
            "a vibrant rainbow tail"
        ],
        [
            "wearing a [style] collar/bow tie",
            "adorned with a [type] hat/headpiece",
            "sporting [style] glasses/monocle",
            "crowned with [type of flowers/nature elements]",
            "wrapped in a [pattern] bandana",
            "decorated with [gemstone] jewelry",
            "donning a [color] superhero cape",
            "wielding a [material] wizard's wand",
            "wearing intricate steampunk goggles",
            "carrying a tiny [color] backpack"
        ],
        [
            "in a warm, inviting [room type]",
            "surrounded by [specific nature elements]",
            "in a dreamlike landscape with [fantasy elements]",
            "against a backdrop of [city elements]",
            "amidst a vibrant [underwater scene]",
            "beneath a [constellation] filled sky",
            "in a whimsical world made of [candy type]",
            "aboard a [advanced tech] space station",
            "exploring [ancient civilization] ruins",
            "near an active [type] volcano"
        ],
        [
            "joyful and energetic",
            "majestic and dignified",
            "enigmatic and captivating",
            "serene and peaceful",
            "inquisitive and alert",
            "courageous and daring",
            "timid and endearing",
            "playfully cunning",
            "tranquil and sagacious",
            "dynamic and athletic"
        ],
        [
            "bathed in soft daylight",
            "illuminated by a golden sunset",
            "under the glow of moonlight",
            "in the gentle light of dawn",
            "amid [weather phenomenon]",
            "surrounded by a spectrum of colors",
            "beneath dancing northern lights",
            "during a mysterious [celestial event]",
            "shrouded in a mystical fog",
            "under a sky filled with shooting stars"
        ],
        [
            "during the height of spring",
            "in the warmth of summer",
            "surrounded by fall colors",
            "in a winter wonderland",
            "amidst blooming cherry blossoms",
            "during heavy monsoon rains",
            "weathering a desert sandstorm",
            "in a lush tropical setting",
            "on the frozen arctic plains",
            "in a steamy jungle atmosphere"
        ],
        [
            "with a mysterious [color] potion",
            "holding an ancient [material] scroll",
            "gazing into a [size] crystal ball",
            "riding a [pattern] magic carpet",
            "reflected in an ornate enchanted mirror",
            "wearing a [metal] time-turner",
            "planting [type] magical seeds",
            "hidden under an invisibility cloak",
            "sprinkling [color] fairy dust",
            "guarding a rare dragon egg"
        ],
        [
            "in charming pixel art style",
            "with dreamy watercolor effects",
            "in bold comic book style",
            "glowing with vibrant neon colors",
            "in a sleek minimalist design",
            "as an impressionist masterpiece",
            "in stunning 3D rendering",
            "with a nostalgic 80s aesthetic",
            "in popular anime style",
            "captured in photorealistic detail"
        ],
        [
            "playing [instrument] skillfully",
            "striking a perfect yoga pose",
            "preparing a gourmet [dish]",
            "engrossed in [genre] book",
            "creating a [style] painting",
            "tending to a [plant] garden",
            "observing [celestial body] with a telescope",
            "riding a massive [color] wave",
            "deeply focused in meditation",
            "performing a [dance style] routine"
        ]
    ];
    string[12] public s_styleModifiers = [
        "whimsical watercolor",
        "realistic digital painting",
        "stylized cartoon",
        "vintage illustration",
        "pixel art",
        "abstract expressionism",
        "pop art",
        "minimalist line drawing",
        "3D rendered sculpture",
        "impressionist brushstrokes",
        "anime-inspired manga",
        "graffiti street art"
    ];
    IDalleNft public s_dalleNft;

    struct MintInput {
        address owner;
        uint8[10] answers;
        uint256 parent1;
        uint256 parent2;
    }

    mapping(uint256 dalleTokenId => MintInput mintInput) public mintInputs;
    uint256[] public s_tokenIds;

    event Breed(
        address indexed owner,
        uint256 indexed tokenId,
        uint256 indexed tokenId1,
        uint256 tokenId2
    );

    // @param initialOracleAddress Initial address of the oracle contract
    // @param initialPrompt Initial prompt for generating the NFTs
    constructor(address _dalleNft) {
        s_dalleNft = IDalleNft(_dalleNft);
    }

    function setDalleNft(address _dalleNft) public {
        s_dalleNft = IDalleNft(_dalleNft);
    }

    function determineStyle(
        uint8[10] memory answers
    ) internal pure returns (uint8) {
        uint256 seed = 0;
        for (uint8 i = 0; i < 10; i++) {
            seed = seed * 10 + answers[i];
        }
        return uint8(seed % 12); // 12 is the number of style modifiers
    }

    function generatePrompt(
        uint8[10] memory answers
    ) public view returns (string memory) {
        for (uint8 i = 0; i < 10; i++) {
            answers[i] = answers[i] % 10; // Ensure each answer is within 0-9 range
        }

        uint8 styleIndex = determineStyle(answers);

        string memory prompt = string(
            abi.encodePacked(
                "Generate a ",
                s_styleModifiers[styleIndex],
                " portrait of a ",
                s_translations[0][answers[0]], // Animal
                " with ",
                s_translations[1][answers[1]], // Physical characteristic
                ", ",
                s_translations[2][answers[2]], // Accessory
                ". The scene is set ",
                s_translations[3][answers[3]], // Background
                " ",
                s_translations[5][answers[5]], // Time of day
                " ",
                s_translations[6][answers[6]], // Season/weather
                ". The animal appears ",
                s_translations[4][answers[4]], // Expression/personality
                " while ",
                s_translations[9][answers[9]], // Activity
                ". ",
                s_translations[7][answers[7]], // Magical item
                " can be seen nearby. The overall aesthetic is ",
                s_translations[8][answers[8]] // Art style (in addition to the main style modifier)
            )
        );

        return prompt;
    }

    function getTokenIds() public view returns (uint256[] memory) {
        return s_tokenIds;
    }

    function batchGetTokenUris(
        uint256[] memory tokenIds
    ) public view returns (string[] memory) {
        string[] memory tokenUris = new string[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenUris[i] = s_dalleNft.tokenURI(tokenIds[i]);
        }
        return tokenUris;
    }

    function batchGetTokenOwners(
        uint256[] memory tokenIds
    ) public view returns (address[] memory) {
        address[] memory ownersArr = new address[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            ownersArr[i] = s_dalleNft.ownerOf(tokenIds[i]);
        }
        return ownersArr;
    }

    function batchGetMintInputs(
        uint256[] memory tokenIds
    ) public view returns (MintInput[] memory) {
        MintInput[] memory mintInputArr = new MintInput[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            mintInputArr[i] = mintInputs[tokenIds[i]];
        }
        return mintInputArr;
    }

    // @notice Initializes the minting process for a new NFT
    // @param message The user input to generate the NFT
    // @return The ID of the created mint input
    function _mint(uint8[10] memory _answers) internal returns (uint256) {
        string memory fullPrompt = generatePrompt(_answers);
        return s_dalleNft.initializeMint(fullPrompt);
    }

    function mint(uint8[10] memory _answers) external returns (uint256) {
        uint256 tokenId = _mint(_answers);
        MintInput storage mintInput = mintInputs[tokenId];
        mintInput.owner = msg.sender;
        mintInput.answers = _answers;
        mintInput.parent1 = 0;
        mintInput.parent2 = 0;
        s_tokenIds.push(tokenId);
        emit Breed(msg.sender, tokenId, 0, 0);
        return tokenId;
    }

    function breedAndMint(
        uint256 tokenId1,
        uint256 tokenId2
    ) external returns (uint256) {
        MintInput memory mintInput1 = mintInputs[tokenId1];
        MintInput memory mintInput2 = mintInputs[tokenId2];
        uint8[10] memory mixedAnswers = mixAnswers(
            mintInput1.answers,
            mintInput2.answers
        );
        uint256 tokenId = _mint(mixedAnswers);
        MintInput storage mintInput = mintInputs[tokenId];
        mintInput.answers = mixedAnswers;
        mintInput.owner = msg.sender;
        mintInput.parent1 = tokenId1;
        mintInput.parent2 = tokenId2;

        s_tokenIds.push(tokenId);
        emit Breed(msg.sender, tokenId, tokenId1, tokenId2);
        return tokenId;
    }

    function mixAnswers(
        uint8[10] memory _answers1,
        uint8[10] memory _answers2
    ) public view returns (uint8[10] memory mixedAnswers) {
        for (uint i = 0; i < 10; i++) {
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
        s_dalleNft.safeTransferFrom(address(this), mintInput.owner, tokenId);
    }

    function getPrompt(uint256 tokenId) public view returns (string memory) {
        MintInput memory mintInput = mintInputs[tokenId];
        return generatePrompt(mintInput.answers);
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
