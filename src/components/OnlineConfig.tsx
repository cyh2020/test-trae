import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Text, Button, Heading, Flex, TextField } from '@radix-ui/themes';
import { GlobeIcon } from '@radix-ui/react-icons';

const OnlineConfig: React.FC = () => {
  const navigate = useNavigate();
  const [roomUrl, setRoomUrl] = useState('ws://127.0.0.1:1234');
  const [roomName, setRoomName] = useState('');

  const handleJoinRoom = () => {
    if (!roomUrl || !roomName) return;
    navigate('/online-editor', { state: { roomUrl, roomName } });
  };

  return (
    <Box style={{
      margin: 0,
      padding: '32px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Card size="4" style={{
        width: '100%',
        maxWidth: '500px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      }}>
        <Flex direction="column" gap="4">
          <Box style={{ textAlign: 'center' }}>
            <Heading size="6" style={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              在线协作
            </Heading>
            <Text size="2" color="gray">
              输入房间信息以加入协作编辑
            </Text>
          </Box>

          <Flex direction="column" gap="3">
            <Box>
              <Text as="label" size="2" mb="1" weight="bold">
                服务器地址
              </Text>
              <TextField.Root size="3"
                  placeholder="输入WebSocket服务器地址"
                  value={roomUrl}
                  onChange={(e) => setRoomUrl(e.target.value)}
              />
            </Box>

            <Box>
              <Text as="label" size="2" mb="1" weight="bold">
                房间名称
              </Text>
              <TextField.Root size="3"
                  placeholder="输入房间名称"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
              />
            </Box>
          </Flex>

          <Button
            size="3"
            onClick={handleJoinRoom}
            disabled={!roomUrl || !roomName}
            style={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              transition: 'all 0.3s ease'
            }}
          >
            <GlobeIcon width="16" height="16" />
            加入房间
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};

export default OnlineConfig;