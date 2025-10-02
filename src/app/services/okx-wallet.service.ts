import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ethers } from 'ethers';

declare global {
  interface Window {
    okxwallet?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class OkxWalletService {
  private providerSubject = new BehaviorSubject<ethers.BrowserProvider | null>(null);
  private signerSubject = new BehaviorSubject<ethers.Signer | null>(null);
  private accountSubject = new BehaviorSubject<string | null>(null);
  private networkSubject = new BehaviorSubject<string>('');
  private balanceSubject = new BehaviorSubject<string>('0');
  private connectedSubject = new BehaviorSubject<boolean>(false);

  public provider$ = this.providerSubject.asObservable();
  public signer$ = this.signerSubject.asObservable();
  public account$ = this.accountSubject.asObservable();
  public network$ = this.networkSubject.asObservable();
  public balance$ = this.balanceSubject.asObservable();
  public connected$ = this.connectedSubject.asObservable();

  private currentChainId: number = 0;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (window.okxwallet) {
      // 监听账户变化
      window.okxwallet.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          this.accountSubject.next(accounts[0]);
          this.updateBalance(accounts[0]);
        } else {
          this.disconnect();
        }
      });

      // 监听链变化
      window.okxwallet.on('chainChanged', (chainId: string) => {
        console.log('Chain changed to:', chainId);
        window.location.reload();
      });

      // 监听连接状态
      window.okxwallet.on('connect', (connectInfo: { chainId: string }) => {
        console.log('OKX Wallet connected:', connectInfo);
        this.connectedSubject.next(true);
      });

      // 监听断开连接
      window.okxwallet.on('disconnect', (error: any) => {
        console.log('OKX Wallet disconnected:', error);
        this.disconnect();
      });
    }
  }

  async connectWallet(): Promise<string | null> {
    try {
      // 检查 OKX 钱包是否安装
      if (!window.okxwallet) {
        alert('请先安装 OKX 钱包！\n\n您可以从以下地址下载：\nhttps://www.okx.com/web3');
        window.open('https://www.okx.com/web3', '_blank');
        return null;
      }

      // 请求连接钱包
      const provider = new ethers.BrowserProvider(window.okxwallet);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        console.warn('No accounts found');
        return null;
      }

      // 获取签名者和账户信息
      const signer = await provider.getSigner();
      const account = accounts[0];
      const network = await provider.getNetwork();

      // 更新状态
      this.providerSubject.next(provider);
      this.signerSubject.next(signer);
      this.accountSubject.next(account);
      this.networkSubject.next(network.name);
      this.currentChainId = Number(network.chainId);
      this.connectedSubject.next(true);

      // 更新余额
      await this.updateBalance(account);

      // 显示网络信息
      this.displayNetworkInfo(network);

      console.log('✅ OKX 钱包已连接:', account);
      console.log('🌐 网络:', network.name, 'Chain ID:', this.currentChainId);
      
      return account;
    } catch (error: any) {
      console.error('❌ 连接 OKX 钱包失败:', error);
      
      // 处理用户拒绝连接的情况
      if (error.code === 4001) {
        alert('您拒绝了连接请求');
      } else {
        alert('连接失败: ' + error.message);
      }
      
      return null;
    }
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
      console.error('更新余额失败:', error);
    }
  }

  disconnect() {
    this.providerSubject.next(null);
    this.signerSubject.next(null);
    this.accountSubject.next(null);
    this.networkSubject.next('');
    this.balanceSubject.next('0');
    this.connectedSubject.next(false);
    console.log('🔌 OKX 钱包已断开');
  }

  isConnected(): boolean {
    return this.connectedSubject.value && this.accountSubject.value !== null;
  }

  getAccount(): string | null {
    return this.accountSubject.value;
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.providerSubject.value;
  }

  getSigner(): ethers.Signer | null {
    return this.signerSubject.value;
  }

  private displayNetworkInfo(network: any) {
    const chainId = Number(network.chainId);
    const networkNames: { [key: number]: string } = {
      1: '以太坊主网 (Mainnet)',
      5: 'Goerli 测试网',
      11155111: 'Sepolia 测试网',
      1337: 'Hardhat 本地网络',
      31337: 'Hardhat 本地网络',
      56: 'BSC 主网',
      97: 'BSC 测试网',
      137: 'Polygon 主网',
      80001: 'Mumbai 测试网'
    };

    const networkName = networkNames[chainId] || `未知网络 (Chain ID: ${chainId})`;
    console.log(`🌐 已连接到: ${networkName}`);
  }

  getNetworkName(): string {
    const networkNames: { [key: number]: string } = {
      1: 'Ethereum Mainnet',
      5: 'Goerli',
      11155111: 'Sepolia',
      1337: 'Localhost',
      31337: 'Localhost',
      56: 'BSC Mainnet',
      97: 'BSC Testnet',
      137: 'Polygon',
      80001: 'Mumbai'
    };
    return networkNames[this.currentChainId] || 'Unknown';
  }

  getCurrentChainId(): number {
    return this.currentChainId;
  }

  // 切换网络
  async switchNetwork(chainId: number): Promise<boolean> {
    try {
      if (!window.okxwallet) {
        throw new Error('OKX 钱包未安装');
      }

      const chainIdHex = '0x' + chainId.toString(16);
      
      await window.okxwallet.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });

      console.log(`✅ 已切换到网络: ${chainId}`);
      return true;
    } catch (error: any) {
      console.error('切换网络失败:', error);
      
      // 如果网络不存在，尝试添加
      if (error.code === 4902) {
        console.log('网络不存在，需要先添加网络');
      }
      
      return false;
    }
  }

  // 签名消息
  async signMessage(message: string): Promise<string | null> {
    try {
      const signer = this.signerSubject.value;
      if (!signer) {
        throw new Error('请先连接钱包');
      }

      const signature = await signer.signMessage(message);
      console.log('✅ 消息签名成功');
      return signature;
    } catch (error) {
      console.error('❌ 消息签名失败:', error);
      return null;
    }
  }

  // 发送交易
  async sendTransaction(to: string, value: string): Promise<string | null> {
    try {
      const signer = this.signerSubject.value;
      if (!signer) {
        throw new Error('请先连接钱包');
      }

      const tx = await signer.sendTransaction({
        to: to,
        value: ethers.parseEther(value)
      });

      console.log('📤 交易已发送:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ 交易已确认:', receipt);
      
      return tx.hash;
    } catch (error) {
      console.error('❌ 交易失败:', error);
      return null;
    }
  }

  // 检查 OKX 钱包是否安装
  isOkxWalletInstalled(): boolean {
    return typeof window.okxwallet !== 'undefined';
  }
}

