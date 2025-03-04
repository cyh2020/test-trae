import { useCallback } from 'react';
import { RenderElementProps, ReactEditor } from 'slate-react';
import 'katex/dist/katex.min.css';
import { useLatexStore } from '../stores/latexStore';
import { useMermaidStore } from '../stores/mermaidStore';
import { RenderListElement } from '../components/editor/renders/RenderListElement';
import { RenderTodoElement } from '../components/editor/renders/RenderTodoElement';
import { RenderLatexElement } from '../components/editor/renders/RenderLatexElement';
import { RenderImageElement } from '../components/editor/renders/RenderImageElement';
import { RenderMermaidElement } from '../components/editor/renders/RenderMermaidElement';
import { RenderContainerElement } from '../components/editor/renders/RenderContainerElement';
import { RenderRecursiveElement } from '../components/editor/renders/RenderRecursiveElement';
import { LatexElement } from '@/types/editor';
import { CodeElementRender } from '../plugins/slate-code';
import { BlockquoteElementRender } from '../plugins/slate-blockquote';

export const useRenderElement = (editor: ReactEditor) => {
  const { setIsOpen: setLatexEditorOpen, setCurrentLatex, setCurrentPath } = useLatexStore();
  const { setIsOpen: setMermaidEditorOpen, setCurrentCode, setCurrentPath: setMermaidPath } = useMermaidStore();

  return useCallback((props: RenderElementProps) => {
    const style = { ...props.attributes.style };
    style.marginLeft = `${(props.element.indent || 0) * 2}em`;

    switch (props.element.type) {
      case 'ordered-list':
      case 'unordered-list':
      case 'list-item':
        return RenderListElement({ ...props, style });

      case 'todo-list':
      case 'todo-item':
        return RenderTodoElement({ ...props, style, editor });

      case 'latex':
        return RenderLatexElement({
          ...props,
          style,
          onEdit: () => {
            const path = ReactEditor.findPath(editor, props.element);
            setCurrentLatex((props.element as LatexElement).latex);
            setCurrentPath(path);
            setLatexEditorOpen(true);
          }
        });

      case 'image':
        return RenderImageElement({ ...props, style });

      case 'mermaid':
        return RenderMermaidElement({
          ...props,
          style,
          onEdit: () => {
            const path = ReactEditor.findPath(editor, props.element);
            setCurrentCode(props.element.code);
            setMermaidPath(path);
            setMermaidEditorOpen(true);
          }
        });

      case 'code-block':
        return CodeElementRender(props)

      case 'blockquote':
        return BlockquoteElementRender(props);

      case 'container':
        return RenderContainerElement({ ...props, style });
      case 'recursive':
        return RenderRecursiveElement({ ...props, style, editor });
      default:
        const blockStyle = { ...style };
        if (props.element.textAlign) {
          blockStyle.textAlign = props.element.textAlign;
        }
        return (
          <div {...props.attributes} style={blockStyle}>
            {props.children}
          </div>
        );
    }
  }, [editor, setLatexEditorOpen, setCurrentLatex, setCurrentPath, setMermaidEditorOpen, setCurrentCode, setMermaidPath]);
};