# ⚡ 快速启动指南

5 分钟内运行 RichMan Web3 游戏！

## 🚀 一键启动（推荐）

### Windows 用户

```powershell
# 1. 安装依赖
npm install

# 2. 启动本地区块链（新终端窗口 1）
npx hardhat node

# 3. 部署合约（新终端窗口 2）
npm run compile-contracts
npm run deploy-contracts

# 4. 启动游戏（终端窗口 2）
npm start
```

### Mac/Linux 用户

```bash
# 1. 安装依赖
npm install

# 2. 启动本地区块链（新终端 1）
npx hardhat node

# 3. 部署合约（新终端 2）
npm run compile-contracts && npm run deploy-contracts

# 4. 启动游戏（终端 2）
npm start
```

## 📱 配置 MetaMask

### 1. 安装 MetaMask
- Chrome: https://chrome.google.com/webstore/detail/metamask/
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/

### 2. 添加本地网络

打开 MetaMask → 点击网络下拉菜单 → 添加网络

```
网络名称: Hardhat Local
RPC URL: http://127.0.0.1:8545
链 ID: 1337
货币符号: ETH
```

### 3. 导入测试账户（可选）

从 Hardhat 终端复制私钥，在 MetaMask 中导入：

```
Account #0 私钥示例:
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## 🎮 开始游戏

1. 浏览器访问: http://localhost:4200
2. 点击右上角"连接钱包"
3. 在 MetaMask 中确认连接
4. 点击"🎲 掷骰子"开始游戏！

## 🎯 快速测试流程

### 测试购买地产

```
1. 掷骰子移动
2. 停在地产格（蓝色/红色/黄色格子）
3. 点击"确认购买"
4. 查看地产列表
```

### 测试升级建筑

```
1. 点击"🏠 地产操作"
2. 选择已购买的地产
3. 点击"⬆️ 升级"（需要足够金钱）
4. 重复升级到 5 级
```

### 测试 NFT 铸造

```
1. 确保建筑达到 5 级
2. 确保钱包有 0.001 ETH
3. 点击"🎨 铸造NFT"
4. 在 MetaMask 中确认交易
5. 等待交易确认（几秒钟）
```

## 🐛 常见问题

### Q: 无法连接钱包？
```
✅ 检查 MetaMask 是否已安装
✅ 检查是否在 Hardhat Local 网络
✅ 刷新页面重试
```

### Q: 合约地址未找到？
```
✅ 确保已运行 npm run deploy-contracts
✅ 检查 src/assets/contracts/ 目录是否有文件
✅ 重新部署合约
```

### Q: 交易失败？
```
✅ 检查钱包是否有足够 ETH
✅ 查看 MetaMask 错误信息
✅ 重启 Hardhat 节点
```

### Q: 页面空白？
```
✅ 检查浏览器控制台错误
✅ 确保端口 4200 未被占用
✅ 清除浏览器缓存
```

## 📦 项目结构速览

```
RichMan-Web3/
├── contracts/          # Solidity 智能合约
├── scripts/           # 部署脚本
├── test/              # 合约测试
├── src/
│   ├── app/
│   │   ├── components/   # Angular 组件
│   │   ├── services/     # 服务
│   │   └── game/         # Phaser 游戏
│   └── assets/           # 资源文件
├── package.json       # 依赖配置
└── hardhat.config.js  # Hardhat 配置
```

## 🎨 游戏功能速览

| 功能 | 说明 | 状态 |
|------|------|------|
| 🎲 掷骰子 | 移动角色 | ✅ |
| 🏠 购买地产 | 购买无主地产 | ✅ |
| ⬆️ 升级建筑 | 1-5 级升级 | ✅ |
| 🎨 铸造 NFT | 5 级建筑铸造 | ✅ |
| 💰 收取租金 | 自动计算 | ✅ |
| 🎲 特殊格子 | 机会/命运/税 | ✅ |
| 👥 多人模式 | 对战模式 | 🔜 |
| 🏆 排行榜 | 全球排名 | 🔜 |

## 📚 下一步

- 📖 阅读 [README.md](README.md) 了解完整功能
- 🎮 查看 [GAME_GUIDE.md](GAME_GUIDE.md) 学习游戏策略
- 🚀 参考 [DEPLOYMENT.md](DEPLOYMENT.md) 部署到测试网
- 🤝 阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 参与开发

## 🆘 获取帮助

- 🐛 [报告问题](https://github.com/yourusername/richman-web3/issues)
- 💬 [讨论区](https://github.com/yourusername/richman-web3/discussions)
- 📧 Email: support@richman-web3.com

## 🎉 享受游戏！

现在你已经准备好了！开始你的 Web3 地产帝国之旅吧！

**记住**：
- 💎 这是测试环境，随意实验
- 🏠 尝试不同的游戏策略
- 🎨 铸造你的第一个 NFT
- 🎮 最重要的是享受游戏！

---

**祝你游戏愉快！** 🎮✨
