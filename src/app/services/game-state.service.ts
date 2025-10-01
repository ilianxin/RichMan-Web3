import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PlayerState {
  position: number;
  money: number;
  properties: number[];
  inJail: boolean;
}

export interface BoardTile {
  id: number;
  type: 'property' | 'chance' | 'community' | 'tax' | 'go' | 'jail' | 'parking' | 'gotoJail';
  name: string;
  price?: number;
  rent?: number[];
  owner?: string | null;
  level?: number;
  color?: string;
  isMinted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private playerStateSubject = new BehaviorSubject<PlayerState>({
    position: 0,
    money: 10000,
    properties: [],
    inJail: false
  });

  private diceResultSubject = new BehaviorSubject<number[]>([1, 1]);
  private currentTileSubject = new BehaviorSubject<BoardTile | null>(null);
  private gameMessageSubject = new BehaviorSubject<string>('');
  private isRollingSubject = new BehaviorSubject<boolean>(false);

  public playerState$ = this.playerStateSubject.asObservable();
  public diceResult$ = this.diceResultSubject.asObservable();
  public currentTile$ = this.currentTileSubject.asObservable();
  public gameMessage$ = this.gameMessageSubject.asObservable();
  public isRolling$ = this.isRollingSubject.asObservable();

  private board: BoardTile[] = [];

  constructor() {
    this.initializeBoard();
  }

