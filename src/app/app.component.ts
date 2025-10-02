import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { Web3Service } from './services/web3.service';
import { GameStateService } from './services/game-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, GameComponent, WalletComponent],
  template: `
    <div class="app-container">
      <header class="game-header">
        <div class="header-content">
          <h1 class="game-title">🎮 RichMan Web3</h1>
          <nav class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">游戏</a>
            <a routerLink="/okx-wallet" routerLinkActive="active">OKX 钱包</a>
          </nav>
          <app-wallet></app-wallet>
        </div>
      </header>

      <main class="game-main">
        <router-outlet></router-outlet>
      </main>

      <footer class="game-footer">
        <p>© 2025 RichMan Web3 - Powered by Blockchain Technology</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .game-header {
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      padding: 16px 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .game-title {
      font-size: 24px;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      margin: 0;
    }

    .nav-links {
      display: flex;
      gap: 16px;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      font-size: 16px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-links a:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-links a.active {
      background: rgba(255, 255, 255, 0.2);
      font-weight: 600;
    }

    .game-main {
      flex: 1;
      padding: 24px;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
    }

    .game-footer {
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      padding: 16px;
      text-align: center;
      color: white;
      font-size: 10px;
    }

    @media (max-width: 768px) {
      .game-title {
        font-size: 16px;
      }

      .game-main {
        padding: 12px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(
    private web3Service: Web3Service,
    private gameStateService: GameStateService
  ) {}

  ngOnInit() {
    // Initialize services
    console.log('RichMan Web3 Game Initialized');
  }
}
