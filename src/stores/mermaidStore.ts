import { create } from 'zustand';
import { Path } from 'slate';

interface MermaidStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentCode: string;
  setCurrentCode: (code: string) => void;
  currentPath: Path;
  setCurrentPath: (path: Path) => void;
}

export const useMermaidStore = create<MermaidStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  currentCode: '',
  setCurrentCode: (code) => set({ currentCode: code }),
  currentPath: [],
  setCurrentPath: (path) => set({ currentPath: path }),
}));