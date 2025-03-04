import React from 'react';
import { RenderElementProps, ReactEditor } from 'slate-react';
import { Transforms } from 'slate';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';

interface RenderRecursiveElementProps extends RenderElementProps {
  style: React.CSSProperties;
  editor: ReactEditor;
}

export const RenderRecursiveElement: React.FC<RenderRecursiveElementProps> = ({ attributes, children, element, style, editor }) => {
  const isDisplayed = element.displayChildren !== false;
  
  const toggleDisplay = () => {
    Transforms.setNodes(
      editor, 
      { displayChildren: !isDisplayed }, 
      { at: ReactEditor.findPath(editor, element) }
    );
  };

  return (
    <div {...attributes} className='recursive-container'>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ cursor: 'pointer' }} onClick={toggleDisplay}>
          {isDisplayed 
            ? <EyeOpenIcon width="16" height="16" /> 
            : <EyeClosedIcon width="16" height="16" />}
        </div>
        <div style={{ display: isDisplayed ? 'block' : 'none' }}>
          {children}
        </div>
      </div>
    </div>
  );
};