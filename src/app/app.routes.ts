import { Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { OkxWalletComponent } from './components/okx-wallet/okx-wallet.component';

export const routes: Routes = [
  {
    path: '',
    component: GameComponent,
    title: 'RichMan Web3 游戏'
  },
  {
    path: 'okx-wallet',
    component: OkxWalletComponent,
    title: 'OKX 钱包测试'
  }
];

