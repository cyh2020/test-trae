import React, { useMemo, useEffect } from 'react';
import { createEditor, Editor, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withYjs, YjsEditor, withYHistory } from '@slate-yjs/core';
import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';
import { Box, Button, Flex, Heading } from '@radix-ui/themes';
import { ArrowLeftIcon, FileTextIcon,
DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import EditorToolbar from './EditorToolbar';
import FloatingToolbar from './FloatingToolbar';
import ColorToolbar from './ColorToolbar';
import FontSizeToolbar from './FontSizeToolbar';
import LatexToolbar from './LatexToolbar';
import AlignmentToolbar from './AlignmentToolbar';
import TodoListToolbar from './TodoListToolbar';
import LinkToolbar from './LinkToolbar';
import ImageToolbar from './ImageToolbar';
import MermaidToolbar from './MermaidToolbar';
import ContainerToolbar from './ContainerToolbar';
import { useEditorHistory } from '../../hooks/useEditorHistory';
import { useRenderElement } from '../../hooks/useRenderElement';
import { useRenderLeaf } from '../../hooks/useRenderLeaf';
import { useEditorState } from '../../hooks/useEditorState';
import { useLocation, useNavigate } from 'react-router-dom';
import LatexEditor from './LatexEditor';
import MermaidEditor from './MermaidEditor';
import { withContainer, withRecursive } from '../../plugins/withContainer';
import { CodeBlockButton, prismThemeCss, SetNodeToDecorations, useDecorate, withCodeBlock } from '../../plugins/slate-code';
import { withBlockquote, BlockquoteButton } from "../../plugins/slate-blockquote";

const OnlineEditor: React.FC = () => {
  const location = useLocation();
  const { roomUrl, roomName } = location.state || {};

  if (!roomUrl || !roomName) {
    return (
      <Box style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <Card>
          <Text>房间信息无效，请返回重试</Text>
          <Button onClick={() => navigate('/online')} style={{ marginTop: '16px' }}>
            <ArrowLeftIcon width="16" height="16" />
            返回
          </Button>
        </Card>
      </Box>
    );
  }
  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: roomUrl,
        name: roomName,
        connect: false,
        // document: new Y.Doc(),
      }),
    [roomUrl, roomName]
  );

  const editor = useMemo(() => {
    const sharedType = provider.document.get('content', Y.XmlText);
    const e = withBlockquote(withCodeBlock(withRecursive(withContainer(withYHistory(withYjs(withReact(createEditor()), sharedType))))));

    // 确保编辑器始终至少有一个有效的子节点
    const { normalizeNode } = e;
    e.normalizeNode = (entry) => {
      const [node] = entry;
      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry);
      }

      Transforms.insertNodes(
        e,
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
        { at: [0] }
      );
    };

    return e;
  }, [provider.document]);

  useEffect(() => {
    provider.connect();
    return () => provider.disconnect();
  }, [provider]);

  useEffect(() => {
    YjsEditor.connect(editor);
    return () => YjsEditor.disconnect(editor);
  }, [editor]);

  const { editorWithHistory, handleUndo, handleRedo, handleKeyDown, canUndo, canRedo } = useEditorHistory(editor);
  const { value, setValue } = useEditorState();
  const renderElement = useRenderElement(editorWithHistory);
  const renderLeaf = useRenderLeaf(editorWithHistory);
  const decorate = useDecorate(editorWithHistory);
  const navigate = useNavigate();

  return (
    <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box style={{
        padding: '8px 16px',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--color-background)',
        zIndex: 101,
        borderBottom: '1px solid var(--gray-6)'
      }}>
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeftIcon width="16" height="16" />
            </Button>
            <Heading size="3" style={{ marginLeft: 10 }}>
              {roomName} (在线协作)
            </Heading>
          </Flex>
          <Flex gap="2">
            <Button variant="soft" disabled={!canUndo} onClick={handleUndo}>
              <DoubleArrowLeftIcon width="16" height="16" />
            </Button>
            <Button variant="soft" disabled={!canRedo} onClick={handleRedo}>
              <DoubleArrowRightIcon width="16" height="16" />
            </Button>
          </Flex>
        </Flex>
      </Box>
      <Box style={{
        padding: '8px',
        top: 0,
        backgroundColor: 'var(--color-background)',
        zIndex: 100,
        borderBottom: '1px solid var(--gray-6)'
      }}>
        <Slate editor={editorWithHistory} value={value} onChange={setValue}>
          <Flex align="center" gap="2">
            <EditorToolbar />
            <ColorToolbar />
            <FontSizeToolbar />
            <AlignmentToolbar />
            <LatexToolbar />
            <MermaidToolbar />
            <TodoListToolbar />
            <LinkToolbar />
            <ImageToolbar />
            <CodeBlockButton />
            <ContainerToolbar />
            <BlockquoteButton />
          </Flex>
          <Box style={{ 
            marginTop: '8px', 
            padding: '8px', 
            border: '1px solid var(--gray-6)', 
            borderRadius: '6px', 
            minHeight: 'calc(100vh - 130px)' 
          }}>
            <SetNodeToDecorations />
            <Editable
              decorate={decorate}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={handleKeyDown}
              placeholder="开始输入内容..."
            />
            <style>{prismThemeCss}</style>
          </Box>
          {/* <FloatingToolbar /> */}
          <LatexEditor />
          <MermaidEditor />
        </Slate>
      </Box>
    </Box>
  );
};

export default OnlineEditor;