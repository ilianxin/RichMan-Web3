import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private providerSubject = new BehaviorSubject<ethers.BrowserProvider | null>(null);
  private signerSubject = new BehaviorSubject<ethers.Signer | null>(null);
  private accountSubject = new BehaviorSubject<string | null>(null);
  private contractSubject = new BehaviorSubject<ethers.Contract | null>(null);
  private networkSubject = new BehaviorSubject<string>('');
  private balanceSubject = new BehaviorSubject<string>('0');

  public provider$ = this.providerSubject.asObservable();
  public signer$ = this.signerSubject.asObservable();
  public account$ = this.accountSubject.asObservable();
  public contract$ = this.contractSubject.asObservable();
  public network$ = this.networkSubject.asObservable();
  public balance$ = this.balanceSubject.asObservable();

  private contractAddress: string = '';
  private contractABI: any[] = [];
  private currentChainId: number = 0;

  constructor() {
    this.loadContractInfo();
    this.setupEventListeners();
  }

  private async loadContractInfo() {
    try {
      const addressResponse = await fetch('/assets/contracts/contract-address.json');
      const addresses = await addressResponse.json();
      this.contractAddress = addresses.RichManGame;

      const abiResponse = await fetch('/assets/contracts/RichManGame.json');
      const artifact = await abiResponse.json();
      this.contractABI = artifact.abi;
    } catch (error) {
      console.error('Failed to load contract info:', error);
    }
  }

  private setupEventListeners() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          this.accountSubject.next(accounts[0]);
          this.updateBalance(accounts[0]);
        } else {
          this.disconnect();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }

  async connectWallet(): Promise<string | null> {
    try {
      if (!window.ethereum) {
        alert('请安装 MetaMask 钱包！');
        return null;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        return null;
      }

      const signer = await provider.getSigner();
      const account = accounts[0];
      const network = await provider.getNetwork();

      this.providerSubject.next(provider);
      this.signerSubject.next(signer);
      this.accountSubject.next(account);
      this.networkSubject.next(network.name);
      this.currentChainId = Number(network.chainId);

      await this.updateBalance(account);
      await this.initContract(signer);

      // 显示当前网络信息
      this.displayNetworkInfo(network);

      console.log('Wallet connected:', account);
      console.log('Network:', network.name, 'Chain ID:', this.currentChainId);
      return account;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return null;
    }
  }

  private async initContract(signer: ethers.Signer) {
    if (!this.contractAddress || this.contractABI.length === 0) {
      console.warn('Contract info not loaded yet');
      return;
    }

    const contract = new ethers.Contract(this.contractAddress, this.contractABI, signer);
    this.contractSubject.next(contract);
    console.log('Contract initialized:', this.contractAddress);
  }

  private async updateBalance(account: string) {
    try {
      const provider = this.providerSubject.value;
      if (provider) {
        const balance = await provider.getBalance(account);
        const balanceInEth = ethers.formatEther(balance);
        this.balanceSubject.next(parseFloat(balanceInEth).toFixed(4));
      }
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  }

  disconnect() {
    this.providerSubject.next(null);
    this.signerSubject.next(null);
    this.accountSubject.next(null);
    this.contractSubject.next(null);
    this.balanceSubject.next('0');
  }

  isConnected(): boolean {
    return this.accountSubject.value !== null;
  }

  getAccount(): string | null {
    return this.accountSubject.value;
  }

  getContract(): ethers.Contract | null {
    return this.contractSubject.value;
  }

  async purchaseBuilding(position: number): Promise<boolean> {
    try {
      const contract = this.contractSubject.value;
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await contract['purchaseBuilding'](position);
      await tx.wait();
      console.log('Building purchased at position:', position);
      return true;
    } catch (error) {
      console.error('Failed to purchase building:', error);
      return false;
    }
  }

  async upgradeBuilding(position: number): Promise<boolean> {
    try {
      const contract = this.contractSubject.value;
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await contract['upgradeBuilding'](position);
      await tx.wait();
      console.log('Building upgraded at position:', position);
      return true;
    } catch (error) {
      console.error('Failed to upgrade building:', error);
      return false;
    }
  }

  async mintBuildingNFT(position: number): Promise<boolean> {
    try {
      const contract = this.contractSubject.value;
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const mintFee = ethers.parseEther('0.001');
      const tx = await contract['mintBuildingNFT'](position, { value: mintFee });
      await tx.wait();
      console.log('Building NFT minted at position:', position);
      return true;
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      return false;
    }
  }

  async payRent(position: number, amount: string): Promise<boolean> {
    try {
      const contract = this.contractSubject.value;
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const rentAmount = ethers.parseEther(amount);
      const tx = await contract['payRent'](position, { value: rentAmount });
      await tx.wait();
      console.log('Rent paid for position:', position);
      return true;
    } catch (error) {
      console.error('Failed to pay rent:', error);
      return false;
    }
  }

  async getBuilding(position: number): Promise<any> {
    try {
      const contract = this.contractSubject.value;
      if (!contract) {
        return null;
      }

      const building = await contract['getBuilding'](position);
      return building;
    } catch (error) {
      console.error('Failed to get building:', error);
      return null;
    }
  }

  async calculateRent(position: number): Promise<string> {
    try {
      const contract = this.contractSubject.value;
      if (!contract) {
        return '0';
      }

      const rent = await contract['calculateRent'](position);
      return ethers.formatEther(rent);
    } catch (error) {
      console.error('Failed to calculate rent:', error);
      return '0';
    }
  }

  private displayNetworkInfo(network: any) {
    const chainId = Number(network.chainId);
    const networkNames: { [key: number]: string } = {
      1: '以太坊主网 (Mainnet)',
      5: 'Goerli 测试网',
      11155111: 'Sepolia 测试网',
      1337: 'Hardhat 本地网络',
      31337: 'Hardhat 本地网络'
    };

    const networkName = networkNames[chainId] || `未知网络 (Chain ID: ${chainId})`;
    console.log(`🌐 已连接到: ${networkName}`);
  }

  getNetworkName(): string {
    const networkNames: { [key: number]: string } = {
      1: 'Mainnet',
      5: 'Goerli',
      11155111: 'Sepolia',
      1337: 'Localhost',
      31337: 'Localhost'
    };
    return networkNames[this.currentChainId] || 'Unknown';
  }

  getCurrentChainId(): number {
    return this.currentChainId;
  }

  isSepoliaNetwork(): boolean {
    return this.currentChainId === 11155111;
  }

  isLocalNetwork(): boolean {
    return this.currentChainId === 1337 || this.currentChainId === 31337;
  }
}
