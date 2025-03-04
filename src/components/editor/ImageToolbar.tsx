import React, { useState } from 'react';
import { useSlate } from 'slate-react';
import { Editor as SlateEditor, Transforms } from 'slate';
import { Button, Dialog, Flex, Box, Text, Tabs, TextField } from '@radix-ui/themes';
import { ImageIcon } from '@radix-ui/react-icons';

interface TabContentProps {
  children?: React.ReactNode;
  value: string;
  activeTab: string;
}

function TabContent({ children, value, activeTab }: TabContentProps) {
  if (value !== activeTab) return null;
  
  return (
    <Box p="5">
      {children}
    </Box>
  );
}

const ImageToolbar = () => {
  const editor = useSlate();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState('url');
  const [isUploading, setIsUploading] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setUrl('');
    setActiveTab('url');
    setIsUploading(false);
  };

  const handleUrlImageInsert = () => {
    if (!url) return;

    const image = {
      type: 'image',
      url,
      children: [{ text: '' }]
    };

    Transforms.insertNodes(editor, image);
    handleCloseDialog();
  };

  const handleLocalImageInsert = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('文件选择事件触发');
    const file = event.target.files?.[0];
    if (!file) {
      console.log('未选择文件');
      return;
    }

    console.log('选择的文件:', file.name, file.type);
    try {
      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        console.log('文件读取成功');
        const base64 = e.target?.result as string;
        const image = {
          type: 'image',
          url: base64,
          children: [{ text: '' }]
        };

        Transforms.insertNodes(editor, image);
        handleCloseDialog();
      };

      reader.onerror = () => {
        console.error('图片读取失败');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('图片处理失败:', error);
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button
        variant="surface"
        onClick={handleOpenDialog}
        title="插入图片"
        color="gray"
        highContrast
        size="1"
      >
        <ImageIcon width="16" height="16" />
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>插入图片</Dialog.Title>
          
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Trigger value="url">网络图片</Tabs.Trigger>
              <Tabs.Trigger value="local">本地图片</Tabs.Trigger>
            </Tabs.List>

            <TabContent value="url" activeTab={activeTab}>
                <TextField.Root
                  placeholder="请输入图片URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
            </TabContent>

            <TabContent value="local" activeTab={activeTab}>
              <Flex direction="column" align="center" gap="2">
                <Button
                  variant="solid"
                  disabled={isUploading}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = handleLocalImageInsert;
                    input.click();
                  }}
                >
                  {isUploading ? '正在处理...' : '选择图片'}
                </Button>
                <Text size="2" color="gray">
                  支持 JPG、PNG 等常见图片格式
                </Text>
              </Flex>
            </TabContent>
          </Tabs.Root>

          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" onClick={handleCloseDialog}>
              取消
            </Button>
            {activeTab === 'url' && (
              <Button onClick={handleUrlImageInsert} disabled={!url}>
                确定
              </Button>
            )}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default ImageToolbar;