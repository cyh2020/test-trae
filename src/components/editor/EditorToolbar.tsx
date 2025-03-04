import React from 'react';
import { useSlate } from 'slate-react';
import { Editor as SlateEditor, Element as SlateElement, Transforms } from 'slate';
import { Box, Button } from '@radix-ui/themes';
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  TextAlignLeftIcon,
  Cross2Icon,
  StrikethroughIcon
} from '@radix-ui/react-icons';

const EditorToolbar = () => {
  const editor = useSlate();

  const isMarkActive = (format) => {
    const marks = SlateEditor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const toggleMark = (format) => {
    const isActive = isMarkActive(format);
    if (isActive) {
      SlateEditor.removeMark(editor, format);
    } else {
      SlateEditor.addMark(editor, format, true);
    }
  };

  const isBlockActive = (format) => {
    const [match] = SlateEditor.nodes(editor, {
      match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n.type === format
    });
    return !!match;
  };

  const toggleList = (listType) => {
    const isActive = isBlockActive(listType);

    Transforms.unwrapNodes(editor, {
      match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && 
        (n.type === 'ordered-list' || n.type === 'unordered-list'),
      split: true
    });

    if (!isActive) {
      const block = { type: listType, children: [] };
      Transforms.wrapNodes(editor, block);
      Transforms.setNodes(editor, { type: 'list-item' });
    } else {
      Transforms.setNodes(editor, { type: 'paragraph' });
    }
  };

  const clearFormatting = () => {
    ['bold', 'italic', 'underline', 'strikethrough', 'color', 'backgroundColor', 'fontSize', 'superscript', 'subscript'].forEach(mark => {
      SlateEditor.removeMark(editor, mark);
    });
  };

  return (
    <Box style={{ display: 'flex', gap: '4px' }}>
      <Button
        color="gray"
        highContrast
        size="1"
        variant={isMarkActive('bold') ? 'solid' : 'surface'}
        onClick={() => toggleMark('bold')}
        title="加粗"
      >
        <FontBoldIcon width="16" height="16" />
      </Button>
      <Button
        color="gray"
        highContrast
        size="1"
        variant={isMarkActive('italic') ? 'solid' : 'surface'}
        onClick={() => toggleMark('italic')}
        title="斜体"
      >
        <FontItalicIcon width="16" height="16" />
      </Button>
      <Button
        color="gray"
        highContrast
        size="1"
        variant={isMarkActive('underline') ? 'solid' : 'surface'}
        onClick={() => toggleMark('underline')}
        title="下划线"
      >
        <UnderlineIcon width="16" height="16" />
      </Button>
      <Button
        color="gray"
        highContrast
        size="1"
        variant={isMarkActive('strikethrough') ? 'solid' : 'surface'}
        onClick={() => toggleMark('strikethrough')}
        title="删除线"
      >
        <StrikethroughIcon width="16" height="16" />
      </Button>
      <Button
        color="gray"
        highContrast
        size="1"
        variant={isMarkActive('superscript') ? 'solid' : 'surface'}
        onClick={() => toggleMark('superscript')}
        title="上标"
      >
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>X<sup>2</sup></span>
      </Button>
      <Button
        color="gray"
        highContrast
        size="1"
        variant={isMarkActive('subscript') ? 'solid' : 'surface'}
        onClick={() => toggleMark('subscript')}
        title="下标"
      >
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>X<sub>2</sub></span>
      </Button>
      <Button
        color="gray"
        highContrast
        size="1"
        variant={isBlockActive('ordered-list') ? 'solid' : 'surface'}
        onClick={() => toggleList('ordered-list')}
        title="有序列表"
      >
        <TextAlignLeftIcon width="16" height="16" />
      </Button>
      <Button
        color="gray"
        highContrast
        size="1"
        variant={isBlockActive('unordered-list') ? 'solid' : 'surface'}
        onClick={() => toggleList('unordered-list')}
        title="无序列表"
      >
        <ListBulletIcon width="16" height="16" />
      </Button>
      <Button
        color="gray"
        highContrast
        size="1"
        variant="surface"
        onClick={clearFormatting}
        title="清除格式"
      >
        <Cross2Icon width="16" height="16" />
      </Button>
    </Box>
  );
};

export default EditorToolbar;