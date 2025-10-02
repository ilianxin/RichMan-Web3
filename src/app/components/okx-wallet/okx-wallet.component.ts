import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OkxWalletService } from '../../services/okx-wallet.service';

@Component({
  selector: 'app-okx-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="okx-wallet-container">
      <div class="wallet-header">
        <div class="header-title">
          <img src="https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png" 
               alt="OKX Logo" 
               class="okx-logo">
          <h1>OKX 钱包测试页面</h1>
        </div>
        <div class="installation-status">
          <span class="status-label">钱包状态:</span>
          <span [class]="isInstalled ? 'status-installed' : 'status-not-installed'">
            {{ isInstalled ? '✅ 已安装' : '❌ 未安装' }}
          </span>
        </div>
      </div>

      <!-- 未连接状态 -->
      <div *ngIf="!isConnected" class="wallet-card">
        <div class="card-content">
          <div class="icon-wrapper">
            🔗
          </div>
          <h2>连接 OKX 钱包</h2>
          <p class="description">
            点击下方按钮连接您的 OKX 钱包，开始使用 Web3 功能
          </p>
          
          <div *ngIf="!isInstalled" class="warning-box">
            <span class="warning-icon">⚠️</span>
            <div class="warning-content">
              <p><strong>未检测到 OKX 钱包</strong></p>
              <p>请先安装 OKX 钱包浏览器扩展</p>
              <a href="https://www.okx.com/web3" target="_blank" class="download-link">
                下载 OKX 钱包 →
              </a>
            </div>
          </div>

          <button 
            (click)="connectWallet()" 
            [disabled]="!isInstalled"
            class="btn-connect">
            {{ isInstalled ? '🔗 连接 OKX 钱包' : '请先安装钱包' }}
          </button>
        </div>
      </div>

      <!-- 已连接状态 -->
      <div *ngIf="isConnected" class="connected-container">
        <!-- 账户信息卡片 -->
        <div class="wallet-card info-card">
          <div class="card-header">
            <h3>💼 账户信息</h3>
            <button (click)="disconnect()" class="btn-disconnect">
              断开连接
            </button>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">钱包地址</span>
              <div class="info-value address-value">
                <span>{{ account }}</span>
                <button (click)="copyAddress()" class="btn-copy" title="复制地址">
                  📋
                </button>
              </div>
            </div>
            <div class="info-item">
              <span class="info-label">账户余额</span>
              <span class="info-value balance-value">{{ balance }} ETH</span>
            </div>
            <div class="info-item">
              <span class="info-label">当前网络</span>
              <span class="info-value network-value">{{ networkName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Chain ID</span>
              <span class="info-value">{{ chainId }}</span>
            </div>
          </div>
        </div>

        <!-- 功能测试卡片 -->
        <div class="wallet-card">
          <div class="card-header">
            <h3>🧪 功能测试</h3>
          </div>
          
          <!-- 签名消息测试 -->
          <div class="test-section">
            <h4>📝 签名消息</h4>
            <p class="test-description">测试钱包签名功能</p>
            <div class="input-group">
              <input 
                type="text" 
                [(ngModel)]="messageToSign"
                placeholder="输入要签名的消息"
                class="input-field">
              <button (click)="signMessage()" class="btn-action">
                签名
              </button>
            </div>
            <div *ngIf="signature" class="result-box">
              <strong>签名结果:</strong>
              <code>{{ signature }}</code>
            </div>
          </div>

          <!-- 发送交易测试 -->
          <div class="test-section">
            <h4>💸 发送交易</h4>
            <p class="test-description">测试发送 ETH 交易</p>
            <div class="input-group">
              <input 
                type="text" 
                [(ngModel)]="recipientAddress"
                placeholder="接收地址"
                class="input-field">
            </div>
            <div class="input-group">
              <input 
                type="text" 
                [(ngModel)]="sendAmount"
                placeholder="金额 (ETH)"
                class="input-field">
              <button (click)="sendTransaction()" class="btn-action">
                发送
              </button>
            </div>
            <div *ngIf="txHash" class="result-box success-box">
              <strong>交易哈希:</strong>
              <code>{{ txHash }}</code>
            </div>
          </div>

          <!-- 切换网络测试 -->
          <div class="test-section">
            <h4>🌐 切换网络</h4>
            <p class="test-description">测试网络切换功能</p>
            <div class="network-buttons">
              <button (click)="switchToSepolia()" class="btn-network">
                Sepolia 测试网
              </button>
              <button (click)="switchToMainnet()" class="btn-network">
                以太坊主网
              </button>
              <button (click)="switchToBSC()" class="btn-network">
                BSC 主网
              </button>
            </div>
          </div>
        </div>

        <!-- 调试信息 -->
        <div class="wallet-card debug-card">
          <div class="card-header">
            <h3>🐛 调试信息</h3>
          </div>
          <div class="debug-content">
            <pre>{{ debugInfo | json }}</pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .okx-wallet-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .wallet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding: 24px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .okx-logo {
      width: 48px;
      height: 48px;
      border-radius: 12px;
    }

    .header-title h1 {
      font-size: 28px;
      font-weight: bold;
      color: #1a1a1a;
      margin: 0;
    }

    .installation-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .status-label {
      font-size: 14px;
      color: #666;
    }

    .status-installed {
      color: #10b981;
      font-weight: 600;
    }

    .status-not-installed {
      color: #ef4444;
      font-weight: 600;
    }

    .wallet-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 24px;
      overflow: hidden;
    }

    .card-content {
      padding: 48px;
      text-align: center;
    }

    .icon-wrapper {
      font-size: 64px;
      margin-bottom: 24px;
    }

    .card-content h2 {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 12px;
    }

    .description {
      font-size: 16px;
      color: #666;
      margin-bottom: 24px;
    }

    .warning-box {
      display: flex;
      gap: 16px;
      padding: 20px;
      background: #fef3c7;
      border: 1px solid #fbbf24;
      border-radius: 12px;
      margin-bottom: 24px;
      text-align: left;
    }

    .warning-icon {
      font-size: 24px;
    }

    .warning-content p {
      margin: 4px 0;
      color: #92400e;
    }

    .download-link {
      display: inline-block;
      margin-top: 8px;
      color: #2563eb;
      text-decoration: none;
      font-weight: 600;
    }

    .download-link:hover {
      text-decoration: underline;
    }

    .btn-connect {
      padding: 16px 48px;
      font-size: 18px;
      font-weight: 600;
      color: white;
      background: linear-gradient(135deg, #000000, #333333);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-connect:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .btn-connect:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }

    .connected-container {
      display: grid;
      gap: 24px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .card-header h3 {
      font-size: 20px;
      font-weight: bold;
      color: #1a1a1a;
      margin: 0;
    }

    .btn-disconnect {
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 600;
      color: #ef4444;
      background: #fee2e2;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-disconnect:hover {
      background: #fecaca;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      padding: 24px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .info-label {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      word-break: break-all;
    }

    .address-value {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-copy {
      padding: 4px 8px;
      background: #f3f4f6;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-copy:hover {
      background: #e5e7eb;
    }

    .balance-value {
      color: #10b981;
      font-size: 20px;
    }

    .network-value {
      color: #3b82f6;
    }

    .test-section {
      padding: 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .test-section:last-child {
      border-bottom: none;
    }

    .test-section h4 {
      font-size: 18px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 8px;
    }

    .test-description {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 16px;
    }

    .input-group {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .input-field {
      flex: 1;
      padding: 12px 16px;
      font-size: 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .input-field:focus {
      border-color: #3b82f6;
    }

    .btn-action {
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      color: white;
      background: #3b82f6;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .btn-action:hover {
      background: #2563eb;
    }

    .result-box {
      padding: 16px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-top: 12px;
    }

    .result-box strong {
      display: block;
      margin-bottom: 8px;
      color: #374151;
    }

    .result-box code {
      display: block;
      padding: 12px;
      background: white;
      border-radius: 6px;
      font-size: 12px;
      word-break: break-all;
      color: #1f2937;
    }

    .success-box {
      background: #ecfdf5;
      border-color: #10b981;
    }

    .network-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-network {
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      color: white;
      background: #6366f1;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-network:hover {
      background: #4f46e5;
      transform: translateY(-2px);
    }

    .debug-card .card-header {
      border-bottom: 1px solid #e5e7eb;
    }

    .debug-content {
      padding: 24px;
    }

    .debug-content pre {
      padding: 16px;
      background: #1f2937;
      color: #10b981;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 12px;
      margin: 0;
    }

    @media (max-width: 768px) {
      .okx-wallet-container {
        padding: 16px;
      }

      .wallet-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .header-title {
        flex-direction: column;
      }

      .card-content {
        padding: 24px;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .input-group {
        flex-direction: column;
      }

      .network-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class OkxWalletComponent implements OnInit {
  isInstalled = false;
  isConnected = false;
  account = '';
  balance = '0';
  networkName = '';
  chainId = 0;

  // 测试功能的变量
  messageToSign = 'Hello OKX Wallet!';
  signature = '';
  recipientAddress = '';
  sendAmount = '0.001';
  txHash = '';

  debugInfo: any = {};

  constructor(private okxWalletService: OkxWalletService) {}

  ngOnInit() {
    // 检查 OKX 钱包是否安装
    this.isInstalled = this.okxWalletService.isOkxWalletInstalled();

    // 订阅钱包状态
    this.okxWalletService.account$.subscribe(account => {
      this.account = account || '';
      this.isConnected = !!account;
      this.updateDebugInfo();
    });

    this.okxWalletService.balance$.subscribe(balance => {
      this.balance = balance;
      this.updateDebugInfo();
    });

    this.okxWalletService.network$.subscribe(network => {
      this.networkName = this.okxWalletService.getNetworkName();
      this.chainId = this.okxWalletService.getCurrentChainId();
      this.updateDebugInfo();
    });

    // 检查是否已连接
    if (this.isInstalled && (window.okxwallet as any)?.selectedAddress) {
      this.connectWallet();
    }
  }

  async connectWallet() {
    const account = await this.okxWalletService.connectWallet();
    if (account) {
      console.log('✅ 钱包连接成功:', account);
    }
  }

  disconnect() {
    this.okxWalletService.disconnect();
    this.signature = '';
    this.txHash = '';
  }

  copyAddress() {
    if (this.account) {
      navigator.clipboard.writeText(this.account);
      alert('地址已复制到剪贴板！');
    }
  }

  async signMessage() {
    if (!this.messageToSign) {
      alert('请输入要签名的消息');
      return;
    }

    const signature = await this.okxWalletService.signMessage(this.messageToSign);
    if (signature) {
      this.signature = signature;
    }
  }

  async sendTransaction() {
    if (!this.recipientAddress || !this.sendAmount) {
      alert('请填写接收地址和金额');
      return;
    }

    if (!this.recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('接收地址格式不正确');
      return;
    }

    const confirmed = confirm(`确认发送 ${this.sendAmount} ETH 到\n${this.recipientAddress}？`);
    if (!confirmed) return;

    const txHash = await this.okxWalletService.sendTransaction(
      this.recipientAddress,
      this.sendAmount
    );

    if (txHash) {
      this.txHash = txHash;
    }
  }

  async switchToSepolia() {
    await this.okxWalletService.switchNetwork(11155111);
  }

  async switchToMainnet() {
    const confirmed = confirm('⚠️ 警告：您正在切换到以太坊主网！\n\n确认要继续吗？');
    if (confirmed) {
      await this.okxWalletService.switchNetwork(1);
    }
  }

  async switchToBSC() {
    await this.okxWalletService.switchNetwork(56);
  }

  private updateDebugInfo() {
    this.debugInfo = {
      isInstalled: this.isInstalled,
      isConnected: this.isConnected,
      account: this.account,
      balance: this.balance,
      networkName: this.networkName,
      chainId: this.chainId,
      timestamp: new Date().toISOString()
    };
  }
}

