import { Editor, Transforms, Range, Element, Node, Path } from 'slate';
import { ReactEditor } from 'slate-react';
import { CustomEditor } from '../types/editor';

let lastEnterTime = 0;
export const useEditorEnterKey = (editor: CustomEditor) => {

  const handleEnterKey = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') return;

    const { selection } = editor;
    if (!selection) return;

    // 获取当前选中的节点
    const [node] = Editor.nodes(editor, {
      match: n => Element.isElement(n) && (
        n.type === 'ordered-list' ||
        n.type === 'unordered-list' ||
        n.type === 'list-item' ||
        n.type === 'todo-list' ||
        n.type === 'todo-item' ||
        n.type === 'latex' ||
        n.type === 'mermaid' ||
        n.type === 'image' ||
        n.type === 'code-block' ||
        n.type === 'blockquote' ||
        n.type === 'container' ||
        n.type === 'recursive'
      )
    });

    // 检查是否在列表项中且按下了Command+Enter组合键
    if (node && (
        node[0].type === 'list-item'
        || node[0].type === 'todo-item'
        || node[0].type === 'code-block'
        || node[0].type === 'blockquote'
        || node[0].type === 'unordered-list'
        || node[0].type === 'ordered-list'
        || node[0].type === 'todo-list'
        || node[0].type === 'container'
        || node[0].type === 'recursive'
      ) && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      
      // 获取当前节点的路径
      const path = ReactEditor.findPath(editor, node[0]);

      // 在当前位置后插入新段落
      Transforms.insertNodes(
        editor,
        { type: 'paragraph', children: [{ text: '' }] },
        { at: Path.next(path) }
      );
      
      // 将光标移动到新段落
      Transforms.select(editor, Path.next(path));
      return;
    }

    // 如果不在列表、latex、mermaid或图片节点中，则阻止默认行为并插入一个新的默认段落
    if (!node) {
      event.preventDefault();
      
      // 如果有选中的文本范围，先删除它
      if (!Range.isCollapsed(selection)) {
        Transforms.delete(editor);
      }

      // 在当前位置分割节点
      Transforms.splitNodes(editor, { always: true });

      // 移除新行的所有格式标记
      Editor.removeMark(editor, 'bold');
      Editor.removeMark(editor, 'italic');
      Editor.removeMark(editor, 'underline');
      Editor.removeMark(editor, 'color');
      Editor.removeMark(editor, 'backgroundColor');
      Editor.removeMark(editor, 'fontSize');

      // 确保新行是默认的段落格式
      const path = [...selection.anchor.path.slice(0, -1)];
      Transforms.setNodes(
        editor,
        { type: 'paragraph' },
        { at: path }
      );
    } else if (node[0].type === 'latex') {
      event.preventDefault();
      
      // 获取latex节点的路径
      const path = ReactEditor.findPath(editor, node[0]);
      
      // 在latex节点后插入新段落
      Transforms.insertNodes(
        editor,
        { type: 'paragraph', children: [{ text: '' }] },
        { at: Path.next(path) }
      );
      
      // 将光标移动到新段落
      Transforms.select(editor, Path.next(path));
    } else if (node[0].type === 'mermaid') {
      event.preventDefault();
      
      // 获取mermaid节点的路径
      const path = ReactEditor.findPath(editor, node[0]);
      
      // 在mermaid节点后插入新段落
      Transforms.insertNodes(
        editor,
        { type: 'paragraph', children: [{ text: '' }] },
        { at: Path.next(path) }
      );
      
      // 将光标移动到新段落
      Transforms.select(editor, Path.next(path));
    } else if (node[0].type === 'image') {
      event.preventDefault();
      
      // 获取图片节点的路径
      const path = ReactEditor.findPath(editor, node[0]);
      
      // 在图片节点后插入新段落
      Transforms.insertNodes(
        editor,
        { type: 'paragraph', children: [{ text: '' }] },
        { at: Path.next(path) }
      );
      
      // 将光标移动到新段落
      Transforms.select(editor, Path.next(path));
    }
  };

  return {
    handleEnterKey
  };
};