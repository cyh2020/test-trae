import React from 'react';
import { useSlate } from 'slate-react';
import { Editor as SlateEditor } from 'slate';
import { Flex, Popover, Button, Text } from '@radix-ui/themes';
import { TextIcon } from '@radix-ui/react-icons';

const colors = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#FFFFFF',
  '#FF0000', '#FF4D00', '#FF9900', '#FFB800', '#FCFF00', '#00FF00', '#00FCFF', '#0000FF'
];

const ColorToolbar = () => {
  const editor = useSlate();
  const [isOpen, setIsOpen] = React.useState(false);

  const isColorActive = (format: 'color' | 'backgroundColor', color: string) => {
    const marks = SlateEditor.marks(editor);
    return marks?.[format] === color;
  };

  const toggleColor = (format: 'color' | 'backgroundColor', color: string) => {
    const isActive = isColorActive(format, color);
    if (isActive) {
      SlateEditor.removeMark(editor, format);
    } else {
      SlateEditor.addMark(editor, format, color);
    }
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <Button
          color="gray"
          highContrast
          size="1"
          variant="surface"
          title="文字颜色"
        >
          <TextIcon width="16" height="16" />
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Flex direction="column" gap="2" style={{ padding: '8px', minWidth: '240px' }}>
          <Text size="2" weight="medium">文字颜色</Text>
          <Flex gap="1" wrap="wrap">
            {colors.map((color) => (
              <Button
                key={`text-${color}`}
                variant="surface"
                onClick={() => toggleColor('color', color)}
                style={{
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  backgroundColor: color,
                  border: '1px solid var(--gray-6)',
                  outline: isColorActive('color', color) ? '2px solid var(--accent-9)' : 'none',
                  outlineOffset: '1px'
                }}
              />
            ))}
          </Flex>
          <Text size="2" weight="medium" mt="2">背景颜色</Text>
          <Flex gap="1" wrap="wrap">
            {colors.map((color) => (
              <Button
                key={`bg-${color}`}
                variant="surface"
                onClick={() => toggleColor('backgroundColor', color)}
                style={{
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  backgroundColor: color,
                  border: '1px solid var(--gray-6)',
                  outline: isColorActive('backgroundColor', color) ? '2px solid var(--accent-9)' : 'none',
                  outlineOffset: '1px'
                }}
              />
            ))}
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

export default ColorToolbar;