import React from 'react';
import { useSlate } from 'slate-react';
import { Editor as SlateEditor } from 'slate';
import { Button, Flex, Popover, Text } from '@radix-ui/themes';
import { FontSizeIcon } from '@radix-ui/react-icons';

const fontSizes = [
  '12px', '14px', '16px', '18px', '20px',
  '24px', '28px', '32px', '36px', '48px'
];

const FontSizeToolbar = () => {
  const editor = useSlate();
  const [isOpen, setIsOpen] = React.useState(false);

  const isFontSizeActive = (fontSize: string) => {
    const marks = SlateEditor.marks(editor);
    return marks?.fontSize === fontSize;
  };

  const toggleFontSize = (fontSize: string) => {
    const isActive = isFontSizeActive(fontSize);
    if (isActive) {
      SlateEditor.removeMark(editor, 'fontSize');
    } else {
      SlateEditor.addMark(editor, 'fontSize', fontSize);
    }
    setIsOpen(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <Button
            color="gray"
            highContrast
            size="1"
            variant="surface"
            title="字体大小"
        >
          <FontSizeIcon width="16" height="16" />
        </Button>
      </Popover.Trigger>

      <Popover.Content>
        <Flex direction="column" gap="1" style={{ padding: '8px', minWidth: '120px' }}>
          {fontSizes.map((size) => (
            <Button
              key={size}
              variant={isFontSizeActive(size) ? 'solid' : 'ghost'}
              onClick={() => toggleFontSize(size)}
              style={{
                justifyContent: 'flex-start',
                padding: '6px 12px'
              }}
            >
              <Text size="2" style={{ fontSize: size }}>{size}</Text>
            </Button>
          ))}
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

export default FontSizeToolbar;