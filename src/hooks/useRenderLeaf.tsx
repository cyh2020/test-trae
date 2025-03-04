import { useCallback, useState } from 'react';
import { RenderLeafProps, ReactEditor } from 'slate-react';
import LinkHoverMenu from '../components/editor/LinkHoverMenu';

export const useRenderLeaf = (editor: ReactEditor) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hoverText, setHoverText] = useState('');
  const [hoverUrl, setHoverUrl] = useState('');


  return useCallback((props: RenderLeafProps) => {

    const { attributes, children, leaf } = props
    const { text, ...rest } = leaf


    let style = { ...attributes.style };
    if (props.leaf.bold) {
      style.fontWeight = 'bold';
    }
    if (props.leaf.italic) {
      style.fontStyle = 'italic';
    }
    if (props.leaf.underline) {
      style.textDecoration = 'underline';
    }
    if (props.leaf.strikethrough) {
      style.textDecoration = props.leaf.underline ? 'underline line-through' : 'line-through';
    }
    if (props.leaf.color) {
      style.color = props.leaf.color;
    }
    if (props.leaf.backgroundColor) {
      style.backgroundColor = props.leaf.backgroundColor;
    }
    if (props.leaf.fontSize) {
      style.fontSize = props.leaf.fontSize;
    }
    if (props.leaf.superscript) {
      style.verticalAlign = 'super';
      style.fontSize = '0.75em';
    }
    if (props.leaf.subscript) {
      style.verticalAlign = 'sub';
      style.fontSize = '0.75em';
    }
    if (props.leaf.link) {
      return (
        <span {...props.attributes} style={style}>
          <a
            href={props.leaf.link}
            onClick={(e) => {
              e.preventDefault();
              window.shell.openExternal(props.leaf.link);
            }}
            style={{
              color: '#1976d2',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
              e.currentTarget.style.color = '#2196f3';
              setAnchorEl(e.currentTarget);
              setHoverText(e.currentTarget.textContent || '');
              setHoverUrl(props.leaf.link);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
              e.currentTarget.style.color = '#1976d2';
              setTimeout(() => {
                setAnchorEl(null);
              }, 200);
            }}
          >
            {props.children}
          </a>
          <LinkHoverMenu
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            editor={editor}
            initialText={hoverText}
            initialUrl={hoverUrl}
          />
        </span>
      );
    }
    return (
      <span {...attributes} style={style} className={Object.keys(rest).join(' ')}>
        {children}
      </span>
    );
  }, []);
};