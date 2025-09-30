import Phaser from 'phaser';
import { GameStateService, BoardTile } from '../../services/game-state.service';

export class MainScene extends Phaser.Scene {
  private gameStateService!: GameStateService;
  private playerSprite!: Phaser.GameObjects.Sprite;
  private board: BoardTile[] = [];
  private tileSprites: Map<number, Phaser.GameObjects.Rectangle> = new Map();
  private buildingSprites: Map<number, Phaser.GameObjects.Sprite> = new Map();
  private infoText!: Phaser.GameObjects.Text;
  private diceText!: Phaser.GameObjects.Text;

  // Board layout constants
  private readonly BOARD_SIZE = 40;
  private readonly TILE_SIZE = 60;
  private readonly BOARD_PADDING = 50;

  constructor() {
    super({ key: 'MainScene' });
  }

  init(data: { gameStateService: GameStateService }) {
    this.gameStateService = data.gameStateService;
  }

  preload() {
    // Load assets
    this.load.image('player', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Ccircle cx="24" cy="24" r="20" fill="%234299e1"/%3E%3Ctext x="24" y="32" font-size="24" text-anchor="middle" fill="white"%3E🎮%3C/text%3E%3C/svg%3E');
    this.load.image('building1', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Crect fill="%238b4513" width="32" height="32" rx="2"/%3E%3Ctext x="16" y="22" font-size="18" text-anchor="middle"%3E🏠%3C/text%3E%3C/svg%3E');
    this.load.image('building2', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Crect fill="%234682b4" width="32" height="32" rx="2"/%3E%3Ctext x="16" y="22" font-size="18" text-anchor="middle"%3E🏢%3C/text%3E%3C/svg%3E');
    this.load.image('building3', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Crect fill="%23ffd700" width="32" height="32" rx="2"/%3E%3Ctext x="16" y="22" font-size="18" text-anchor="middle"%3E🏰%3C/text%3E%3C/svg%3E');
  }

  create() {
    // Set background
    this.cameras.main.setBackgroundColor('#f0f0f0');

    // Initialize board
    this.board = this.gameStateService.getBoard();
    this.createBoard();
    
    // Create player
    this.createPlayer();

    // Create UI
    this.createUI();

    // Subscribe to game state changes
    this.subscribeToGameState();
  }

  private createBoard() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const boardSize = Math.min(this.cameras.main.width, this.cameras.main.height) - 2 * this.BOARD_PADDING;
    const sideLength = Math.floor(boardSize / 4);
    const tileSize = Math.floor(sideLength / 10);

    // Calculate positions for 40 tiles in a square
    const positions: { x: number; y: number }[] = [];
    
    // Bottom row (right to left): positions 0-10
    for (let i = 0; i <= 10; i++) {
      positions.push({
        x: centerX + sideLength / 2 - i * (sideLength / 10),
        y: centerY + sideLength / 2
      });
    }

    // Left side (bottom to top): positions 11-19
    for (let i = 1; i < 10; i++) {
      positions.push({
        x: centerX - sideLength / 2,
        y: centerY + sideLength / 2 - i * (sideLength / 10)
      });
    }

    // Top row (left to right): positions 20-30
    for (let i = 0; i <= 10; i++) {
      positions.push({
        x: centerX - sideLength / 2 + i * (sideLength / 10),
        y: centerY - sideLength / 2
      });
    }

    // Right side (top to bottom): positions 31-39
    for (let i = 1; i < 10; i++) {
      positions.push({
        x: centerX + sideLength / 2,
        y: centerY - sideLength / 2 + i * (sideLength / 10)
      });
    }

    // Create tile sprites
    this.board.forEach((tile, index) => {
      if (positions[index]) {
        const pos = positions[index];
        const color = this.getTileColor(tile);
        
        const rect = this.add.rectangle(pos.x, pos.y, tileSize - 4, tileSize - 4, color);
        rect.setStrokeStyle(2, 0x000000);
        rect.setInteractive();
        
        // Add tile label
        const label = this.add.text(pos.x, pos.y, `${index}`, {
          fontSize: '10px',
          color: '#000',
          align: 'center'
        });
        label.setOrigin(0.5);

        this.tileSprites.set(index, rect);

        // Add click handler
        rect.on('pointerdown', () => {
          this.onTileClick(index);
        });

        // Add hover effect
        rect.on('pointerover', () => {
          rect.setStrokeStyle(3, 0xffff00);
        });

        rect.on('pointerout', () => {
          rect.setStrokeStyle(2, 0x000000);
        });
      }
    });
  }

  private getTileColor(tile: BoardTile): number {
    if (tile.color) {
      return Phaser.Display.Color.HexStringToColor(tile.color).color;
    }
    return 0xcccccc;
  }

  private createPlayer() {
    const startTile = this.tileSprites.get(0);
    if (startTile) {
      this.playerSprite = this.add.sprite(startTile.x, startTile.y - 30, 'player');
      this.playerSprite.setScale(0.6);
    }
  }

  private createUI() {
    // Info panel
    const infoPanel = this.add.rectangle(
      this.cameras.main.width - 150,
      100,
      280,
      200,
      0xffffff,
      0.9
    );
    infoPanel.setStrokeStyle(2, 0x667eea);

    this.infoText = this.add.text(
      infoPanel.x - 130,
      infoPanel.y - 90,
      '欢迎来到 RichMan Web3!',
      {
        fontSize: '12px',
        color: '#000',
        wordWrap: { width: 250 }
      }
    );

    // Dice display
    this.diceText = this.add.text(
      this.cameras.main.width - 150,
      300,
      '🎲 骰子: -',
      {
        fontSize: '16px',
        color: '#000',
        backgroundColor: '#fff',
        padding: { x: 10, y: 10 }
      }
    );
    this.diceText.setOrigin(0.5);
  }

  private subscribeToGameState() {
    // Subscribe to player position changes
    this.gameStateService.playerState$.subscribe(state => {
      this.movePlayerToPosition(state.position);
      this.updateInfo();
      this.updateBuildings();
    });

    // Subscribe to dice results
    this.gameStateService.diceResult$.subscribe(dice => {
      this.diceText.setText(`🎲 骰子: ${dice[0]} + ${dice[1]} = ${dice[0] + dice[1]}`);
    });

    // Subscribe to game messages
    this.gameStateService.gameMessage$.subscribe(message => {
      if (message) {
        this.showMessage(message);
      }
    });
  }

  private movePlayerToPosition(position: number) {
    const tile = this.tileSprites.get(position);
    if (tile && this.playerSprite) {
      this.tweens.add({
        targets: this.playerSprite,
        x: tile.x,
        y: tile.y - 30,
        duration: 500,
        ease: 'Power2'
      });
    }
  }

  private updateInfo() {
    const state = this.gameStateService.getPlayerState();
    const currentTile = this.gameStateService.getTile(state.position);
    
    let info = `💰 金钱: ${state.money}\n`;
    info += `📍 位置: ${state.position}\n`;
    info += `🏠 地产: ${state.properties.length}\n`;
    if (currentTile) {
      info += `\n当前格子:\n${currentTile.name}`;
    }

    this.infoText.setText(info);
  }

  private updateBuildings() {
    // Clear existing building sprites
    this.buildingSprites.forEach(sprite => sprite.destroy());
    this.buildingSprites.clear();

    // Draw buildings for owned properties
    this.board.forEach((tile, index) => {
      if (tile.owner === 'player' && tile.level && tile.level > 0) {
        const tileSprite = this.tileSprites.get(index);
        if (tileSprite) {
          let buildingKey = 'building1';
          if (tile.level >= 3) buildingKey = 'building2';
          if (tile.level >= 5) buildingKey = 'building3';

          const building = this.add.sprite(tileSprite.x, tileSprite.y, buildingKey);
          building.setScale(0.5);
          this.buildingSprites.set(index, building);

          // Add level indicator
          const levelText = this.add.text(
            tileSprite.x + 15,
            tileSprite.y - 15,
            `L${tile.level}`,
            {
              fontSize: '10px',
              color: '#fff',
              backgroundColor: '#000',
              padding: { x: 2, y: 2 }
            }
          );
          levelText.setOrigin(0.5);
        }
      }
    });
  }

  private onTileClick(position: number) {
    const tile = this.board[position];
    const playerState = this.gameStateService.getPlayerState();

    if (playerState.position === position) {
      if (tile.type === 'property' && !tile.owner) {
        // Show purchase option
        this.showPurchaseDialog(position);
      } else if (tile.type === 'property' && tile.owner === 'player') {
        // Show upgrade option
        this.showUpgradeDialog(position);
      }
    }

    // Show tile info
    let info = `${tile.name}\n`;
    if (tile.type === 'property') {
      info += `价格: ${tile.price}\n`;
      if (tile.owner) {
        info += `所有者: ${tile.owner}\n`;
        info += `等级: ${tile.level || 0}`;
      }
    }
    this.showMessage(info);
  }

  private showPurchaseDialog(position: number) {
    console.log('Purchase dialog for position:', position);
    // This will be handled by Angular components
    this.scene.scene.events.emit('show-purchase', position);
  }

  private showUpgradeDialog(position: number) {
    console.log('Upgrade dialog for position:', position);
    // This will be handled by Angular components
    this.scene.scene.events.emit('show-upgrade', position);
  }

  private showMessage(message: string) {
    const messageText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height - 50,
      message,
      {
        fontSize: '14px',
        color: '#fff',
        backgroundColor: '#000',
        padding: { x: 15, y: 10 }
      }
    );
    messageText.setOrigin(0.5);

    // Fade out after 3 seconds
    this.tweens.add({
      targets: messageText,
      alpha: 0,
      duration: 1000,
      delay: 2000,
      onComplete: () => {
        messageText.destroy();
      }
    });
  }

  update() {
    // Game loop updates
  }
}
