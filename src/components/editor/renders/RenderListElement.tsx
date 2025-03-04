import React from 'react';
import { RenderElementProps } from 'slate-react';

interface RenderListElementProps extends RenderElementProps {
  style: React.CSSProperties;
}

export const RenderListElement: React.FC<RenderListElementProps> = ({ attributes, children, element, style }) => {
  switch (element.type) {
    case 'ordered-list':
      return (
        <ol {...attributes} style={style}>
          {children}
        </ol>
      );
    case 'unordered-list':
      return (
        <ul {...attributes} style={style}>
          {children}
        </ul>
      );
    case 'list-item':
      return (
        <li {...attributes} style={style}>
          {children}
        </li>
      );
    default:
      return null;
  }
};