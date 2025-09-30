# 🚀 RichMan Web3 部署指南

本文档详细说明如何部署 RichMan Web3 游戏到不同环境。

## 📋 目录

- [本地开发部署](#本地开发部署)
- [测试网部署](#测试网部署)
- [生产环境部署](#生产环境部署)
- [故障排查](#故障排查)

## 本地开发部署

### 1. 环境准备

确保已安装：
- Node.js >= 18.x
- npm >= 9.x
- Git

### 2. 克隆项目

```bash
git clone https://github.com/yourusername/richman-web3.git
cd richman-web3
```

### 3. 安装依赖

```bash
npm install
```

### 4. 启动本地区块链

打开第一个终端：

```bash
npx hardhat node
```

你会看到类似输出：

```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
```

保持此终端运行。

### 5. 部署智能合约

打开第二个终端：

```bash
# 编译合约
npm run compile-contracts

# 部署到本地网络
npm run deploy-contracts
```

成功后会显示：

```
Deploying RichManGame contract...
RichManGame deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract address and ABI saved to src/assets/contracts/
```

### 6. 配置 MetaMask

1. 打开 MetaMask，点击网络下拉菜单
2. 选择"添加网络" -> "手动添加网络"
3. 填入以下信息：
   - 网络名称：`Hardhat Local`
   - RPC URL：`http://127.0.0.1:8545`
   - 链 ID：`1337`
   - 货币符号：`ETH`
4. 点击"保存"

### 7. 导入测试账户（可选）

从 Hardhat 节点输出中复制任意账户的私钥，在 MetaMask 中：

1. 点击账户图标
2. 选择"导入账户"
3. 粘贴私钥
4. 点击"导入"

### 8. 启动前端

在第三个终端（或使用 Ctrl+C 停止第二个终端后）：

```bash
npm start
```

### 9. 访问游戏

打开浏览器访问：`http://localhost:4200`

点击"连接钱包"按钮，在 MetaMask 中确认连接。

---

## 测试网部署

### 1. 获取测试网 ETH

#### Sepolia 测试网

访问以下水龙头获取测试 ETH：
- https://sepoliafaucet.com/
- https://www.infura.io/faucet/sepolia

### 2. 获取 Infura API Key

1. 访问 https://infura.io/
2. 注册并创建新项目
3. 复制 Project ID

### 3. 配置环境变量

创建 `.env` 文件（根目录）：

```env
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
```

⚠️ **安全警告**：
- 不要将 `.env` 文件提交到 Git
- 不要使用包含真实资产的钱包私钥
- 仅用于测试的钱包

### 4. 部署到 Sepolia

```bash
# 编译合约
npm run compile-contracts

# 部署到 Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

成功后记录合约地址。

### 5. 验证合约（可选）

获取 Etherscan API Key：https://etherscan.io/myapikey

添加到 `.env`：

```env
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

验证合约：

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### 6. 更新前端配置

编辑 `src/assets/contracts/contract-address.json`：

```json
{
  "RichManGame": "YOUR_DEPLOYED_CONTRACT_ADDRESS"
}
```

### 7. 配置 MetaMask

1. 在 MetaMask 中切换到 Sepolia 测试网
2. 确保有足够的测试 ETH

### 8. 构建并部署前端

```bash
# 构建生产版本
npm run build

# 输出在 dist/richman-web3 目录
```

可以部署到：
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

---

## 生产环境部署

### 1. 主网部署准备

⚠️ **重要提示**：
- 主网部署需要真实 ETH（用于 Gas 费用）
- 建议先进行完整的安全审计
- 测试所有功能
- 准备应急方案

### 2. 安全检查清单

- [ ] 智能合约安全审计
- [ ] 单元测试覆盖率 > 90%
- [ ] 前端安全扫描
- [ ] 依赖包漏洞扫描
- [ ] 私钥安全管理
- [ ] 备份合约代码
- [ ] 准备升级方案

### 3. 配置主网

`.env` 文件：

```env
MAINNET_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

`hardhat.config.js` 添加主网配置：

```javascript
mainnet: {
  url: process.env.MAINNET_URL || "",
  accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
  gasPrice: "auto"
}
```

### 4. 部署到主网

```bash
# 再次确认所有配置
npm run compile-contracts

# 部署（需要真实 ETH 支付 Gas）
npx hardhat run scripts/deploy.js --network mainnet
```

### 5. 验证主网合约

```bash
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS
```

### 6. 前端生产构建

```bash
# 生产构建
npm run build -- --configuration production

# 优化构建大小
npm run build -- --configuration production --optimization
```

### 7. CDN 部署

推荐使用：
- **Vercel**（推荐）：
  ```bash
  npm install -g vercel
  vercel --prod
  ```

- **Netlify**：
  ```bash
  npm install -g netlify-cli
  netlify deploy --prod --dir=dist/richman-web3
  ```

- **AWS S3 + CloudFront**：
  - 上传 `dist/richman-web3` 到 S3 存储桶
  - 配置 CloudFront 分发
  - 设置 HTTPS 证书

### 8. 域名配置

1. 购买域名（如：richman-web3.com）
2. 配置 DNS 记录指向部署平台
3. 启用 HTTPS（Let's Encrypt）
4. 配置 CDN 加速

---

## 故障排查

### 问题 1：合约部署失败

**错误**：`Error: insufficient funds for intrinsic transaction cost`

**解决**：
- 确保钱包有足够 ETH 支付 Gas
- 检查网络配置是否正确

### 问题 2：MetaMask 连接失败

**错误**：`Please install MetaMask`

**解决**：
- 确保已安装 MetaMask 扩展
- 刷新页面重试
- 检查浏览器控制台错误信息

### 问题 3：合约地址未找到

**错误**：`Failed to load contract info`

**解决**：
- 确保已部署合约
- 检查 `src/assets/contracts/contract-address.json` 文件存在
- 验证合约地址正确

### 问题 4：交易失败

**错误**：`Transaction reverted`

**解决**：
- 检查 Gas 限制
- 确保账户有足够 ETH
- 查看具体错误消息
- 检查合约方法调用参数

### 问题 5：前端无法连接合约

**错误**：`Contract not initialized`

**解决**：
1. 检查网络是否匹配（本地/测试网/主网）
2. 确认 MetaMask 已连接正确网络
3. 重新部署合约或更新合约地址
4. 清除浏览器缓存重试

### 问题 6：编译错误

**错误**：`Solidity compilation errors`

**解决**：
```bash
# 清除缓存
rm -rf cache artifacts

# 重新安装依赖
rm -rf node_modules
npm install

# 重新编译
npm run compile-contracts
```

### 问题 7：Phaser 游戏无法显示

**解决**：
- 检查浏览器控制台错误
- 确保 Phaser 正确加载
- 检查游戏容器尺寸
- 验证资源加载路径

---

## 性能优化

### 前端优化

1. **代码分割**：
   ```typescript
   // 懒加载路由
   const routes = [
     { path: 'game', loadChildren: () => import('./game/game.module') }
   ];
   ```

2. **图片优化**：
   - 使用 WebP 格式
   - 压缩图片资源
   - 实现懒加载

3. **缓存策略**：
   - 配置 Service Worker
   - 启用浏览器缓存
   - 使用 CDN

### 合约优化

1. **Gas 优化**：
   - 使用 `calldata` 而非 `memory`
   - 合理使用 `view` 和 `pure`
   - 优化存储布局

2. **批量操作**：
   - 实现批量购买
   - 批量升级功能

---

## 监控与维护

### 1. 合约事件监听

```javascript
// 监听 NFT 铸造事件
contract.on("BuildingMinted", (player, tokenId, position) => {
  console.log(`NFT Minted: ${tokenId} at position ${position} by ${player}`);
});
```

### 2. 错误追踪

集成 Sentry：

```bash
npm install @sentry/angular
```

### 3. 分析工具

- Google Analytics
- Mixpanel
- Etherscan 交易监控

---

## 备份与恢复

### 1. 合约代码备份

```bash
# 备份整个项目
tar -czf richman-web3-backup-$(date +%Y%m%d).tar.gz .

# 仅备份合约和脚本
tar -czf contracts-backup.tar.gz contracts scripts
```

### 2. 数据备份

- 定期导出区块链数据
- 备份用户 NFT 信息
- 保存部署记录

---

## 支持

遇到问题？

- 📖 查看 [README.md](README.md)
- 🐛 提交 [Issue](https://github.com/yourusername/richman-web3/issues)
- 💬 加入社区讨论

---

**祝部署顺利！🎉**
