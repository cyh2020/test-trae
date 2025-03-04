import React from 'react';
import { RenderElementProps } from 'slate-react';
import mermaid from 'mermaid';

interface RenderMermaidElementProps extends RenderElementProps {
  style: React.CSSProperties;
  onEdit: () => void;
}

export const RenderMermaidElement: React.FC<RenderMermaidElementProps> = ({ attributes, children, element, style, onEdit }) => {
  return (
    <div {...attributes} style={style}>
      <div
        contentEditable={false}
        onClick={onEdit}
      >
        <div
          ref={async (node) => {
            if (node) {
              try {
                const { svg } = await mermaid.render('mermaid-' + Date.now(), element.code);
                node.innerHTML = svg;
              } catch (error) {
                console.error('Mermaid rendering error:', error);
              }
            }
          }}
          style={{ 
            backgroundColor: '#fff', 
            padding: '8px', 
            borderRadius: '4px',
            margin: '8px 0'
          }}
        />
      </div>
      {children}
    </div>
  );
};