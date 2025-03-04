import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentFiles } from '../hooks/useRecentFiles';
import { Container, Box, Card, Text, Button, Heading, Flex, ScrollArea, Separator } from '@radix-ui/themes';
import { FileTextIcon, PlusIcon, GlobeIcon } from '@radix-ui/react-icons';

const Home = () => {
  const navigate = useNavigate();
  const { recentFiles } = useRecentFiles();

  const handleOpenFile = async () => {
    try {
      const result = await window.fileOps.openFile();
      if (result) {
        const { filePath, content } = result;
        navigate('/editor', { state: { filePath, content } });
      }
    } catch (error) {
      console.error('打开文件失败:', error);
    }
  };

  const handleOpenRecentFile = async (filePath: string) => {
    try {
      const result = await window.fileOps.readFile(filePath);
      if (result) {
        const { content } = result;
        navigate('/editor', { state: { filePath, content } });
      }
    } catch (error) {
      console.error('打开文件失败:', error);
    }
  };

  return (
    <Box style={{
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
    }}>
      <Container size="3">
        <Card size="4" style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          transition: 'transform 0.3s ease-in-out',
        }}>
          <Flex direction="column" align="center" gap="6">
            <Box style={{ textAlign: 'center' }}>
              <Heading size="8" style={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px'
              }}>
                文档编辑器
              </Heading>
              <Text size="3" color="gray">
                创建、编辑和管理您的文档
              </Text>
            </Box>

            <Flex gap="4">
              <Button size="3" onClick={handleOpenFile} style={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                transition: 'all 0.3s ease'
              }}>
                <FileTextIcon width="16" height="16" />
                打开文件
              </Button>
              <Button size="3" onClick={() => navigate('/editor')} style={{
                background: 'linear-gradient(45deg, #00C853 30%, #69F0AE 90%)',
                transition: 'all 0.3s ease'
              }}>
                <PlusIcon width="16" height="16" />
                新建文档
              </Button>
              <Button size="3" onClick={() => navigate('/online')} style={{
                background: 'linear-gradient(45deg, #FF4081 30%, #FF80AB 90%)',
                transition: 'all 0.3s ease'
              }}>
                <GlobeIcon width="16" height="16" />
                在线协作
              </Button>
            </Flex>

            {recentFiles.length > 0 && (
              <>
                <Separator size="4" />
                <Box width="100%">
                  <Heading size="4" style={{ marginBottom: '16px' }}>
                    最近编辑
                  </Heading>
                  <ScrollArea style={{ height: '300px' }}>
                    <Flex direction="column" gap="2">
                      {recentFiles.map((file) => (
                        <Card
                          key={file.path}
                          onClick={() => handleOpenRecentFile(file.path)}
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Flex direction="column" gap="1">
                            <Text weight="medium">{file.name}</Text>
                            <Text size="2" color="gray">上次编辑: {file.lastEdited}</Text>
                          </Flex>
                        </Card>
                      ))}
                    </Flex>
                  </ScrollArea>
                </Box>
              </>
            )}
          </Flex>
        </Card>
      </Container>
    </Box>
  );
};

export default Home;