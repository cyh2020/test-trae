# 富文本编辑器架构说明

## 技术栈

- **前端框架**: React + TypeScript
- **编辑器核心**: Slate.js
- **UI组件**: Radix UI
- **构建工具**: Vite
- **桌面应用框架**: Electron
- **实时协作**: Hocuspocus

## 系统架构

### 核心组件

1. **Editor 组件** (`src/components/Editor.tsx`)
   - 编辑器的主要容器组件
   - 集成工具栏和编辑区域
   - 管理编辑器状态和操作

2. **编辑器插件** (`src/plugins/`)
   - `slate-code`: 代码块功能
   - `slate-blockquote`: 引用块功能
   - `withContainer`: 容器功能

3. **Hooks** (`src/hooks/`)
   - `useEditorHistory`: 撤销/重做功能
   - `useEditorKeyBinding`: 快捷键绑定
   - `useEditorEnterKey`: 回车键处理
   - `useEditorIndent`: 缩进处理
   - `useFileOperations`: 文件操作

### 数据流

1. **编辑器状态管理**
   - 使用 Slate 的内置状态管理
   - 通过 `useEditorState` 管理文档内容
   - 实时保存到本地文件系统

2. **实时协作流程**
   - 使用 Hocuspocus 服务器同步变更
   - 支持多人同时编辑
   - 自动合并冲突

### 扩展功能

1. **特殊块支持**
   - LaTeX 公式
   - Mermaid 图表
   - 代码块（支持语法高亮）
   - 待办事项
   - 图片

2. **格式化工具**
   - 文本样式（粗体、斜体、下划线）
   - 字体大小和颜色
   - 对齐方式
   - 列表（有序、无序）

## 文件结构

```
/src
  /components      # React 组件
  /hooks          # 自定义 Hooks
  /plugins        # Slate 插件
  /types          # TypeScript 类型定义
  /stores         # 状态管理
  /styles         # 样式文件
  /server         # 服务器配置
```

## 扩展性

1. **插件系统**
   - 基于 Slate 的插件架构
   - 支持自定义节点类型
   - 可扩展的工具栏

2. **主题定制**
   - 支持自定义样式
   - 响应式设计

3. **协作能力**
   - 支持离线编辑
   - 在线同步
   - 冲突解决