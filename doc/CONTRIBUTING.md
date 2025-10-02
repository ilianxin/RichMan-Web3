# 🤝 贡献指南

感谢你对 RichMan Web3 项目的关注！我们欢迎任何形式的贡献。

## 📋 贡献方式

### 1. 报告 Bug

发现问题？请 [创建 Issue](https://github.com/yourusername/richman-web3/issues/new)，并包含：

- 📝 清晰的问题描述
- 🔄 重现步骤
- 💻 你的环境信息（浏览器、操作系统等）
- 📸 截图或错误信息

### 2. 提出新功能

有好想法？请：

1. 先搜索是否已有相关 Issue
2. 创建新 Issue，标题以 `[Feature Request]` 开头
3. 详细描述功能和使用场景
4. 等待社区讨论

### 3. 提交代码

#### 开发流程

1. **Fork 项目**
   ```bash
   # 点击 GitHub 页面的 Fork 按钮
   ```

2. **克隆到本地**
   ```bash
   git clone https://github.com/YOUR_USERNAME/richman-web3.git
   cd richman-web3
   ```

3. **创建特性分支**
   ```bash
   git checkout -b feature/amazing-feature
   # 或
   git checkout -b fix/bug-description
   ```

4. **安装依赖**
   ```bash
   npm install
   ```

5. **开发和测试**
   ```bash
   # 启动开发环境
   npm start
   
   # 运行测试
   npm test
   
   # 编译合约
   npm run compile-contracts
   ```

6. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

7. **推送到 GitHub**
   ```bash
   git push origin feature/amazing-feature
   ```

8. **创建 Pull Request**
   - 访问你的 Fork 页面
   - 点击 "New Pull Request"
   - 填写 PR 描述
   - 等待审核

## 📝 代码规范

### Commit 信息格式

使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：
```
feat(game): add multiplayer support

- Implement WebSocket connection
- Add player synchronization
- Update UI for multiple players

Closes #123
```

### TypeScript/Angular 规范

- 使用 TypeScript 严格模式
- 遵循 Angular 风格指南
- 变量使用 camelCase
- 类使用 PascalCase
- 常量使用 UPPER_SNAKE_CASE
- 接口名以 `I` 开头或使用 `type`

示例：
```typescript
// Good
export interface PlayerState {
  position: number;
  money: number;
}

export class GameStateService {
  private readonly MAX_PLAYERS = 4;
  
  getPlayerState(): PlayerState {
    // ...
  }
}
```

### Solidity 规范

- 使用 Solidity 0.8.19
- 遵循 [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- 函数顺序：constructor -> external -> public -> internal -> private
- 添加 NatSpec 注释
- 使用 OpenZeppelin 库

示例：
```solidity
/**
 * @dev Purchase a building at a specific position
 * @param position The position on the board (0-39)
 */
function purchaseBuilding(uint8 position) external {
    require(buildings[position].owner == address(0), "Building already owned");
    // ...
}
```

### 测试要求

- 新功能必须包含测试
- 测试覆盖率 > 80%
- 智能合约测试覆盖所有功能

```typescript
// Angular 测试示例
describe('GameStateService', () => {
  it('should roll dice correctly', () => {
    const result = service.rollDice();
    expect(result.length).toBe(2);
    expect(result[0]).toBeGreaterThanOrEqual(1);
    expect(result[0]).toBeLessThanOrEqual(6);
  });
});
```

```javascript
// Solidity 测试示例
it("Should allow purchasing a building", async function () {
  await richManGame.connect(player1).purchaseBuilding(5);
  const building = await richManGame.getBuilding(5);
  expect(building.owner).to.equal(player1.address);
});
```

## 🎨 设计规范

### UI/UX 原则

- 像素风格一致
- 移动端友好
- 加载状态明显
- 错误提示清晰
- 动画流畅自然

### 颜色规范

```scss
$primary: #667eea;
$secondary: #764ba2;
$success: #48bb78;
$danger: #f56565;
$warning: #ed8936;
$info: #4299e1;
```

### 组件规范

- 使用 Standalone Components
- Props 使用 `@Input()`
- Events 使用 `@Output()`
- 避免深层嵌套
- 单一职责原则

## 🔍 代码审查

Pull Request 会经过以下审查：

1. ✅ 功能正确性
2. ✅ 代码质量
3. ✅ 测试覆盖
4. ✅ 文档完整性
5. ✅ 性能影响
6. ✅ 安全性检查

## 🌟 贡献者

感谢所有贡献者！

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- 自动生成列表 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## 💬 社区

- 💭 [Discussions](https://github.com/yourusername/richman-web3/discussions) - 讨论想法
- 🐛 [Issues](https://github.com/yourusername/richman-web3/issues) - 报告问题
- 📧 Email: dev@richman-web3.com

## 📜 行为准则

请遵守 [Code of Conduct](CODE_OF_CONDUCT.md)：

- 🤝 尊重他人
- 💬 建设性反馈
- 🎯 专注问题本身
- 🌍 包容多样性

## 🎁 奖励计划

我们正在计划贡献者奖励：

- 🏆 顶级贡献者可获得特殊 NFT
- ⭐ 优秀 PR 可获得代币奖励
- 🎖️ 贡献徽章系统

## 📚 学习资源

### Angular
- [Angular 官方文档](https://angular.io/docs)
- [Angular 风格指南](https://angular.io/guide/styleguide)

### Phaser.js
- [Phaser 3 文档](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 示例](https://phaser.io/examples)

### Solidity
- [Solidity 文档](https://docs.soliditylang.org/)
- [OpenZeppelin 合约](https://docs.openzeppelin.com/contracts/)
- [Hardhat 指南](https://hardhat.org/getting-started/)

### Web3
- [Ethers.js 文档](https://docs.ethers.org/)
- [MetaMask 文档](https://docs.metamask.io/)

## ❓ 需要帮助？

- 💬 在 [Discussions](https://github.com/yourusername/richman-web3/discussions) 提问
- 📖 查看 [README.md](README.md) 和 [GAME_GUIDE.md](GAME_GUIDE.md)
- 🐛 搜索现有 [Issues](https://github.com/yourusername/richman-web3/issues)

---

**感谢你的贡献！让我们一起打造最好的 Web3 游戏！** 🎮
