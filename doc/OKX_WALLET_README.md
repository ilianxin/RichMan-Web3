# OKX 钱包集成 - 快速开始

## 🎯 概述

已成功创建 OKX 钱包测试页面，包含完整的钱包连接、签名、交易和网络切换功能。

## 📁 创建的文件

### 1. 核心服务
- **`src/app/services/okx-wallet.service.ts`** - OKX 钱包服务，处理所有钱包交互

### 2. UI 组件
- **`src/app/components/okx-wallet/okx-wallet.component.ts`** - Angular 组件，提供完整的测试界面

### 3. 独立测试页面
- **`src/okx-wallet-test.html`** - 独立的 HTML 测试页面（不依赖 Angular）

### 4. 路由配置
- **`src/app/app.routes.ts`** - 路由配置文件
- **更新 `src/app/app.component.ts`** - 添加导航菜单
- **更新 `src/main.ts`** - 集成路由

### 5. 文档
- **`OKX_WALLET_GUIDE.md`** - 详细使用指南
- **`OKX_WALLET_README.md`** - 快速开始文档（本文件）

## 🚀 快速启动

### 方式 1: Angular 应用（推荐）

```bash
# 启动开发服务器
npm start
```

然后访问：
- **主页（游戏）**: http://localhost:4200/
- **OKX 钱包测试**: http://localhost:4200/okx-wallet

### 方式 2: 独立 HTML 页面

直接在浏览器中打开 `src/okx-wallet-test.html`，或使用 HTTP 服务器：

```bash
cd src
npx http-server -p 8000
```

然后访问：http://localhost:8000/okx-wallet-test.html

## 📱 安装 OKX 钱包

访问 [https://www.okx.com/web3](https://www.okx.com/web3) 下载并安装 OKX 钱包浏览器扩展。

## ✨ 功能特性

### ✅ 钱包连接
- 检测 OKX 钱包是否安装
- 连接/断开钱包
- 自动重连已连接的钱包
- 显示钱包地址和余额

### ✅ 签名功能
- 签名自定义消息
- 显示签名结果

### ✅ 交易功能
- 发送 ETH 交易
- 显示交易哈希
- 自动更新余额

### ✅ 网络管理
- 切换到不同网络（Sepolia、主网、BSC 等）
- 显示当前网络名称和 Chain ID
- 网络变化自动刷新

### ✅ 事件监听
- 账户变化监听
- 网络变化监听
- 连接/断开事件监听

### ✅ 调试工具
- 实时调试信息显示
- JSON 格式的状态输出

## 🎨 UI 特点

- 🎯 现代化、美观的界面设计
- 📱 完全响应式，支持移动端
- 🔄 实时状态更新
- ⚡ 流畅的动画效果
- 🎨 渐变色背景和卡片设计
- 📊 清晰的信息展示

## 🧪 测试步骤

1. **安装钱包** - 确保已安装 OKX 钱包扩展
2. **启动应用** - 运行 `npm start`
3. **访问页面** - 打开 http://localhost:4200/okx-wallet
4. **连接钱包** - 点击"连接 OKX 钱包"按钮
5. **测试功能** - 依次测试签名、交易、网络切换功能

## 📖 API 使用示例

### 在其他组件中使用 OKX 钱包服务

```typescript
import { Component } from '@angular/core';
import { OkxWalletService } from './services/okx-wallet.service';

@Component({
  selector: 'app-my-component',
  template: `
    <button (click)="connect()">连接 OKX 钱包</button>
    <p *ngIf="account$ | async as account">
      地址: {{ account }}
    </p>
  `
})
export class MyComponent {
  account$ = this.okxWalletService.account$;
  
  constructor(private okxWalletService: OkxWalletService) {}
  
  async connect() {
    const account = await this.okxWalletService.connectWallet();
    if (account) {
      console.log('连接成功:', account);
    }
  }
  
  async sign() {
    const signature = await this.okxWalletService.signMessage('Hello!');
    console.log('签名:', signature);
  }
  
  async send() {
    const txHash = await this.okxWalletService.sendTransaction(
      '0x...', // 接收地址
      '0.001'  // 金额
    );
    console.log('交易哈希:', txHash);
  }
}
```

## 🔧 服务方法

### OkxWalletService 提供的方法

| 方法 | 参数 | 返回值 | 说明 |
|-----|------|-------|------|
| `connectWallet()` | - | `Promise<string \| null>` | 连接钱包，返回账户地址 |
| `disconnect()` | - | `void` | 断开钱包连接 |
| `signMessage(message)` | `string` | `Promise<string \| null>` | 签名消息 |
| `sendTransaction(to, value)` | `string, string` | `Promise<string \| null>` | 发送交易 |
| `switchNetwork(chainId)` | `number` | `Promise<boolean>` | 切换网络 |
| `isOkxWalletInstalled()` | - | `boolean` | 检查钱包是否安装 |
| `isConnected()` | - | `boolean` | 检查是否已连接 |
| `getAccount()` | - | `string \| null` | 获取当前账户 |
| `getProvider()` | - | `BrowserProvider \| null` | 获取 Provider |
| `getSigner()` | - | `Signer \| null` | 获取 Signer |

### Observable 状态

| Observable | 类型 | 说明 |
|-----------|------|------|
| `account$` | `Observable<string \| null>` | 当前账户地址 |
| `balance$` | `Observable<string>` | 账户余额 |
| `network$` | `Observable<string>` | 网络名称 |
| `connected$` | `Observable<boolean>` | 连接状态 |
| `provider$` | `Observable<BrowserProvider \| null>` | Provider 实例 |
| `signer$` | `Observable<Signer \| null>` | Signer 实例 |

## 🌐 支持的网络

- ✅ Ethereum Mainnet (Chain ID: 1)
- ✅ Goerli Testnet (Chain ID: 5)
- ✅ Sepolia Testnet (Chain ID: 11155111)
- ✅ BSC Mainnet (Chain ID: 56)
- ✅ BSC Testnet (Chain ID: 97)
- ✅ Polygon Mainnet (Chain ID: 137)
- ✅ Mumbai Testnet (Chain ID: 80001)
- ✅ Hardhat Local (Chain ID: 31337)

## ⚠️ 注意事项

1. **测试环境**: 始终在测试网络上进行测试
2. **测试账户**: 使用专门的测试账户，不要使用包含真实资产的账户
3. **Gas 费用**: 发送交易需要支付 Gas 费用
4. **安全性**: 永远不要分享私钥或助记词

## 🔗 获取测试币

- **Sepolia**: https://sepoliafaucet.com/
- **Goerli**: https://goerlifaucet.com/
- **Mumbai**: https://faucet.polygon.technology/

## 📚 更多资源

- [OKX 钱包官网](https://www.okx.com/web3)
- [详细使用指南](./OKX_WALLET_GUIDE.md)
- [Ethers.js 文档](https://docs.ethers.org/v6/)

## 🎉 完成！

现在您已经拥有一个功能完整的 OKX 钱包测试页面！您可以：

1. 🔗 连接 OKX 钱包
2. ✍️ 签名消息
3. 💸 发送交易
4. 🌐 切换网络
5. 🐛 查看调试信息

开始测试吧！🚀

