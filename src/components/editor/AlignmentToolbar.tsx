import React from 'react';
import { useSlate } from 'slate-react';
import { Editor as SlateEditor, Transforms } from 'slate';
import { Box, Button } from '@radix-ui/themes';
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon
} from '@radix-ui/react-icons';

const AlignmentToolbar = () => {
  const editor = useSlate();

  const isAlignmentActive = (alignment: string) => {
    const [match] = SlateEditor.nodes(editor, {
      match: n => !SlateEditor.isEditor(n) && n.type === 'paragraph' && n.textAlign === alignment
    });
    return !!match;
  };

  const toggleAlignment = (alignment: string) => {
    Transforms.setNodes(
      editor,
      { textAlign: isAlignmentActive(alignment) ? undefined : alignment },
      { match: n => !SlateEditor.isEditor(n) && n.type === 'paragraph' }
    );
  };

  return (
    <Box>
      <Button
        color="gray"
        highContrast
        size="1"
        variant={isAlignmentActive('left') ? 'solid' : 'surface'}
        onClick={() => toggleAlignment('left')}
        title="左对齐"
      >
        <TextAlignLeftIcon width="16" height="16" />
      </Button>
      <Button
        color="gray"
        highContrast
        size="1"
        variant={isAlignmentActive('center') ? 'solid' : 'surface'}
        onClick={() => toggleAlignment('center')}
        title="居中对齐"
      >
        <TextAlignCenterIcon width="16" height="16" />
      </Button>
      <Button
        color="gray"
        highContrast
        size="1"
        variant={isAlignmentActive('right') ? 'solid' : 'surface'}
        onClick={() => toggleAlignment('right')}
        title="右对齐"
      >
        <TextAlignRightIcon width="16" height="16" />
      </Button>
    </Box>
  );
};

export default AlignmentToolbar;