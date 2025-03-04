import React from 'react';
import { RenderElementProps, ReactEditor } from 'slate-react';
import { ContainerLayout } from '../../../types/container';
import { useRenderElement } from '../../../hooks/useRenderElement';
import { CustomElement } from '../../../types/editor';

interface RenderContainerElementProps extends RenderElementProps {
  style: React.CSSProperties;
  editor?: ReactEditor;
}

const getLayoutStyle = (layout: ContainerLayout): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    display: 'grid',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    margin: '0.5em 0'
  };

  switch (layout) {
    case 'two-rows':
      return {
        ...baseStyle,
        gridTemplateRows: 'repeat(2, 1fr)'
      };
    case 'three-rows':
      return {
        ...baseStyle,
        gridTemplateRows: 'repeat(3, 1fr)'
      };
    case 'four-rows':
      return {
        ...baseStyle,
        gridTemplateRows: 'repeat(4, 1fr)'
      };
    case 'two-columns':
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(2, 1fr)'
      };
    case 'three-columns':
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(3, 1fr)'
      };
    case 'four-columns':
      return {
        ...baseStyle,
        gridTemplateColumns: 'repeat(4, 1fr)'
      };
    case 'one-left-two-right':
      return {
        ...baseStyle,
        gridTemplateColumns: '1fr 2fr',
        display: 'grid',
      };
    case 'one-left-three-right':
      return {
        ...baseStyle,
        gridTemplateColumns: '1fr 3fr',
        display: 'grid',
      };
    default:
      return baseStyle;
  }
};

export const RenderContainerElement: React.FC<RenderContainerElementProps> = ({ attributes, children, element, style, editor }) => {
  const containerStyle = getLayoutStyle(element.layout);
  
  // 创建一个递归渲染元素的函数
  // const renderNestedElement = (nestedElement: CustomElement) => {
  //   if (!editor) return null;
    
  //   // 使用与父编辑器相同的渲染逻辑
  //   const renderElement = useRenderElement(editor);
    
  //   // 创建一个模拟的props对象传递给渲染函数
  //   const nestedProps: RenderElementProps = {
  //     attributes: { 'data-slate-node': 'element', ref: null as any },
  //     children: [],
  //     element: nestedElement
  //   };
    
  //   return renderElement(nestedProps);
  // };

  return (
    <div {...attributes} style={style}>
      <div style={containerStyle}>
        {children}
      </div>
    </div>
  );
};