  private initializeBoard() {
    // 40个格子的棋盘
    this.board = [
      { id: 0, type: 'go', name: '起点', color: '#48bb78' },
      { id: 1, type: 'property', name: '中山路', price: 600, rent: [20, 100, 300, 900, 1600, 2500], level: 0, color: '#8b4513' },
      { id: 2, type: 'community', name: '机会', color: '#4299e1' },
      { id: 3, type: 'property', name: '北京路', price: 600, rent: [40, 200, 600, 1800, 3200, 4500], level: 0, color: '#8b4513' },
      { id: 4, type: 'tax', name: '缴税', color: '#ed8936' },
      { id: 5, type: 'property', name: '火车站', price: 2000, rent: [250, 500, 1000, 2000], level: 0, color: '#718096' },
      { id: 6, type: 'property', name: '中华路', price: 1000, rent: [60, 300, 900, 2700, 4000, 5500], level: 0, color: '#87ceeb' },
      { id: 7, type: 'chance', name: '命运', color: '#ed8936' },
      { id: 8, type: 'property', name: '光华路', price: 1000, rent: [60, 300, 900, 2700, 4000, 5500], level: 0, color: '#87ceeb' },
      { id: 9, type: 'property', name: '沙坪坝', price: 1200, rent: [80, 400, 1000, 3000, 4500, 6000], level: 0, color: '#87ceeb' },
      { id: 10, type: 'jail', name: '监狱', color: '#718096' },
      { id: 11, type: 'property', name: '南京路', price: 1400, rent: [100, 500, 1500, 4500, 6250, 7500], level: 0, color: '#ff1493' },
      { id: 12, type: 'property', name: '电力公司', price: 1500, rent: [100, 200, 400, 800], level: 0, color: '#ffd700' },
      { id: 13, type: 'property', name: '上海路', price: 1400, rent: [100, 500, 1500, 4500, 6250, 7500], level: 0, color: '#ff1493' },
      { id: 14, type: 'property', name: '广州路', price: 1600, rent: [120, 600, 1800, 5000, 7000, 9000], level: 0, color: '#ff1493' },
      { id: 15, type: 'property', name: '机场', price: 2000, rent: [250, 500, 1000, 2000], level: 0, color: '#718096' },
      { id: 16, type: 'property', name: '天府路', price: 1800, rent: [140, 700, 2000, 5500, 7500, 9500], level: 0, color: '#ffa500' },
      { id: 17, type: 'community', name: '机会', color: '#4299e1' },
      { id: 18, type: 'property', name: '武侯祠', price: 1800, rent: [140, 700, 2000, 5500, 7500, 9500], level: 0, color: '#ffa500' },
      { id: 19, type: 'property', name: '锦里', price: 2000, rent: [160, 800, 2200, 6000, 8000, 10000], level: 0, color: '#ffa500' },
      { id: 20, type: 'parking', name: '免费停车', color: '#48bb78' },
      { id: 21, type: 'property', name: '王府井', price: 2200, rent: [180, 900, 2500, 7000, 8750, 10500], level: 0, color: '#dc143c' },
      { id: 22, type: 'chance', name: '命运', color: '#ed8936' },
      { id: 23, type: 'property', name: '西单', price: 2200, rent: [180, 900, 2500, 7000, 8750, 10500], level: 0, color: '#dc143c' },
      { id: 24, type: 'property', name: '东单', price: 2400, rent: [200, 1000, 3000, 7500, 9250, 11000], level: 0, color: '#dc143c' },
      { id: 25, type: 'property', name: '码头', price: 2000, rent: [250, 500, 1000, 2000], level: 0, color: '#718096' },
      { id: 26, type: 'property', name: '陆家嘴', price: 2600, rent: [220, 1100, 3300, 8000, 9750, 11500], level: 0, color: '#ffff00' },
      { id: 27, type: 'property', name: '外滩', price: 2600, rent: [220, 1100, 3300, 8000, 9750, 11500], level: 0, color: '#ffff00' },
      { id: 28, type: 'property', name: '自来水公司', price: 1500, rent: [100, 200, 400, 800], level: 0, color: '#ffd700' },
      { id: 29, type: 'property', name: '南京东路', price: 2800, rent: [240, 1200, 3600, 8500, 10250, 12000], level: 0, color: '#ffff00' },
      { id: 30, type: 'gotoJail', name: '去监狱', color: '#718096' },
      { id: 31, type: 'property', name: '小蛮腰', price: 3000, rent: [260, 1300, 3900, 9000, 11000, 13000], level: 0, color: '#228b22' },
      { id: 32, type: 'property', name: '珠江新城', price: 3000, rent: [260, 1300, 3900, 9000, 11000, 13000], level: 0, color: '#228b22' },
      { id: 33, type: 'community', name: '机会', color: '#4299e1' },
      { id: 34, type: 'property', name: '天河路', price: 3200, rent: [280, 1500, 4500, 10000, 12000, 14000], level: 0, color: '#228b22' },
      { id: 35, type: 'property', name: '港口', price: 2000, rent: [250, 500, 1000, 2000], level: 0, color: '#718096' },
      { id: 36, type: 'chance', name: '命运', color: '#ed8936' },
      { id: 37, type: 'property', name: '深圳湾', price: 3500, rent: [350, 1750, 5000, 11000, 13000, 15000], level: 0, color: '#00008b' },
      { id: 38, type: 'tax', name: '奢侈税', color: '#ed8936' },
      { id: 39, type: 'property', name: '香港中路', price: 4000, rent: [500, 2000, 6000, 14000, 17000, 20000], level: 0, color: '#00008b' }
    ];
  }

  getBoard(): BoardTile[] {
    return this.board;
  }

  getTile(position: number): BoardTile | null {
    return this.board[position] || null;
  }

  rollDice(): number[] {
    this.isRollingSubject.next(true);
    
    setTimeout(() => {
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      const result = [dice1, dice2];
      
      this.diceResultSubject.next(result);
      this.isRollingSubject.next(false);
      
      this.movePlayer(dice1 + dice2);
    }, 1000);

    return this.diceResultSubject.value;
  }

  movePlayer(steps: number) {
    const currentState = this.playerStateSubject.value;
    let newPosition = (currentState.position + steps) % 40;
    
    // 经过起点获得奖励
    if (newPosition < currentState.position) {
      currentState.money += 2000;
      this.setGameMessage('🎉 经过起点，获得 2000 元！');
    }

    currentState.position = newPosition;
    this.playerStateSubject.next(currentState);
    
    const tile = this.getTile(newPosition);
    this.currentTileSubject.next(tile);
    
    this.handleTileAction(tile);
  }

