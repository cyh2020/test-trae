import React, { useState } from 'react';
import { Popover, TextField, Button, Box, Flex } from '@radix-ui/themes';
import { Editor as SlateEditor } from 'slate';

interface LinkHoverMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  editor: SlateEditor;
  initialText: string;
  initialUrl: string;
}

const LinkHoverMenu: React.FC<LinkHoverMenuProps> = ({
  anchorEl,
  onClose,
  editor,
  initialText,
  initialUrl
}) => {
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);

  const handleUpdate = () => {
    if (!editor.selection) return;

    // 更新链接文本
    if (text !== initialText) {
      SlateEditor.deleteFragment(editor);
      editor.insertText(text);
    }

    // 更新链接URL
    if (url !== initialUrl) {
      SlateEditor.addMark(editor, 'link', url);
    }

    onClose();
  };

  const handleRemove = () => {
    SlateEditor.removeMark(editor, 'link');
    onClose();
  };

  if (!anchorEl) return null;

  return (
    <Popover.Root open>
      <Popover.Trigger asChild>
        <div style={{ position: 'absolute', top: anchorEl.offsetTop, left: anchorEl.offsetLeft }} />
      </Popover.Trigger>
      <Popover.Content style={{ width: '300px' }}>
        <Box p="4">
          <Flex direction="column" gap="3">
            <TextField.Root>
              <TextField.Input
                placeholder="链接文本"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </TextField.Root>
            <TextField.Root>
              <TextField.Input
                placeholder="链接地址"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </TextField.Root>
            <Flex gap="2" justify="end">
              <Button variant="soft" onClick={onClose}>
                取消
              </Button>
              <Button variant="soft" color="red" onClick={handleRemove}>
                移除链接
              </Button>
              <Button onClick={handleUpdate}>
                更新
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
};

export default LinkHoverMenu;