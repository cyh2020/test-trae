import { Editor, Element as SlateElement } from 'slate';
import { ContainerElement } from '../types/container';

/**
 * withContainer插件 - 为编辑器添加对容器节点的支持
 * 允许容器节点递归嵌套，并支持在容器内放置各种元素
 */
export const withContainer = (editor: Editor) => {
  const { isInline, isVoid } = editor;

  // 确保容器不是内联元素
  editor.isInline = (element) => {
    return element.type === 'container' ? false : isInline(element);
  };

  // 确保容器不是空元素
  editor.isVoid = (element) => {
    return element.type === 'container' ? false : isVoid(element);
  };

  // 扩展normalize函数以处理容器节点的特殊逻辑
//   editor.normalizeNode = (entry) => {
//     const [node, path] = entry;

//     // 如果是容器节点，确保其结构正确
//     if (SlateElement.isElement(node) && node.type === 'container') {
//       const containerElement = node as ContainerElement;
      
//       // 确保容器有slots属性
//       if (!containerElement.slots || !Array.isArray(containerElement.slots)) {
//         const layout = containerElement.layout || 'two-rows';
//         const slotCount = getSlotCountForLayout(layout);
        
//         // 创建默认的slots
//         const slots = Array.from({ length: slotCount }, (_, i) => ({
//           id: `slot-${i}`,
//           element: null
//         }));
        
//         Editor.withoutNormalizing(editor, () => {
//           // 更新节点，添加slots属性
//           editor.apply({
//             type: 'set_node',
//             path,
//             properties: {},
//             newProperties: { slots }
//           });
//         });
        
//         return;
//       }
//     }

//     // 调用原始的normalizeNode处理其他情况
//     normalizeNode(entry);
//   };

  return editor;
};

export const withRecursive = (editor: Editor) => {
  const { isInline, isVoid } = editor;
  // 确保容器不是内联元素
  editor.isInline = (element) => {
    return element.type === 'recursive'? false : isInline(element);
  };
  // 确保容器不是空元素
  editor.isVoid = (element) => {
    return element.type === 'recursive'? false : isVoid(element);
  };
  return editor;
}

// 根据布局类型获取插槽数量
function getSlotCountForLayout(layout: string): number {
  switch (layout) {
    case 'two-rows':
    case 'two-columns':
    case 'one-left-two-right':
    case 'one-left-three-right':
      return 2;
    case 'three-rows':
    case 'three-columns':
      return 3;
    case 'four-rows':
    case 'four-columns':
      return 4;
    default:
      return 2;
  }
}