  private handleTileAction(tile: BoardTile | null) {
    if (!tile) return;

    switch (tile.type) {
      case 'property':
        if (!tile.owner) {
          this.setGameMessage(`💰 ${tile.name} - 价格: ${tile.price} 元`);
        } else if (tile.owner !== 'player') {
          const rent = tile.rent ? tile.rent[tile.level || 0] : 0;
          this.setGameMessage(`💸 需支付租金: ${rent} 元`);
        } else {
          this.setGameMessage(`🏠 这是您的地产: ${tile.name}`);
        }
        break;
      case 'chance':
      case 'community':
        this.handleCard();
        break;
      case 'tax':
        const tax = tile.name === '奢侈税' ? 1000 : 500;
        this.spendMoney(tax);
        this.setGameMessage(`💳 缴税: ${tax} 元`);
        break;
      case 'go':
        this.setGameMessage('🎯 起点');
        break;
      case 'jail':
        this.setGameMessage('👮 只是参观监狱');
        break;
      case 'gotoJail':
        this.goToJail();
        break;
      case 'parking':
        this.setGameMessage('🅿️ 免费停车');
        break;
    }
  }

  private handleCard() {
    const cards = [
      { message: '🎁 获得奖金 500 元', money: 500 },
      { message: '📉 支付罚款 200 元', money: -200 },
      { message: '🏆 获得奖金 1000 元', money: 1000 },
      { message: '💸 缴纳费用 300 元', money: -300 },
      { message: '🎉 获得奖金 800 元', money: 800 }
    ];

    const card = cards[Math.floor(Math.random() * cards.length)];
    this.addMoney(card.money);
    this.setGameMessage(card.message);
  }

  buyProperty(position: number): boolean {
    const tile = this.board[position];
    const currentState = this.playerStateSubject.value;

    if (tile.type !== 'property' || !tile.price) {
      return false;
    }

    if (tile.owner || currentState.money < tile.price) {
      return false;
    }

    currentState.money -= tile.price;
    currentState.properties.push(position);
    tile.owner = 'player';
    tile.level = 1;

    this.playerStateSubject.next(currentState);
    this.setGameMessage(`✅ 购买成功: ${tile.name}`);
    return true;
  }

  upgradeProperty(position: number): boolean {
    const tile = this.board[position];
    const currentState = this.playerStateSubject.value;

    if (tile.type !== 'property' || tile.owner !== 'player') {
      return false;
    }

    const level = tile.level || 1;
    if (level >= 5) {
      this.setGameMessage('🏗️ 建筑已达最高等级，可以铸造 NFT！');
      return false;
    }

    const upgradeCost = (tile.price || 0) * 0.5;
    if (currentState.money < upgradeCost) {
      return false;
    }

    currentState.money -= upgradeCost;
    tile.level = level + 1;

    this.playerStateSubject.next(currentState);
    this.setGameMessage(`⬆️ 升级成功: ${tile.name} Lv.${tile.level}`);
    return true;
  }

  addMoney(amount: number) {
    const currentState = this.playerStateSubject.value;
    currentState.money += amount;
    this.playerStateSubject.next(currentState);
  }

  spendMoney(amount: number): boolean {
    const currentState = this.playerStateSubject.value;
    if (currentState.money < amount) {
      return false;
    }
    currentState.money -= amount;
    this.playerStateSubject.next(currentState);
    return true;
  }

  private goToJail() {
    const currentState = this.playerStateSubject.value;
    currentState.position = 10;
    currentState.inJail = true;
    this.playerStateSubject.next(currentState);
    this.setGameMessage('🚔 进入监狱！');
  }

  setGameMessage(message: string) {
    this.gameMessageSubject.next(message);
  }

  getPlayerState(): PlayerState {
    return this.playerStateSubject.value;
  }

  resetGame() {
    this.playerStateSubject.next({
      position: 0,
      money: 10000,
      properties: [],
      inJail: false
    });
    this.initializeBoard();
    this.setGameMessage('🎮 游戏重置');
  }
}
