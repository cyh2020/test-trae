import { useMemo, useState, useEffect } from 'react';
import { withHistory } from 'slate-history';
import { CustomEditor } from '../types/editor';
import { useEditorKeyBinding } from './useEditorKeyBinding';

export const useEditorHistory = (editor: CustomEditor) => {
  const editorWithHistory = useMemo(() => withHistory(editor), [editor]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const updateHistoryState = () => {
      setCanUndo(editorWithHistory.history.undos.length > 0);
      setCanRedo(editorWithHistory.history.redos.length > 0);
    };

    updateHistoryState();
    const observer = new MutationObserver(updateHistoryState);
    observer.observe(document.body, { subtree: true, childList: true });

    return () => observer.disconnect();
  }, [editorWithHistory]);

  const handleUndo = () => {
    if (canUndo) {
      editorWithHistory.undo();
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      editorWithHistory.redo();
    }
  };

  const { handleKeyDown } = useEditorKeyBinding(editorWithHistory, handleUndo, handleRedo);

  return {
    editorWithHistory,
    handleUndo,
    handleRedo,
    handleKeyDown,
    canUndo,
    canRedo
  };
};