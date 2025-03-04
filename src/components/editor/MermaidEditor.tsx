import React from 'react';
import { useSlate } from 'slate-react';
import { Transforms } from 'slate';
import { Button, Box, TextField, Text, Dialog, Flex, Switch } from '@radix-ui/themes';
import { useMermaidStore } from '../../stores/mermaidStore';
import mermaid from 'mermaid';
import { mermaidExamples } from '../../config/mermaidExamples';

const MermaidEditor: React.FC = () => {
  const { isOpen, setIsOpen, currentCode, setCurrentCode, currentPath, setCurrentPath } = useMermaidStore();
  const [mermaidInput, setMermaidInput] = React.useState(currentCode);
  const [previewHtml, setPreviewHtml] = React.useState('');
  const [isEditMode, setIsEditMode] = React.useState(true);
  const editor = useSlate();

  React.useEffect(() => {
    if (currentCode) {
      setMermaidInput(currentCode);
      try {
        mermaid.render('preview-' + Date.now(), currentCode).then(({ svg }) => {
          setPreviewHtml(svg);
        });
      } catch (error) {
        console.error('Mermaid parsing error:', error);
      }
    }
  }, [currentCode]);

  const handleClose = () => {
    setIsOpen(false);
    setMermaidInput('');
    setPreviewHtml('');
    setCurrentCode('');
    setCurrentPath([]);
  };

  const handleMermaidChange = async (input: string) => {
    setMermaidInput(input);
    try {
      const { svg } = await mermaid.render('preview-' + Date.now(), input);
      setPreviewHtml(svg);
    } catch (error) {
      console.error('Mermaid parsing error:', error);
    }
  };

  const handleConfirm = () => {
    if (!mermaidInput) return;
    
    const mermaidNode = {
      type: 'mermaid',
      code: mermaidInput,
      isEditMode: true,
      children: [{ text: '' }]
    };

    if (currentPath.length > 0) {
      Transforms.setNodes(editor, mermaidNode, { at: currentPath });
    } else {
      Transforms.insertNodes(editor, mermaidNode);
    }

    setCurrentCode('');
    setCurrentPath([]);
    handleClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content style={{ maxWidth: 600 }}>
        <Dialog.Title>编辑流程图</Dialog.Title>
        <Box p="4">
          <Flex gap="2" align="center" mb="3">
            <Switch checked={!isEditMode} onCheckedChange={(checked) => setIsEditMode(!checked)} />
            <Text size="2">预览模式</Text>
          </Flex>

          {isEditMode ? (
            <>
              <Text as="p" size="2" weight="medium" mb="2">常用图表示例：</Text>
              <Box mb="3">
                <Flex gap="2" wrap="wrap">
                  {mermaidExamples.map((example, index) => (
                    <Button
                      key={index}
                      variant="surface"
                      onClick={() => handleMermaidChange(example.code)}
                      style={{ justifyContent: 'flex-start' }}
                    >
                      {example.label}
                    </Button>
                  ))}
                </Flex>
              </Box>
              <TextField.Root
                placeholder="输入Mermaid流程图代码..."
                value={mermaidInput}
                onChange={(e) => handleMermaidChange(e.target.value)}
                style={{ minHeight: '150px', marginBottom: '16px', width: '100%' }}
              />
            </>
          ) : (
            previewHtml && (
              <Box
                style={{
                  background: 'var(--gray-3)',
                  borderRadius: 'var(--radius-2)',
                  padding: '16px',
                  width: '100%',
                  minHeight: '150px'
                }}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            )
          )}

          <Flex gap="2" justify="end">
            <Button variant="soft" onClick={handleClose}>取消</Button>
            <Button onClick={handleConfirm} disabled={!mermaidInput}>确定</Button>
          </Flex>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default MermaidEditor;