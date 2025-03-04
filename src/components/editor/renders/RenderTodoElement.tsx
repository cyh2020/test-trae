import React from 'react';
import { RenderElementProps, ReactEditor } from 'slate-react';
import { Transforms } from 'slate';

interface RenderTodoElementProps extends RenderElementProps {
  style: React.CSSProperties;
  editor: ReactEditor;
}

export const RenderTodoElement: React.FC<RenderTodoElementProps> = ({ attributes, children, element, style, editor }) => {
  switch (element.type) {
    case 'todo-list':
      return (
        <ul {...attributes} style={{ ...style, listStyle: 'none', padding: 0 }}>
          {children}
        </ul>
      );
    case 'todo-item':
      return (
        <li {...attributes} style={{ ...style, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={element.checked}
            onChange={event => {
              const path = ReactEditor.findPath(editor, element);
              Transforms.setNodes(editor, { checked: event.target.checked }, { at: path });
            }}
            contentEditable={false}
          />
          <span style={{ flex: 1 }}>{children}</span>
        </li>
      );
    default:
      return null;
  }
};