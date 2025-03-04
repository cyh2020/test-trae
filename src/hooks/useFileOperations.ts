import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentFiles } from './useRecentFiles';

export const useFileOperations = (initialFilePath: string | null = null, initialContent: string | null = null) => {
  const navigate = useNavigate();
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(initialFilePath);
  const [isModified, setIsModified] = useState(false);
  const { addRecentFile } = useRecentFiles();

  const handleBack = () => {
    navigate('/');
  };

  const handleSaveFile = async (content: string): Promise<boolean> => {
    try {
      const filePath = await window.fileOps.saveFile(content, currentFilePath);
      if (filePath) {
        setCurrentFilePath(filePath);
        setIsModified(false);
        addRecentFile(filePath);
        console.log('文件保存成功');
        return true;
      }
      return false;
    } catch (error) {
      console.error('保存文件失败:', error);
      return false;
    }
  };

  return {
    currentFilePath,
    isModified,
    setIsModified,
    handleBack,
    handleSaveFile
  };
};