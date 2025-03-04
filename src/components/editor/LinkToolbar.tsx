import React, { useState } from 'react';
import { useSlate } from 'slate-react';
import { Editor as SlateEditor, Range } from 'slate';
import { Button, Dialog, Flex, TextField } from '@radix-ui/themes';
import { Link1Icon } from '@radix-ui/react-icons';

const LinkToolbar: React.FC = () => {
  const editor = useSlate();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  const isLinkActive = () => {
    const marks = SlateEditor.marks(editor);
    return marks?.link ? true : false;
  };

  const handleOpenDialog = () => {
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      const selectedText = SlateEditor.string(editor, selection);
      setText(selectedText);
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setUrl('');
    setText('');
  };

  const handleInsertLink = () => {
    if (!url) return;

    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      // 如果有选中的文本，直接添加链接标记
      SlateEditor.addMark(editor, 'link', url);
    } else if (text) {
      // 如果没有选中文本但输入了显示文本，插入新的链接文本
      editor.insertText(text);
      editor.addMark('link', url);
    }

    handleCloseDialog();
  };

  const handleRemoveLink = () => {
    SlateEditor.removeMark(editor, 'link');
  };

  return (
    <>
      <Button
      color="gray"
      highContrast
      size="1"
        variant={isLinkActive() ? "solid" : "surface"}
        onClick={handleOpenDialog}
        title="插入链接"
      >
        <Link1Icon width="16" height="16" />
      </Button>

      <Dialog.Root open={open} onOpenChange={(open) => !open && handleCloseDialog()}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>插入链接</Dialog.Title>
          <Flex direction="column" gap="3">
              <TextField.Root
                placeholder="链接地址"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <TextField.Root
                placeholder="显示文本"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" onClick={handleCloseDialog}>取消</Button>
            {isLinkActive() && (
              <Button variant="soft" color="red" onClick={handleRemoveLink}>
                移除链接
              </Button>
            )}
            <Button onClick={handleInsertLink}>确定</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default LinkToolbar;