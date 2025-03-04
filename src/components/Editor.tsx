import React, { useMemo } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { useLocation } from 'react-router-dom';
import { Box, Button, Flex, Heading } from '@radix-ui/themes';
import { ArrowLeftIcon, ReloadIcon, FileTextIcon,
DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import EditorToolbar from './editor/EditorToolbar';
import FloatingToolbar from './editor/FloatingToolbar';
import ColorToolbar from './editor/ColorToolbar';
import FontSizeToolbar from './editor/FontSizeToolbar';
import LatexToolbar from './editor/LatexToolbar';
import AlignmentToolbar from './editor/AlignmentToolbar';
import TodoListToolbar from './editor/TodoListToolbar';
import LinkToolbar from './editor/LinkToolbar';
import ImageToolbar from './editor/ImageToolbar';
import MermaidToolbar from './editor/MermaidToolbar';
import ContainerToolbar from './editor/ContainerToolbar';
import RecursiveToolbar from './editor/RecursiveToolbar';
import { useFileOperations } from '../hooks/useFileOperations';
import { useEditorHistory } from '../hooks/useEditorHistory';
import { useRenderElement } from '../hooks/useRenderElement';
import { useRenderLeaf } from '../hooks/useRenderLeaf';
import { useEditorState } from '../hooks/useEditorState';
import { useNavigate } from 'react-router-dom';
import LatexEditor from './editor/LatexEditor';
import MermaidEditor from './editor/MermaidEditor';
import { withContainer, withRecursive } from '../plugins/withContainer';
import { CodeBlockButton, prismThemeCss, SetNodeToDecorations, useDecorate, withCodeBlock } from '../plugins/slate-code';
import { withBlockquote, BlockquoteButton } from "../plugins/slate-blockquote";

const Editor: React.FC = () => {
  const editor = useMemo(() => withBlockquote(withCodeBlock(withRecursive(withContainer(withReact(createEditor()))))), []);
  const { editorWithHistory, handleUndo, handleRedo, handleKeyDown, canUndo, canRedo } = useEditorHistory(editor);
  const location = useLocation();
  const { value, setValue } = useEditorState(location.state?.content);
  const { currentFilePath, setIsModified, handleBack, handleSaveFile } = useFileOperations(
    location.state?.filePath,
    location.state?.content
  );
  const renderElement = useRenderElement(editorWithHistory);
  const renderLeaf = useRenderLeaf(editorWithHistory);
  const decorate = useDecorate(editorWithHistory)
  const navigate = useNavigate();

  const handleSave = async () => {
    const content = JSON.stringify(value);
    const success = await handleSaveFile(content);
    if (success) {
      navigate('/');
    }
  };

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
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeftIcon width="16" height="16" />
            </Button>
            <Heading size="3" style={{ marginLeft: 10 }}>
              {currentFilePath || '新文档'}
            </Heading>
          </Flex>
          <Flex gap="2">
            <Button variant="soft" disabled={!canUndo} onClick={handleUndo}>
              <DoubleArrowLeftIcon width="16" height="16" />
            </Button>
            <Button variant="soft" disabled={!canRedo} onClick={handleRedo}>
              <DoubleArrowRightIcon width="16" height="16" />
            </Button>
            <Button variant="soft" onClick={handleSave}>
              <FileTextIcon width="16" height="16" />
              保存
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
        <Slate editor={editorWithHistory} value={value} onChange={value => {
          setValue(value);
          setIsModified(true);
        }}>
          <Flex align="center" gap="3">
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
            <RecursiveToolbar />
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

export default Editor;