import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { ContainerElement } from './container';

export type ParagraphElement = {
  type: 'paragraph';
  children: CustomText[];
  indent?: number;
};

export type OrderedListElement = {
  type: 'ordered-list';
  children: ListItemElement[];
  indent?: number;
};

export type UnorderedListElement = {
  type: 'unordered-list';
  children: ListItemElement[];
  indent?: number;
};

export type ListItemElement = {
  type: 'list-item';
  children: CustomText[];
  number?: number;
};

export type TodoListElement = {
  type: 'todo-list';
  children: TodoItemElement[];
  indent?: number;
};

export type TodoItemElement = {
  type: 'todo-item';
  checked: boolean;
  children: CustomText[];
};

export type LatexElement = {
  type: 'latex';
  latex: string;
  children: CustomText[];
};

export type MermaidElement = {
  type: 'mermaid';
  code: string;
  isEditMode?: boolean;
  children: CustomText[];
};


export type ImageElement = {
  type: 'image';
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  children: CustomText[];
};

export type RecursiveElement = {
  type: 'recursive';
  displayChidren: Boolean;
  children: CustomElement[];
};

export type CodeBlockElement = {
  type: 'code-block'
  language: string
  children: Descendant[]
}

export type CodeLineElement = {
  type: 'code-line'
  children: Descendant[]
}

export type BlockquoteElement = {
  type: 'blockquote';
  children: Descendant[];
};
  

export type CustomElement = ParagraphElement | OrderedListElement
  | UnorderedListElement | ListItemElement
  | TodoListElement | TodoItemElement
  | LatexElement | MermaidElement | ImageElement
  | ContainerElement | RecursiveElement
  | CodeBlockElement | CodeLineElement
  | BlockquoteElement;

export type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  link?: string;
  superscript?: boolean;
  subscript?: boolean;
};

export type CustomText = FormattedText;


export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    nodeToDecorations?: Map<Element, Range[]>
  }


declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export interface FileOperations {
  saveFile: (content: string, filePath?: string | null) => Promise<string>;
  openFile: () => Promise<{ filePath: string; content: string }>;
}

declare global {
  interface Window {
    fileOps: FileOperations;
  }
}