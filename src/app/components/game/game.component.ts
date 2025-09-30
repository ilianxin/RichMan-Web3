import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Phaser from 'phaser';
import { MainScene } from '../../game/scenes/MainScene';
import { GameStateService } from '../../services/game-state.service';
import { Web3Service } from '../../services/web3.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-container">
      <div class="game-canvas" #gameCanvas></div>
      
      <div class="game-controls">
        <div class="control-panel">
          <h2 class="panel-title">🎮 游戏控制</h2>
          
          <div class="player-stats">
            <div class="stat-item">
              <span class="stat-label">💰 金钱:</span>
              <span class="stat-value">{{ (playerState$ | async)?.money || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">📍 位置:</span>
              <span class="stat-value">{{ (playerState$ | async)?.position || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">🏠 地产:</span>
              <span class="stat-value">{{ (playerState$ | async)?.properties.length || 0 }}</span>
            </div>
          </div>

          <div class="dice-section">
            <button 
              (click)="rollDice()" 
              [disabled]="(isRolling$ | async) || false"
              class="btn-primary dice-btn">
              🎲 掷骰子
            </button>
            <div class="dice-result" *ngIf="diceResult$ | async as dice">
              结果: {{ dice[0] }} + {{ dice[1] }} = {{ dice[0] + dice[1] }}
            </div>
          </div>

          <div class="game-message" *ngIf="gameMessage$ | async as message">
            {{ message }}
          </div>

          <div class="action-buttons">
            <button 
              (click)="showPropertyActions()" 
              class="btn-success action-btn"
              *ngIf="canShowPropertyActions()">
              🏠 地产操作
            </button>
            <button 
              (click)="resetGame()" 
              class="btn-warning action-btn">
              🔄 重置游戏
            </button>
          </div>
        </div>

        <!-- Property Actions Modal -->
        <div class="modal-overlay" *ngIf="showPropertyModal" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <h3>地产操作</h3>
            
            <div class="property-list">
              <div 
                *ngFor="let propId of (playerState$ | async)?.properties" 
                class="property-item">
                <div class="property-info">
                  <strong>{{ getTileName(propId) }}</strong>
                  <span class="property-level">等级: {{ getTileLevel(propId) }}</span>
                </div>
                
                <div class="property-actions">
                  <button 
                    (click)="upgradeProperty(propId)"
                    [disabled]="!canUpgrade(propId)"
                    class="btn-primary btn-sm">
                    ⬆️ 升级
                  </button>
                  
                  <button 
                    (click)="mintNFT(propId)"
                    [disabled]="!canMintNFT(propId)"
                    class="btn-success btn-sm"
                    *ngIf="isWalletConnected()">
                    🎨 铸造NFT
                  </button>
                </div>

                <div class="upgrade-cost" *ngIf="canUpgrade(propId)">
                  升级费用: {{ getUpgradeCost(propId) }}
                </div>
              </div>
            </div>

            <div class="no-properties" *ngIf="!(playerState$ | async)?.properties.length">
              暂无地产，请通过掷骰子购买地产！
            </div>

            <button (click)="closeModal()" class="btn-danger close-btn">
              关闭
            </button>
          </div>
        </div>

        <!-- Purchase Modal -->
        <div class="modal-overlay" *ngIf="showPurchaseModal" (click)="closePurchaseModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <h3>购买地产</h3>
            
            <div class="purchase-info" *ngIf="currentTile">
              <p><strong>{{ currentTile.name }}</strong></p>
              <p>价格: {{ currentTile.price }} 元</p>
              <p>当前金钱: {{ (playerState$ | async)?.money || 0 }} 元</p>
            </div>

            <div class="purchase-actions">
              <button 
                (click)="confirmPurchase()"
                [disabled]="!canPurchase()"
                class="btn-success">
                ✅ 确认购买
              </button>
              <button 
                (click)="closePurchaseModal()"
                class="btn-danger">
                ❌ 取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .game-container {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .game-canvas {
      width: 800px;
      height: 800px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .game-controls {
      flex: 1;
      min-width: 300px;
      max-width: 400px;
    }

    .control-panel {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .panel-title {
      font-size: 18px;
      margin-bottom: 20px;
      color: var(--primary-color);
      text-align: center;
    }

    .player-stats {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      color: white;
      font-size: 12px;
    }

    .stat-label {
      font-weight: bold;
    }

    .stat-value {
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 12px;
      border-radius: 12px;
    }

    .dice-section {
      text-align: center;
      margin-bottom: 20px;
    }

    .dice-btn {
      width: 100%;
      padding: 16px;
      font-size: 14px;
      margin-bottom: 12px;
    }

    .dice-result {
      font-size: 12px;
      color: var(--dark-color);
      font-weight: bold;
    }

    .game-message {
      background: var(--info-color);
      color: white;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 11px;
      text-align: center;
      animation: fadeIn 0.5s ease-out;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .action-btn {
      width: 100%;
      padding: 12px;
      font-size: 12px;
    }

    .property-list {
      max-height: 400px;
      overflow-y: auto;
      margin: 20px 0;
    }

    .property-item {
      background: #f7fafc;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      border-left: 4px solid var(--primary-color);
    }

    .property-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 11px;
    }

    .property-level {
      background: var(--warning-color);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 10px;
    }

    .property-actions {
      display: flex;
      gap: 8px;
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 10px;
      flex: 1;
    }

    .upgrade-cost {
      margin-top: 8px;
      font-size: 10px;
      color: var(--warning-color);
    }

    .no-properties {
      text-align: center;
      padding: 40px 20px;
      color: #999;
      font-size: 11px;
    }

    .purchase-info {
      margin: 20px 0;
      font-size: 12px;
    }

    .purchase-info p {
      margin: 8px 0;
    }

    .purchase-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .purchase-actions button {
      flex: 1;
      padding: 12px;
      font-size: 12px;
    }

    .close-btn {
      width: 100%;
      padding: 12px;
      margin-top: 12px;
      font-size: 12px;
    }

    @media (max-width: 1200px) {
      .game-canvas {
        width: 600px;
        height: 600px;
      }
    }

    @media (max-width: 768px) {
      .game-container {
        flex-direction: column;
      }

      .game-canvas {
        width: 100%;
        height: 500px;
      }

      .game-controls {
        max-width: 100%;
      }
    }
  `]
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) gameCanvas!: ElementRef;

  private game!: Phaser.Game;
  private mainScene!: MainScene;

  playerState$ = this.gameStateService.playerState$;
  diceResult$ = this.gameStateService.diceResult$;
  gameMessage$ = this.gameStateService.gameMessage$;
  isRolling$ = this.gameStateService.isRolling$;

  showPropertyModal = false;
  showPurchaseModal = false;
  currentTile: any = null;

  constructor(
    private gameStateService: GameStateService,
    private web3Service: Web3Service
  ) {}

  ngOnInit() {
    this.initializeGame();
  }

  ngOnDestroy() {
    if (this.game) {
      this.game.destroy(true);
    }
  }

  private initializeGame() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 800,
      parent: this.gameCanvas.nativeElement,
      backgroundColor: '#f0f0f0',
      scene: MainScene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      }
    };

    this.game = new Phaser.Game(config);
    
    // Pass game state service to scene
    this.game.scene.start('MainScene', { gameStateService: this.gameStateService });

    // Subscribe to current tile
    this.gameStateService.currentTile$.subscribe(tile => {
      if (tile && tile.type === 'property' && !tile.owner) {
        this.currentTile = tile;
        this.showPurchaseModal = true;
      }
    });
  }

  rollDice() {
    this.gameStateService.rollDice();
  }

  resetGame() {
    if (confirm('确定要重置游戏吗？')) {
      this.gameStateService.resetGame();
    }
  }

  showPropertyActions() {
    this.showPropertyModal = true;
  }

  closeModal() {
    this.showPropertyModal = false;
  }

  closePurchaseModal() {
    this.showPurchaseModal = false;
    this.currentTile = null;
  }

  canShowPropertyActions(): boolean {
    const state = this.gameStateService.getPlayerState();
    return state.properties.length > 0;
  }

  getTileName(position: number): string {
    const tile = this.gameStateService.getTile(position);
    return tile?.name || '';
  }

  getTileLevel(position: number): number {
    const tile = this.gameStateService.getTile(position);
    return tile?.level || 0;
  }

  canUpgrade(position: number): boolean {
    const tile = this.gameStateService.getTile(position);
    if (!tile || tile.level === undefined || tile.level >= 5) {
      return false;
    }
    const state = this.gameStateService.getPlayerState();
    const upgradeCost = (tile.price || 0) * 0.5;
    return state.money >= upgradeCost;
  }

  getUpgradeCost(position: number): string {
    const tile = this.gameStateService.getTile(position);
    if (!tile) return '0';
    const cost = (tile.price || 0) * 0.5;
    return `${cost} 元`;
  }

  upgradeProperty(position: number) {
    const success = this.gameStateService.upgradeProperty(position);
    if (success && this.web3Service.isConnected()) {
      // Also upgrade on blockchain
      this.web3Service.upgradeBuilding(position).then(result => {
        if (result) {
          console.log('Blockchain upgrade successful');
        }
      });
    }
  }

  canMintNFT(position: number): boolean {
    if (!this.isWalletConnected()) {
      return false;
    }
    const tile = this.gameStateService.getTile(position);
    return tile?.level === 5 && !tile.isMinted;
  }

  async mintNFT(position: number) {
    if (!this.canMintNFT(position)) {
      return;
    }

    const confirmed = confirm('确定要将此建筑铸造为 NFT 吗？需要支付 0.001 ETH 的铸造费用。');
    if (!confirmed) {
      return;
    }

    try {
      const success = await this.web3Service.mintBuildingNFT(position);
      if (success) {
        alert('🎉 NFT 铸造成功！');
        this.gameStateService.setGameMessage('🎉 NFT 铸造成功！');
      } else {
        alert('❌ NFT 铸造失败，请重试。');
      }
    } catch (error) {
      console.error('Mint NFT error:', error);
      alert('❌ NFT 铸造失败，请重试。');
    }
  }

  isWalletConnected(): boolean {
    return this.web3Service.isConnected();
  }

  canPurchase(): boolean {
    if (!this.currentTile) return false;
    const state = this.gameStateService.getPlayerState();
    return state.money >= (this.currentTile.price || 0);
  }

  async confirmPurchase() {
    if (!this.currentTile) return;

    const position = this.currentTile.id;
    const success = this.gameStateService.buyProperty(position);

    if (success && this.isWalletConnected()) {
      // Also purchase on blockchain
      await this.web3Service.purchaseBuilding(position);
    }

    this.closePurchaseModal();
  }
}
