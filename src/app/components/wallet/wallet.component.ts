import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from '../../services/web3.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wallet-container">
      <div *ngIf="!(account$ | async)" class="connect-wallet">
        <button (click)="connectWallet()" class="btn-primary wallet-btn">
          🔗 连接钱包
        </button>
      </div>

      <div *ngIf="account$ | async" class="wallet-info">
        <div class="wallet-address">
          <span class="wallet-label">地址:</span>
          <span class="address">{{ (account$ | async) | slice:0:6 }}...{{ (account$ | async) | slice:-4 }}</span>
        </div>
        <div class="wallet-balance">
          <span class="balance-label">余额:</span>
          <span class="balance">{{ balance$ | async }} ETH</span>
        </div>
        <button (click)="disconnect()" class="btn-danger disconnect-btn">
          断开
        </button>
      </div>
    </div>
  `,
  styles: [`
    .wallet-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .wallet-btn {
      padding: 10px 20px;
      font-size: 12px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .wallet-info {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(255, 255, 255, 0.1);
      padding: 8px 16px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .wallet-address,
    .wallet-balance {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .wallet-label,
    .balance-label {
      font-size: 8px;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
    }

    .address,
    .balance {
      font-size: 12px;
      color: white;
      font-weight: bold;
    }

    .disconnect-btn {
      padding: 6px 12px;
      font-size: 10px;
      border-radius: 6px;
    }

    @media (max-width: 768px) {
      .wallet-info {
        flex-direction: column;
        gap: 8px;
      }

      .wallet-label,
      .balance-label {
        font-size: 6px;
      }

      .address,
      .balance {
        font-size: 10px;
      }
    }
  `]
})
export class WalletComponent implements OnInit {
  account$ = this.web3Service.account$;
  balance$ = this.web3Service.balance$;

  constructor(private web3Service: Web3Service) {}

  ngOnInit() {
    // Check if already connected
    if (window.ethereum && window.ethereum.selectedAddress) {
      this.connectWallet();
    }
  }

  async connectWallet() {
    await this.web3Service.connectWallet();
  }

  disconnect() {
    this.web3Service.disconnect();
  }
}
