import React from 'react';
import { RenderElementProps } from 'slate-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { LatexElement } from '@/types/editor';

interface RenderLatexElementProps extends RenderElementProps {
  style: React.CSSProperties;
  onEdit: () => void;
}

export const RenderLatexElement: React.FC<RenderLatexElementProps> = ({ attributes, children, element, style, onEdit }) => {
  return (
    <div {...attributes} style={style}>
      <div
        contentEditable={false}
        onClick={onEdit}
      >
        <div dangerouslySetInnerHTML={{ __html: katex.renderToString((element as LatexElement).latex) }} />
      </div>
      {children}
    </div>
  );
};