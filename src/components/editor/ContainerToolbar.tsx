import React from 'react';
import { useSlate } from 'slate-react';
import { Editor as SlateEditor, Element as SlateElement, Transforms } from 'slate';
import { Button, Dialog, Box, Select } from '@radix-ui/themes';
import { ContainerLayout, ContainerElement } from '../../types/container';
import { GridIcon } from '@radix-ui/react-icons';
import { RecursiveElement } from '@/types/editor';

const LAYOUT_OPTIONS = [
  { label: '两行布局', value: 'two-rows' },
  { label: '三行布局', value: 'three-rows' },
  { label: '四行布局', value: 'four-rows' },
  { label: '左一右二', value: 'one-left-two-right' },
  { label: '左一右三', value: 'one-left-three-right' },
  { label: '两列布局', value: 'two-columns' },
  { label: '三列布局', value: 'three-columns' },
  { label: '四列布局', value: 'four-columns' },
];

const getSlotCount = (layout: ContainerLayout): number => {
  switch (layout) {
    case 'two-rows':
      return 2;
    case 'three-rows':
      return 3;
    case 'four-rows':
      return 4;
    case 'one-left-two-right':
      return 2;
    case 'one-left-three-right':
      return 2;
    case 'two-columns':
      return 2;
    case 'three-columns':
      return 3;
    case 'four-columns':
      return 4;
    default:
      return 2;
  }
};

const ContainerToolbar = () => {
  const editor = useSlate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedLayout, setSelectedLayout] = React.useState<ContainerLayout>('two-rows');

  const isContainerActive = () => {
    const [match] = SlateEditor.nodes(editor, {
      match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n.type === 'container'
    });
    return !!match;
  };

  const handleConfirm = () => {
    const slotCount = getSlotCount(selectedLayout);
    const containerNode: ContainerElement = {
      type: 'container',
      layout: selectedLayout,
      children: Array.from({ length: slotCount }, () => ({
        type: 'paragraph',
        children: [{ text: '' }]
      }))
    };

    Transforms.insertNodes(editor, containerNode);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        color="gray"
        highContrast
        size="1"
        variant={isContainerActive() ? "solid" : "surface"}
        onClick={() => setIsOpen(true)}
        title="插入容器"
      >
        <GridIcon width="16" height="16" />
      </Button>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Content style={{ maxWidth: 400 }}>
          <Dialog.Title>插入容器</Dialog.Title>
          <Box p="4">
            <Box mb="3">
              <Select.Root
                value={selectedLayout}
                onValueChange={(value: ContainerLayout) => setSelectedLayout(value)}
              >
                <Select.Trigger />
                <Select.Content>
                  {LAYOUT_OPTIONS.map(option => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            <Box style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button variant="soft" onClick={() => setIsOpen(false)}>取消</Button>
              <Button onClick={handleConfirm}>确定</Button>
            </Box>
          </Box>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default ContainerToolbar;