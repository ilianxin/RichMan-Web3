# 🎮 RichMan Web3 - 区块链大富翁游戏

一个基于 Web3 技术的 H5 大富翁游戏，支持建筑升级和 NFT 铸造。

![Game Preview](https://img.shields.io/badge/Status-Beta-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Solidity](https://img.shields.io/badge/Solidity-0.8.19-purple)

## 🌟 核心特性

### 游戏玩法
- 🎲 **经典大富翁机制** - 掷骰子移动、购买土地、收取租金
- 🏠 **40个地产格子** - 包含多个城市地标和特殊格子
- 💰 **经济系统** - 完整的货币系统，支付、收取、奖励机制
- 🎯 **特殊格子** - 机会、命运、缴税、监狱等经典元素

### Web3 集成
- 🔗 **MetaMask 钱包连接** - 支持主流以太坊钱包
- 📜 **ERC-1155 智能合约** - 基于 OpenZeppelin 标准实现
- 🎨 **NFT 铸造** - 建筑升级到 5 级可铸造为 NFT
- ⛓️ **区块链交互** - 地产购买、升级、租金支付上链

### 技术架构
- ⚡ **Angular 17** - 现代化前端框架
- 🎮 **Phaser.js 3** - 强大的 H5 游戏引擎
- 🔐 **Solidity 0.8.19** - 安全的智能合约
- 🛠️ **Hardhat** - 专业的以太坊开发环境
- 🎨 **像素风格** - 复古游戏美术风格

## 📁 项目结构

```
RichMan-Web3/
├── contracts/              # 智能合约
│   └── RichManGame.sol    # ERC-1155 NFT 合约
├── scripts/               # 部署脚本
│   └── deploy.js         # 合约部署脚本
├── src/
│   ├── app/
│   │   ├── components/   # Angular 组件
│   │   │   ├── game/    # 游戏主组件
│   │   │   └── wallet/  # 钱包连接组件
│   │   ├── services/    # 服务层
│   │   │   ├── web3.service.ts        # Web3 交互
│   │   │   └── game-state.service.ts  # 游戏状态管理
│   │   └── game/
│   │       └── scenes/  # Phaser 场景
│   │           └── MainScene.ts  # 主游戏场景
│   ├── assets/          # 游戏资源
│   │   ├── contracts/  # 合约 ABI
│   │   └── game-assets.json  # 游戏资源配置
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── package.json
├── tsconfig.json
├── angular.json
├── hardhat.config.js
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.x
- npm >= 9.x
- MetaMask 钱包扩展

### 安装依赖

```bash
# 安装项目依赖
npm install
```

### 启动本地区块链

```bash
# 启动 Hardhat 本地节点（新终端窗口）
npx hardhat node
```

### 部署智能合约

```bash
# 编译合约
npm run compile-contracts

# 部署到本地网络
npm run deploy-contracts
```

**重要：** 部署成功后，合约地址和 ABI 会自动保存到 `src/assets/contracts/` 目录。

### 配置 MetaMask

1. 添加 Hardhat 本地网络：
   - 网络名称：Hardhat Local
   - RPC URL：http://127.0.0.1:8545
   - 链 ID：1337
   - 货币符号：ETH

2. 导入测试账户（可选）：
   - Hardhat 启动时会显示 10 个测试账户的私钥
   - 选择任意一个导入到 MetaMask

### 启动前端应用

```bash
# 开发模式启动
npm start

# 浏览器访问
http://localhost:4200
```

### 同时启动（推荐）

```bash
# 同时启动区块链和前端
npm run dev
```

## 🎯 游戏规则

### 基础玩法

1. **开始游戏**
   - 初始资金：10,000 元
   - 起始位置：格子 0（起点）

2. **掷骰子移动**
   - 点击"掷骰子"按钮
   - 根据点数前进相应格数
   - 经过或停在起点获得 2,000 元奖励

3. **购买地产**
   - 停在无主地产格可以购买
   - 支付相应价格即可获得所有权
   - 其他玩家停留需支付租金

4. **升级建筑**
   - 拥有的地产可以升级（1-5 级）
   - 每次升级费用为地产价格的 50%
   - 等级越高，租金越高

5. **铸造 NFT**
   - 建筑升级到 5 级后可铸造为 NFT
   - 需要连接 MetaMask 钱包
   - 支付 0.001 ETH 铸造费用
   - 铸造的 NFT 符合 ERC-1155 标准

### 特殊格子

- 🎯 **起点（Go）**：经过获得 2,000 元
- 🎲 **机会/命运**：随机事件（获得或支付金钱）
- 💳 **缴税**：支付 500 元税款
- 💸 **奢侈税**：支付 1,000 元税款
- 🚔 **去监狱**：直接移动到监狱格
- 👮 **监狱**：仅参观，不受惩罚
- 🅿️ **免费停车**：休息，无事发生

### 租金计算

租金根据建筑等级递增：

| 等级 | 租金倍数 |
|------|----------|
| 1级  | 基础租金 |
| 2级  | 2倍      |
| 3级  | 4倍      |
| 4级  | 8倍      |
| 5级  | 16倍     |

基础租金 = 地产价格 × 0.01

## 🔧 智能合约功能

### 主要方法

```solidity
// 购买建筑
function purchaseBuilding(uint8 position) external

// 升级建筑
function upgradeBuilding(uint8 position) external

// 铸造 NFT（需支付 0.001 ETH）
function mintBuildingNFT(uint8 position) external payable

// 支付租金
function payRent(uint8 position) external payable

// 查询建筑信息
function getBuilding(uint8 position) external view returns (Building memory)

// 计算租金
function calculateRent(uint8 position) public view returns (uint256)
```

### 事件

```solidity
event BuildingPurchased(address indexed player, uint8 position, uint8 level);
event BuildingUpgraded(address indexed player, uint8 position, uint8 newLevel);
event BuildingMinted(address indexed player, uint256 tokenId, uint8 position);
event RentPaid(address indexed from, address indexed to, uint256 amount, uint8 position);
```

## 🛠️ 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 运行测试
npm test

# 编译智能合约
npm run compile-contracts

# 部署合约到本地网络
npm run deploy-contracts

# 启动 Hardhat 节点
npx hardhat node

# 同时启动区块链和前端
npm run dev
```

## 🌐 部署到测试网

### 配置环境变量

创建 `.env` 文件：

```env
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
```

### 部署到 Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 更新前端配置

将部署后的合约地址更新到 `src/assets/contracts/contract-address.json`

## 📱 游戏截图

### 主游戏界面
- 40 格棋盘布局
- 实时游戏状态显示
- 骰子动画效果

### 地产管理
- 地产列表查看
- 一键升级建筑
- NFT 铸造功能

### 钱包连接
- MetaMask 集成
- 余额实时显示
- 交易状态反馈

## 🔐 安全性

- ✅ 使用 OpenZeppelin 经过审计的合约库
- ✅ 所有权验证和访问控制
- ✅ 防重入攻击保护
- ✅ 合理的 Gas 优化
- ✅ 事件日志完整记录

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 待办事项

- [ ] 添加多人游戏模式
- [ ] 实现更多特殊卡片
- [ ] 增加音效和背景音乐
- [ ] 优化移动端体验
- [ ] 添加游戏回放功能
- [ ] 实现 NFT 交易市场
- [ ] 支持更多钱包（WalletConnect）
- [ ] 添加游戏排行榜

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 👥 联系方式

- 项目主页：[GitHub Repository](https://github.com/yourusername/richman-web3)
- 问题反馈：[Issues](https://github.com/yourusername/richman-web3/issues)

## 🙏 致谢

- [OpenZeppelin](https://openzeppelin.com/) - 智能合约库
- [Phaser.js](https://phaser.io/) - 游戏引擎
- [Angular](https://angular.io/) - 前端框架
- [Hardhat](https://hardhat.org/) - 以太坊开发环境
- [Ethers.js](https://ethers.org/) - 以太坊库

---

⭐ 如果这个项目对你有帮助，请给个 Star！

🎮 开始游戏，体验 Web3 大富翁的乐趣！
