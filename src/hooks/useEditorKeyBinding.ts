import { CustomEditor } from '../types/editor';
import { useEditorIndent } from './useEditorIndent';
import { useEditorEnterKey } from './useEditorEnterKey';

export const useEditorKeyBinding = (editor: CustomEditor, handleUndo: () => void, handleRedo: () => void) => {
  const { handleIndent, handleOutdent } = useEditorIndent(editor);
  const { handleEnterKey } = useEditorEnterKey(editor);

  const handleKeyDown = (event: KeyboardEvent) => {
    // 处理回车键
    handleEnterKey(event);

    if (event.key === 'Tab') {
      event.preventDefault();
      if (event.shiftKey) {
        handleOutdent();
      } else {
        handleIndent();
      }
      return;
    }

    if (!event.ctrlKey) return;

    switch (event.key) {
      case 'z':
        event.preventDefault();
        if (event.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        break;
      case 'y':
        event.preventDefault();
        handleRedo();
        break;
    }
  };

  return {
    handleKeyDown
  };
};