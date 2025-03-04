import React from 'react';
import { useSlate } from 'slate-react';
import { Editor as SlateEditor, Element as SlateElement, Transforms } from 'slate';
import { Button } from '@radix-ui/themes';
import { CheckboxIcon } from '@radix-ui/react-icons';

const TodoListToolbar = () => {
  const editor = useSlate();

  const isTodoListActive = () => {
    const [match] = SlateEditor.nodes(editor, {
      match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n.type === 'todo-list'
    });
    return !!match;
  };

  const toggleTodoList = () => {
    const isActive = isTodoListActive();

    Transforms.unwrapNodes(editor, {
      match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && 
        (n.type === 'todo-list' || n.type === 'ordered-list' || n.type === 'unordered-list'),
      split: true
    });

    if (!isActive) {
      const todoList = { type: 'todo-list', children: [] };
      Transforms.wrapNodes(editor, todoList);

      // 将当前选中的段落转换为待办项
      Transforms.setNodes(editor, {
        type: 'todo-item',
        checked: false
      });
    } else {
      // 如果已经是待办列表，转换回普通段落
      Transforms.setNodes(editor, { type: 'paragraph' });
    }
  };

  return (
    <Button
        color="gray"
        highContrast
        size="1"
        variant={isTodoListActive() ? "solid" : "surface"}
        onClick={toggleTodoList}
        title="待办列表"
    >
      <CheckboxIcon width="16" height="16" />
    </Button>
  );
};

export default TodoListToolbar;