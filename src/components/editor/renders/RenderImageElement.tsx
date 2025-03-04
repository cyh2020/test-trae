import React from 'react';
import { RenderElementProps } from 'slate-react';

interface RenderImageElementProps extends RenderElementProps {
  style: React.CSSProperties;
}

export const RenderImageElement: React.FC<RenderImageElementProps> = ({ attributes, children, element, style }) => {
  return (
    <div {...attributes} style={{ ...style, textAlign: 'center' }}>
      <div contentEditable={false}>
        <img
          src={element.url}
          alt={element.alt || ''}
          style={{
            maxWidth: '100%',
            width: element.width || 'auto',
            height: element.height || 'auto'
          }}
        />
      </div>
      {children}
    </div>
  );
};