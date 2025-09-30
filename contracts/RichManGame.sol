// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RichManGame
 * @dev ERC-1155 NFT contract for RichMan game buildings
 * Buildings can be minted when upgraded to level 5
 */
contract RichManGame is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Building structure
    struct Building {
        uint256 tokenId;
        uint8 level;
        uint8 position;
        address owner;
        uint256 mintedAt;
        bool isMinted;
    }

    // Mapping from position to building
    mapping(uint8 => Building) public buildings;
    
    // Mapping from tokenId to position
    mapping(uint256 => uint8) public tokenToPosition;
    
    // Mapping from address to owned positions
    mapping(address => uint8[]) public playerBuildings;

    // Events
    event BuildingPurchased(address indexed player, uint8 position, uint8 level);
    event BuildingUpgraded(address indexed player, uint8 position, uint8 newLevel);
    event BuildingMinted(address indexed player, uint256 tokenId, uint8 position);
    event RentPaid(address indexed from, address indexed to, uint256 amount, uint8 position);

    // Game constants
    uint256 public constant MINT_FEE = 0.001 ether;
    uint8 public constant MAX_LEVEL = 5;

    constructor() ERC1155("https://game.richman-web3.com/api/token/{id}.json") Ownable(msg.sender) {}

    /**
     * @dev Purchase a building at a specific position
     */
    function purchaseBuilding(uint8 position) external {
        require(buildings[position].owner == address(0), "Building already owned");
        require(position < 40, "Invalid position");

        buildings[position] = Building({
            tokenId: 0,
            level: 1,
            position: position,
            owner: msg.sender,
            mintedAt: 0,
            isMinted: false
        });

        playerBuildings[msg.sender].push(position);
        emit BuildingPurchased(msg.sender, position, 1);
    }

    /**
     * @dev Upgrade building level
     */
    function upgradeBuilding(uint8 position) external {
        Building storage building = buildings[position];
        require(building.owner == msg.sender, "Not building owner");
        require(building.level < MAX_LEVEL, "Building at max level");
        require(!building.isMinted, "Building already minted as NFT");

        building.level++;
        emit BuildingUpgraded(msg.sender, position, building.level);
    }

    /**
     * @dev Mint building as NFT when it reaches level 5
     */
    function mintBuildingNFT(uint8 position) external payable {
        Building storage building = buildings[position];
        require(building.owner == msg.sender, "Not building owner");
        require(building.level == MAX_LEVEL, "Building must be level 5");
        require(!building.isMinted, "Building already minted");
        require(msg.value >= MINT_FEE, "Insufficient mint fee");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        building.tokenId = newTokenId;
        building.isMinted = true;
        building.mintedAt = block.timestamp;

        tokenToPosition[newTokenId] = position;

        _mint(msg.sender, newTokenId, 1, "");
        emit BuildingMinted(msg.sender, newTokenId, position);
    }

    /**
     * @dev Pay rent to building owner
     */
    function payRent(uint8 position) external payable {
        Building memory building = buildings[position];
        require(building.owner != address(0), "No building owner");
        require(building.owner != msg.sender, "Cannot pay rent to yourself");
        require(msg.value > 0, "Rent amount must be greater than 0");

        payable(building.owner).transfer(msg.value);
        emit RentPaid(msg.sender, building.owner, msg.value, position);
    }

    /**
     * @dev Get building information
     */
    function getBuilding(uint8 position) external view returns (Building memory) {
        return buildings[position];
    }

    /**
     * @dev Get all buildings owned by player
     */
    function getPlayerBuildings(address player) external view returns (uint8[] memory) {
        return playerBuildings[player];
    }

    /**
     * @dev Calculate rent based on building level
     */
    function calculateRent(uint8 position) public view returns (uint256) {
        Building memory building = buildings[position];
        if (building.owner == address(0)) {
            return 0;
        }

        // Base rent multiplied by level
        uint256 baseRent = 0.0001 ether;
        return baseRent * (2 ** (building.level - 1));
    }

    /**
     * @dev Update token URI
     */
    function setURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }

    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    /**
     * @dev Get total minted NFTs
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds.current();
    }
}
