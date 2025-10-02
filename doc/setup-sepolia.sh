#!/bin/bash

# Sepolia 测试网配置脚本

echo "🌐 RichMan Web3 - Sepolia 测试网配置向导"
echo "=========================================="
echo ""

# 检查 .env 文件是否存在
if [ -f .env ]; then
    echo "⚠️  .env 文件已存在"
    read -p "是否覆盖现有配置？(y/n): " confirm
    if [ "$confirm" != "y" ]; then
        echo "已取消配置"
        exit 0
    fi
fi

echo ""
echo "请提供以下信息："
echo ""

# 获取 Infura Project ID
read -p "1️⃣  Infura Project ID (或完整的 RPC URL): " rpc_input

if [[ $rpc_input == http* ]]; then
    SEPOLIA_URL=$rpc_input
else
    SEPOLIA_URL="https://sepolia.infura.io/v3/$rpc_input"
fi

# 获取私钥
echo ""
read -sp "2️⃣  钱包私钥 (不会显示): " private_key
echo ""

# 移除 0x 前缀（如果有）
private_key=${private_key#0x}

# 获取 Etherscan API Key（可选）
echo ""
read -p "3️⃣  Etherscan API Key (可选，按回车跳过): " etherscan_key

# 创建 .env 文件
cat > .env << EOF
# Sepolia Testnet Configuration
# Generated: $(date)

# Sepolia RPC URL
SEPOLIA_URL=$SEPOLIA_URL

# Wallet Private Key
PRIVATE_KEY=$private_key

# Etherscan API Key (optional)
ETHERSCAN_API_KEY=$etherscan_key

# ========================================
# ⚠️  重要提醒：
# - 不要将此文件提交到 Git
# - 只使用测试钱包
# - 不要分享私钥
# ========================================
EOF

echo ""
echo "✅ 配置完成！"
echo ""
echo "📁 .env 文件已创建"
echo ""
echo "🚀 下一步："
echo "   1. 获取 Sepolia 测试 ETH: https://sepoliafaucet.com/"
echo "   2. 编译合约: npm run compile-contracts"
echo "   3. 部署合约: npm run deploy-sepolia"
echo ""
echo "📖 详细说明请查看: SEPOLIA_SETUP.md"
echo ""

