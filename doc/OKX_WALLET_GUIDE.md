# OKX 钱包测试指南

本指南将帮助您测试项目中的 OKX 钱包集成功能。

## 📋 目录

- [安装 OKX 钱包](#安装-okx-钱包)
- [启动测试页面](#启动测试页面)
- [功能测试](#功能测试)
- [常见问题](#常见问题)

## 🔧 安装 OKX 钱包

### 方法 1: 浏览器扩展（推荐）

1. 访问 [OKX 钱包官网](https://www.okx.com/web3)
2. 下载适合您浏览器的扩展：
   - Chrome/Edge: [Chrome Web Store](https://chrome.google.com/webstore)
   - Firefox: [Firefox Add-ons](https://addons.mozilla.org/)
3. 安装扩展后，创建新钱包或导入现有钱包
4. 确保切换到测试网络（如 Sepolia）

### 方法 2: 移动端 App

1. 在应用商店搜索 "OKX"
2. 下载并安装 OKX 应用
3. 创建或导入钱包
4. 使用 WalletConnect 连接到 DApp

## 🚀 启动测试页面

### Angular 集成版本

启动开发服务器并访问 OKX 钱包测试页面：

```bash
# 启动开发服务器
npm start

# 或
ng serve
```

然后在浏览器中访问：
- **主页（游戏）**: http://localhost:4200/
- **OKX 钱包测试**: http://localhost:4200/okx-wallet

### 独立 HTML 版本

也可以直接打开独立的 HTML 测试页面：

```bash
# 使用任意 HTTP 服务器
# 例如使用 Python:
cd src
python -m http.server 8000

# 或使用 Node.js:
npx http-server src -p 8000
```

然后访问：http://localhost:8000/okx-wallet-test.html

## 🧪 功能测试

### 1. 连接钱包

1. 点击 **"🔗 连接 OKX 钱包"** 按钮
2. OKX 钱包弹窗将会出现
3. 选择要连接的账户
4. 点击 **"连接"** 授权 DApp 访问您的钱包

**预期结果**：
- 页面显示您的钱包地址（缩写形式）
- 显示账户余额（ETH）
- 显示当前网络名称和 Chain ID

### 2. 签名消息测试

测试钱包的签名功能：

1. 在 **"📝 签名消息"** 部分
2. 输入要签名的消息（默认："Hello OKX Wallet!"）
3. 点击 **"签名"** 按钮
4. 在 OKX 钱包弹窗中确认签名

**预期结果**：
- 显示签名结果（一个 132 字符的十六进制字符串）
- 格式：`0x...`

### 3. 发送交易测试

⚠️ **警告**：这将消耗真实的 Gas 费用！请在测试网络上进行。

1. 在 **"💸 发送交易"** 部分
2. 输入接收地址（有效的以太坊地址）
3. 输入金额（ETH，例如：0.001）
4. 点击 **"发送"** 按钮
5. 在确认对话框中点击 **"确定"**
6. 在 OKX 钱包中确认交易

**预期结果**：
- 显示交易哈希
- 交易被发送到区块链
- 账户余额更新

**测试网水龙头**：
- Sepolia: https://sepoliafaucet.com/
- Goerli: https://goerlifaucet.com/

### 4. 切换网络测试

测试网络切换功能：

1. 在 **"🌐 切换网络"** 部分
2. 点击任一网络按钮：
   - **Sepolia 测试网** (Chain ID: 11155111)
   - **以太坊主网** (Chain ID: 1) - ⚠️ 谨慎使用
   - **BSC 主网** (Chain ID: 56)
3. 在 OKX 钱包中确认网络切换

**预期结果**：
- 网络成功切换
- 页面自动更新显示新的网络信息
- Chain ID 更新

### 5. 调试信息

在 **"🐛 调试信息"** 部分，您可以看到：

```json
{
  "account": "0x...",
  "balance": "0.5000 ETH",
  "network": "Sepolia",
  "chainId": 11155111,
  "timestamp": "2025-10-02T..."
}
```

## 📝 代码结构

### 服务文件

**`src/app/services/okx-wallet.service.ts`**

OKX 钱包服务提供以下功能：

```typescript
// 连接钱包
connectWallet(): Promise<string | null>

// 断开连接
disconnect(): void

// 签名消息
signMessage(message: string): Promise<string | null>

// 发送交易
sendTransaction(to: string, value: string): Promise<string | null>

// 切换网络
switchNetwork(chainId: number): Promise<boolean>

// 检查是否已安装
isOkxWalletInstalled(): boolean
```

### 组件文件

**`src/app/components/okx-wallet/okx-wallet.component.ts`**

OKX 钱包组件提供完整的 UI 界面，包括：
- 连接/断开钱包
- 账户信息显示
- 功能测试面板
- 调试信息显示

## 🔍 常见问题

### Q1: 未检测到 OKX 钱包

**解决方案**：
1. 确认已安装 OKX 钱包浏览器扩展
2. 刷新页面
3. 检查扩展是否已启用
4. 尝试重启浏览器

### Q2: 连接失败

**可能原因**：
- 用户拒绝了连接请求
- OKX 钱包被锁定
- 网络连接问题

**解决方案**：
1. 确保 OKX 钱包已解锁
2. 检查网络连接
3. 重新点击连接按钮

### Q3: 交易失败

**可能原因**：
- 余额不足
- Gas 费用不足
- 网络拥堵
- 用户取消交易

**解决方案**：
1. 检查账户余额
2. 确保有足够的 Gas 费用
3. 在测试网上获取测试币
4. 稍后重试

### Q4: 签名失败

**可能原因**：
- 用户拒绝签名
- 消息格式错误

**解决方案**：
1. 确认消息内容
2. 在钱包中仔细查看签名请求
3. 重新尝试签名

### Q5: 网络切换失败

**可能原因**：
- 网络不存在于钱包中
- 用户拒绝切换

**解决方案**：
1. 确认网络 Chain ID 正确
2. 如果网络不存在，需要先手动添加
3. 重新尝试切换

## 🌐 支持的网络

| 网络名称 | Chain ID | 类型 |
|---------|----------|------|
| Ethereum Mainnet | 1 | 主网 |
| Goerli | 5 | 测试网 |
| Sepolia | 11155111 | 测试网 |
| BSC Mainnet | 56 | 主网 |
| BSC Testnet | 97 | 测试网 |
| Polygon | 137 | 主网 |
| Mumbai | 80001 | 测试网 |
| Hardhat Local | 31337 | 本地 |

## 🔐 安全提示

1. ⚠️ **永远不要**在主网上使用测试钱包
2. ⚠️ **永远不要**分享您的私钥或助记词
3. ✅ 始终在测试网上进行测试
4. ✅ 使用专门的测试账户
5. ✅ 仔细验证交易详情后再确认
6. ✅ 保持 OKX 钱包和浏览器为最新版本

## 📚 相关资源

- [OKX 钱包官网](https://www.okx.com/web3)
- [OKX 钱包开发文档](https://www.okx.com/web3/build/docs/sdks/introduction)
- [Ethers.js 文档](https://docs.ethers.org/v6/)
- [Sepolia 测试网水龙头](https://sepoliafaucet.com/)
- [Ethereum 开发文档](https://ethereum.org/en/developers/docs/)

## 🐛 报告问题

如果您遇到任何问题或 bug，请：

1. 查看浏览器控制台的错误信息
2. 检查 OKX 钱包的状态
3. 确认网络连接正常
4. 记录复现步骤
5. 提交 Issue 或联系开发团队

## 📄 许可证

MIT License

---

**祝您测试愉快！** 🎉

