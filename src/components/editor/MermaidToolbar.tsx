import React from 'react';
import { Button } from '@radix-ui/themes';
import mermaid from 'mermaid';
import { useMermaidStore } from '../../stores/mermaidStore';

// 初始化mermaid配置
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose'
});

const MermaidToolbar: React.FC = () => {
  const { setIsOpen } = useMermaidStore();

  return (
    <Button
      variant="surface"
      onClick={() => setIsOpen(true)}
      title="插入流程图"
      color="gray"
      highContrast
      size="1"
    >
      Mermaid
    </Button>
  );
};

export default MermaidToolbar;