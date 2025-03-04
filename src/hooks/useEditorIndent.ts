import { Transforms } from 'slate';
import { Editor } from 'slate';
import { CustomEditor } from '../types/editor';

export const useEditorIndent = (editor: CustomEditor) => {
  const handleIndent = () => {
    Transforms.setNodes(
      editor,
      { indent: (node: any) => (node.indent || 0) + 1 },
      { match: n => Editor.isBlock(editor, n) }
    );
  };

  const handleOutdent = () => {
    Transforms.setNodes(
      editor,
      { indent: (node: any) => Math.max((node.indent || 0) - 1, 0) },
      { match: n => Editor.isBlock(editor, n) }
    );
  };

  return {
    handleIndent,
    handleOutdent
  };
};