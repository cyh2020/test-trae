import { Path } from 'slate';
import { create } from 'zustand';

interface LatexState {
  isOpen: boolean;
  currentLatex: string;
  setIsOpen: (isOpen: boolean) => void;
  setCurrentLatex: (latex: string) => void;
  setCurrentPath: (path: Path) => void;
  currentPath: Path;
  reset: () => void;
}

export const useLatexStore = create<LatexState>((set) => ({
  isOpen: false,
  currentLatex: '',
  currentPath: [],
  setIsOpen: (isOpen) => set({ isOpen }),
  setCurrentLatex: (currentLatex) => set({ currentLatex }),
  reset: () => set({ isOpen: false, currentLatex: '' }),
  setCurrentPath: (path) => set({ currentPath: path })
}));