import { useState } from 'react';
import { CustomElement } from '../types/editor';

export const useEditorState = (initialContent: string | null) => {
  const [value, setValue] = useState<CustomElement[]>(() => {
    if (initialContent) {
      try {
        return JSON.parse(initialContent);
      } catch (error) {
        console.error('解析文件内容失败:', error);
      }
    }
    return [
      {
        type: 'paragraph',
        children: [{ text: '' }]
      }
    ];
  });

  const [selectedElement, setSelectedElement] = useState<CustomElement | null>(null);

  return {
    value,
    setValue,
    selectedElement,
    setSelectedElement
  };
};