export const mermaidExamples = [
  {
    label: '流程图',
    code: `graph TD
A[开始] --> B{判断}
B -->|Yes| C[处理1]
B -->|No| D[处理2]
C --> E[结束]
D --> E`
  },
  {
    label: '时序图',
    code: `sequenceDiagram
participant A
participant B
A->>B: Hello
B->>A: Hi there!`
  },
  {
    label: '甘特图',
    code: `gantt
title 项目计划
dateFormat YYYY-MM-DD
section 阶段1
任务1 :2024-01-01, 7d
任务2 :2024-01-08, 5d`
  },
  {
    label: '思维导图',
    code: `mindmap
  root((思维导图))
    主题1
      子主题1
      子主题2
    主题2
      子主题3
      子主题4`
  },
  {
    label: '状态图',
    code: `stateDiagram-v2
    [*] --> 待处理
    待处理 --> 处理中: 开始处理
    处理中 --> 已完成: 完成
    处理中 --> 失败: 出错
    失败 --> 待处理: 重试
    已完成 --> [*]`
  },
  {
    label: '饼图',
    code: `pie title 项目分布
    "开发" : 40
    "测试" : 20
    "设计" : 20
    "文档" : 20`
  },
  {
    label: '类图',
    code: `classDiagram
    class Animal {
        +String name
        +eat()
        +sleep()
    }
    class Dog {
        +bark()
    }
    Animal <|-- Dog`
  }
];