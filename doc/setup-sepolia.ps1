# Sepolia 测试网配置脚本 (PowerShell)

Write-Host "🌐 RichMan Web3 - Sepolia 测试网配置向导" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 .env 文件是否存在
if (Test-Path .env) {
    Write-Host "⚠️  .env 文件已存在" -ForegroundColor Yellow
    $confirm = Read-Host "是否覆盖现有配置？(y/n)"
    if ($confirm -ne "y") {
        Write-Host "已取消配置" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "请提供以下信息：" -ForegroundColor Green
Write-Host ""

# 获取 Infura Project ID 或 RPC URL
$rpcInput = Read-Host "1️⃣  Infura Project ID (或完整的 RPC URL)"

if ($rpcInput.StartsWith("http")) {
    $sepoliaUrl = $rpcInput
} else {
    $sepoliaUrl = "https://sepolia.infura.io/v3/$rpcInput"
}

# 获取私钥
Write-Host ""
$privateKeySecure = Read-Host "2️⃣  钱包私钥 (输入时不会显示)" -AsSecureString
$privateKey = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($privateKeySecure))

# 移除 0x 前缀（如果有）
$privateKey = $privateKey -replace '^0x', ''

# 获取 Etherscan API Key（可选）
Write-Host ""
$etherscanKey = Read-Host "3️⃣  Etherscan API Key (可选，按回车跳过)"

# 创建 .env 文件
$envContent = @"
# Sepolia Testnet Configuration
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# Sepolia RPC URL
SEPOLIA_URL=$sepoliaUrl

# Wallet Private Key
PRIVATE_KEY=$privateKey

# Etherscan API Key (optional)
ETHERSCAN_API_KEY=$etherscanKey

# ========================================
# ⚠️  重要提醒：
# - 不要将此文件提交到 Git
# - 只使用测试钱包
# - 不要分享私钥
# ========================================
"@

$envContent | Out-File -FilePath .env -Encoding utf8

Write-Host ""
Write-Host "✅ 配置完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📁 .env 文件已创建" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 下一步：" -ForegroundColor Yellow
Write-Host "   1. 获取 Sepolia 测试 ETH: https://sepoliafaucet.com/"
Write-Host "   2. 编译合约: npm run compile-contracts"
Write-Host "   3. 部署合约: npm run deploy-sepolia"
Write-Host ""
Write-Host "📖 详细说明请查看: SEPOLIA_SETUP.md" -ForegroundColor Cyan
Write-Host ""

# 清理敏感信息
$privateKey = $null
$privateKeySecure = $null

