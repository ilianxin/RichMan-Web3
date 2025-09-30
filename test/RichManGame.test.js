const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RichManGame", function () {
  let richManGame;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();

    const RichManGame = await ethers.getContractFactory("RichManGame");
    richManGame = await RichManGame.deploy();
    await richManGame.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await richManGame.owner()).to.equal(owner.address);
    });

    it("Should have correct mint fee", async function () {
      expect(await richManGame.MINT_FEE()).to.equal(ethers.parseEther("0.001"));
    });

    it("Should have correct max level", async function () {
      expect(await richManGame.MAX_LEVEL()).to.equal(5);
    });
  });

  describe("Building Purchase", function () {
    it("Should allow purchasing a building", async function () {
      await richManGame.connect(player1).purchaseBuilding(5);
      
      const building = await richManGame.getBuilding(5);
      expect(building.owner).to.equal(player1.address);
      expect(building.level).to.equal(1);
      expect(building.position).to.equal(5);
    });

    it("Should not allow purchasing the same building twice", async function () {
      await richManGame.connect(player1).purchaseBuilding(5);
      
      await expect(
        richManGame.connect(player2).purchaseBuilding(5)
      ).to.be.revertedWith("Building already owned");
    });

    it("Should not allow purchasing invalid position", async function () {
      await expect(
        richManGame.connect(player1).purchaseBuilding(50)
      ).to.be.revertedWith("Invalid position");
    });
  });

  describe("Building Upgrade", function () {
    beforeEach(async function () {
      await richManGame.connect(player1).purchaseBuilding(10);
    });

    it("Should allow upgrading owned building", async function () {
      await richManGame.connect(player1).upgradeBuilding(10);
      
      const building = await richManGame.getBuilding(10);
      expect(building.level).to.equal(2);
    });

    it("Should not allow upgrading building owned by another player", async function () {
      await expect(
        richManGame.connect(player2).upgradeBuilding(10)
      ).to.be.revertedWith("Not building owner");
    });

    it("Should allow upgrading to max level", async function () {
      // Upgrade to level 5
      for (let i = 0; i < 4; i++) {
        await richManGame.connect(player1).upgradeBuilding(10);
      }
      
      const building = await richManGame.getBuilding(10);
      expect(building.level).to.equal(5);
    });

    it("Should not allow upgrading beyond max level", async function () {
      // Upgrade to level 5
      for (let i = 0; i < 4; i++) {
        await richManGame.connect(player1).upgradeBuilding(10);
      }
      
      await expect(
        richManGame.connect(player1).upgradeBuilding(10)
      ).to.be.revertedWith("Building at max level");
    });
  });

  describe("NFT Minting", function () {
    beforeEach(async function () {
      await richManGame.connect(player1).purchaseBuilding(15);
      
      // Upgrade to level 5
      for (let i = 0; i < 4; i++) {
        await richManGame.connect(player1).upgradeBuilding(15);
      }
    });

    it("Should allow minting NFT for level 5 building", async function () {
      const mintFee = await richManGame.MINT_FEE();
      
      await expect(
        richManGame.connect(player1).mintBuildingNFT(15, { value: mintFee })
      ).to.emit(richManGame, "BuildingMinted")
        .withArgs(player1.address, 1, 15);

      const building = await richManGame.getBuilding(15);
      expect(building.isMinted).to.equal(true);
      expect(building.tokenId).to.equal(1);
    });

    it("Should not allow minting without sufficient fee", async function () {
      const insufficientFee = ethers.parseEther("0.0001");
      
      await expect(
        richManGame.connect(player1).mintBuildingNFT(15, { value: insufficientFee })
      ).to.be.revertedWith("Insufficient mint fee");
    });

    it("Should not allow minting building below level 5", async function () {
      await richManGame.connect(player1).purchaseBuilding(20);
      const mintFee = await richManGame.MINT_FEE();
      
      await expect(
        richManGame.connect(player1).mintBuildingNFT(20, { value: mintFee })
      ).to.be.revertedWith("Building must be level 5");
    });

    it("Should not allow minting already minted building", async function () {
      const mintFee = await richManGame.MINT_FEE();
      
      await richManGame.connect(player1).mintBuildingNFT(15, { value: mintFee });
      
      await expect(
        richManGame.connect(player1).mintBuildingNFT(15, { value: mintFee })
      ).to.be.revertedWith("Building already minted");
    });

    it("Should increment token ID for each mint", async function () {
      // Purchase and upgrade another building
      await richManGame.connect(player1).purchaseBuilding(25);
      for (let i = 0; i < 4; i++) {
        await richManGame.connect(player1).upgradeBuilding(25);
      }

      const mintFee = await richManGame.MINT_FEE();
      
      // Mint first NFT
      await richManGame.connect(player1).mintBuildingNFT(15, { value: mintFee });
      
      // Mint second NFT
      await expect(
        richManGame.connect(player1).mintBuildingNFT(25, { value: mintFee })
      ).to.emit(richManGame, "BuildingMinted")
        .withArgs(player1.address, 2, 25);
    });
  });

  describe("Rent Payment", function () {
    beforeEach(async function () {
      await richManGame.connect(player1).purchaseBuilding(30);
    });

    it("Should allow paying rent to building owner", async function () {
      const rentAmount = ethers.parseEther("0.01");
      
      const initialBalance = await ethers.provider.getBalance(player1.address);
      
      await expect(
        richManGame.connect(player2).payRent(30, { value: rentAmount })
      ).to.emit(richManGame, "RentPaid")
        .withArgs(player2.address, player1.address, rentAmount, 30);

      const finalBalance = await ethers.provider.getBalance(player1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should not allow paying rent to yourself", async function () {
      const rentAmount = ethers.parseEther("0.01");
      
      await expect(
        richManGame.connect(player1).payRent(30, { value: rentAmount })
      ).to.be.revertedWith("Cannot pay rent to yourself");
    });

    it("Should not allow paying zero rent", async function () {
      await expect(
        richManGame.connect(player2).payRent(30, { value: 0 })
      ).to.be.revertedWith("Rent amount must be greater than 0");
    });
  });

  describe("Rent Calculation", function () {
    it("Should calculate rent based on building level", async function () {
      await richManGame.connect(player1).purchaseBuilding(35);
      
      // Level 1
      let rent = await richManGame.calculateRent(35);
      expect(rent).to.equal(ethers.parseEther("0.0001"));

      // Level 2
      await richManGame.connect(player1).upgradeBuilding(35);
      rent = await richManGame.calculateRent(35);
      expect(rent).to.equal(ethers.parseEther("0.0002"));

      // Level 3
      await richManGame.connect(player1).upgradeBuilding(35);
      rent = await richManGame.calculateRent(35);
      expect(rent).to.equal(ethers.parseEther("0.0004"));
    });

    it("Should return 0 for unowned buildings", async function () {
      const rent = await richManGame.calculateRent(39);
      expect(rent).to.equal(0);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update URI", async function () {
      const newURI = "https://new-uri.com/api/token/{id}.json";
      await richManGame.connect(owner).setURI(newURI);
    });

    it("Should not allow non-owner to update URI", async function () {
      const newURI = "https://new-uri.com/api/token/{id}.json";
      await expect(
        richManGame.connect(player1).setURI(newURI)
      ).to.be.reverted;
    });

    it("Should allow owner to withdraw funds", async function () {
      // First, add some funds to contract
      const mintFee = await richManGame.MINT_FEE();
      await richManGame.connect(player1).purchaseBuilding(5);
      for (let i = 0; i < 4; i++) {
        await richManGame.connect(player1).upgradeBuilding(5);
      }
      await richManGame.connect(player1).mintBuildingNFT(5, { value: mintFee });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await richManGame.connect(owner).withdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should not allow non-owner to withdraw funds", async function () {
      await expect(
        richManGame.connect(player1).withdraw()
      ).to.be.reverted;
    });
  });

  describe("Player Buildings Query", function () {
    it("Should track all buildings owned by player", async function () {
      await richManGame.connect(player1).purchaseBuilding(1);
      await richManGame.connect(player1).purchaseBuilding(5);
      await richManGame.connect(player1).purchaseBuilding(10);

      const buildings = await richManGame.getPlayerBuildings(player1.address);
      expect(buildings.length).to.equal(3);
      expect(buildings[0]).to.equal(1);
      expect(buildings[1]).to.equal(5);
      expect(buildings[2]).to.equal(10);
    });
  });
});
