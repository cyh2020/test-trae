import React from 'react';
import { useSlate } from 'slate-react';
import { Editor as SlateEditor, Element as SlateElement, Transforms } from 'slate';
import { Button } from '@radix-ui/themes';
import { LayersIcon } from '@radix-ui/react-icons';
import { RecursiveElement } from '@/types/editor';

const RecursiveToolbar = () => {
  const editor = useSlate();

  const isRecursiveActive = () => {
    const [match] = SlateEditor.nodes(editor, {
      match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n.type === 'recursive'
    });
    return !!match;
  };

  const handleClick = () => {
    const recursiveNode: RecursiveElement = {
      type: 'recursive',
      displayChidren: true,
      children: [{
        type: 'paragraph',
        children: [{ text: '' }]
      }]
    };

    Transforms.insertNodes(editor, recursiveNode);
  };

  return (
    <Button
      color="gray"
      highContrast
      size="1"
      variant={isRecursiveActive() ? "solid" : "surface"}
      onClick={handleClick}
      title="插入递归容器"
    >
      <LayersIcon width="16" height="16" />
    </Button>
  );
};

export default RecursiveToolbar;