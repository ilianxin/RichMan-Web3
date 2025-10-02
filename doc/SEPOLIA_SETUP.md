# 🌐 Sepolia 测试网部署指南

## 📋 准备工作

### 1. 获取 Sepolia 测试 ETH

您需要一些测试 ETH 来支付 Gas 费用：

**Sepolia 水龙头：**
- https://sepoliafaucet.com/
- https://www.infura.io/faucet/sepolia
- https://sepolia-faucet.pk910.de/
- https://faucet.quicknode.com/ethereum/sepolia

**步骤：**
1. 访问任一水龙头网站
2. 输入您的钱包地址
3. 完成验证（可能需要登录或社交媒体验证）
4. 等待接收 0.5-1 ETH（测试币）

### 2. 获取 Infura API Key

**步骤：**
1. 访问 https://infura.io/
2. 注册账号并登录
3. 创建新项目
4. 选择 "Ethereum" 产品
5. 在项目设置中找到 "PROJECT ID"
6. 复制 PROJECT ID

**或使用 Alchemy：**
1. 访问 https://www.alchemy.com/
2. 注册并创建应用
3. 选择 "Sepolia" 测试网
4. 复制 HTTPS URL

### 3. 导出 MetaMask 私钥

⚠️ **警告：只使用测试钱包！**

**步骤：**
1. 打开 MetaMask
2. 点击右上角三个点
3. 选择"账户详情"
4. 点击"导出私钥"
5. 输入密码确认
6. 复制私钥（不要分享给任何人！）

### 4. 获取 Etherscan API Key（可选）

用于在 Etherscan 上验证合约：

1. 访问 https://etherscan.io/
2. 注册账号
3. 进入 https://etherscan.io/myapikey
4. 创建新的 API Key
5. 复制 API Key

## ⚙️ 配置项目

### 1. 创建 .env 文件

在项目根目录创建 `.env` 文件：

```bash
# 在项目根目录执行
# Windows PowerShell:
New-Item .env -ItemType File

# Mac/Linux:
touch .env
```

### 2. 填写配置

编辑 `.env` 文件，填入以下内容：

```env
# Sepolia RPC URL（使用 Infura）
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# 或使用 Alchemy
# SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

# 您的钱包私钥
PRIVATE_KEY=your_private_key_here

# Etherscan API Key（可选）
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**示例（请替换为您的实际配置）：**
```env
SEPOLIA_URL=https://sepolia.infura.io/v3/abc123def456ghi789
PRIVATE_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
ETHERSCAN_API_KEY=ABC123DEF456GHI789
```

### 3. 验证配置

确保 `.env` 文件：
- ✅ 在项目根目录
- ✅ 已填入正确的配置
- ✅ 已添加到 `.gitignore`（自动配置）

## 🚀 部署到 Sepolia

### 1. 安装依赖

```bash
npm install
```

### 2. 编译合约

```bash
npm run compile-contracts
```

### 3. 部署到 Sepolia

```bash
npm run deploy-sepolia
```

**预期输出：**
```
Deploying RichManGame contract...
RichManGame deployed to: 0x1234567890abcdef1234567890abcdef12345678
Contract address and ABI saved to src/assets/contracts/
```

### 4. 记录合约地址

部署成功后，合约地址会自动保存到：
- `src/assets/contracts/contract-address.json`

**重要：请保存这个地址！**

### 5. 验证合约（可选）

在 Etherscan 上验证合约源码：

```bash
npm run verify-sepolia 0xYOUR_CONTRACT_ADDRESS
```

## 🔧 配置 MetaMask

### 1. 切换到 Sepolia 网络

MetaMask 中：
1. 点击网络下拉菜单
2. 选择"Sepolia 测试网络"

如果看不到 Sepolia：
1. 点击"显示测试网络"
2. 在设置中启用"显示测试网络"

### 2. 确认余额

确保账户中有测试 ETH（至少 0.05 ETH）

## 🎮 启动游戏

### 1. 启动前端

```bash
npm start
```

### 2. 访问游戏

浏览器打开：http://localhost:4200

### 3. 连接钱包

1. 点击右上角"连接钱包"
2. 在 MetaMask 中确认连接
3. 确保切换到 Sepolia 网络
4. 开始游戏！

## 📊 预估费用

Sepolia 测试网部署成本（测试币）：

| 操作 | Gas | 费用估算 |
|------|-----|----------|
| 部署合约 | ~2,000,000 | ~0.002 ETH |
| 购买地产 | ~80,000 | ~0.00008 ETH |
| 升级建筑 | ~60,000 | ~0.00006 ETH |
| 铸造 NFT | ~150,000 | 0.001 ETH（铸造费）+ Gas |
| 支付租金 | ~50,000 | ~0.00005 ETH |

**建议：准备至少 0.5 ETH 测试币**

## 🔍 查看合约

部署后，您可以在 Sepolia Etherscan 查看：

https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS

## ⚠️ 常见问题

### Q: 部署时提示 "insufficient funds"？
**A:** 确保钱包中有足够的 Sepolia ETH。访问水龙头获取测试币。

### Q: 部署失败 "nonce too low"？
**A:** 重置 MetaMask 账户：设置 -> 高级 -> 重置账户

### Q: 连接钱包后无法交互？
**A:** 确认 MetaMask 已切换到 Sepolia 网络。

### Q: 交易一直 pending？
**A:** Sepolia 有时会比较拥堵，耐心等待或增加 Gas 费用。

### Q: 如何查看交易状态？
**A:** 在 MetaMask 中点击交易，或访问 https://sepolia.etherscan.io/

## 📝 部署检查清单

- [ ] 获取 Sepolia 测试 ETH
- [ ] 获取 Infura/Alchemy API Key
- [ ] 创建并配置 .env 文件
- [ ] 安装项目依赖
- [ ] 编译智能合约
- [ ] 部署到 Sepolia
- [ ] 记录合约地址
- [ ] 验证合约（可选）
- [ ] 配置 MetaMask 到 Sepolia
- [ ] 测试游戏功能

## 🎉 成功部署后

您的游戏现在运行在 Sepolia 测试网上！

**可以做什么：**
- ✅ 分享合约地址给朋友
- ✅ 邀请他人一起玩
- ✅ 在 Etherscan 查看所有交易
- ✅ 铸造的 NFT 在 OpenSea Testnet 可见
- ✅ 测试所有 Web3 功能

**OpenSea Testnet：**
https://testnets.opensea.io/assets/sepolia/YOUR_CONTRACT_ADDRESS/TOKEN_ID

## 🔐 安全提醒

1. ⚠️ **永远不要**将真实资产的私钥放入 .env
2. ⚠️ **永远不要**将 .env 文件提交到 Git
3. ⚠️ **永远不要**分享您的私钥
4. ✅ 使用专门的测试钱包
5. ✅ 定期检查 .gitignore 配置

## 📞 需要帮助？

- 📖 查看 [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 提交 [Issue](https://github.com/ilianxin/RichMan-Web3/issues)
- 💬 加入讨论

---

**祝您部署顺利！** 🚀✨

