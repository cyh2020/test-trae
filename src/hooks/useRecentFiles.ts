import { useState, useEffect } from 'react';

const RECENT_FILES_KEY = 'recentFiles';
const MAX_RECENT_FILES = 10;

interface RecentFile {
  path: string;
  name: string | undefined;
  lastEdited: string;
}

export const useRecentFiles = () => {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

  useEffect(() => {
    loadRecentFiles();
  }, []);

  const loadRecentFiles = () => {
    try {
      const savedFiles = localStorage.getItem(RECENT_FILES_KEY);
      if (savedFiles) {
        setRecentFiles(JSON.parse(savedFiles));
      }
    } catch (error) {
      console.error('加载最近文件列表失败:', error);
    }
  };

  const addRecentFile = (filePath: string) => {
    try {

      const newRecentFiles: RecentFile[] = recentFiles
        .filter((file: RecentFile) => file.path !== filePath);
      
      const newFile: RecentFile = {
        path: filePath,
        name: filePath.split('/').pop(),
        lastEdited: new Date().toLocaleString()
      };
      
      newRecentFiles.unshift(newFile);

      // 保持最近文件列表不超过最大限制
      if (newRecentFiles.length > MAX_RECENT_FILES) {
        newRecentFiles.pop();
      }

      setRecentFiles(newRecentFiles);
      localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(newRecentFiles));
    } catch (error) {
      console.error('更新最近文件列表失败:', error);
    }
  };

  return {
    recentFiles,
    addRecentFile
  };
};