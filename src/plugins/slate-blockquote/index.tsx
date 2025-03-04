import React, { useCallback } from "react";
import { Node, Editor, Range, Element, Transforms } from "slate";
import {
    RenderElementProps,
    useSlate,
    ReactEditor,
    useSlateStatic,
} from "slate-react";
import { Button } from "@radix-ui/themes";
import { QuoteIcon } from "@radix-ui/react-icons";

const ParagraphType = "paragraph";
const BlockquoteType = "blockquote";

// 渲染引用块
export const BlockquoteElementRender = (props: RenderElementProps) => {
    const { attributes, children, element } = props;

    if (element.type === BlockquoteType) {
        return (
            <blockquote
                {...attributes}
                style={{
                    borderLeft: "3px solid #ddd",
                    paddingLeft: "10px",
                    marginLeft: "10px",
                    color: "#666",
                    fontStyle: "italic",
                    position: "relative"
                }}
            >
                {children}
            </blockquote>
        );
    }

    return null;
};

// 创建BlockquoteButton组件，用于插入引用块
export const BlockquoteButton = () => {
    const editor = useSlateStatic();
    const handleClick = () => {
        // 如果在引用块中，将其转换为普通文本
        if (isInBlockquoteActive(editor)) {
            Transforms.unwrapNodes(editor, {
                match: (n) =>
                  !Editor.isEditor(n) &&
                    Element.isElement(n) &&
                    n.type === BlockquoteType,
            });
            return;
        }
        // 否则，插入引用块
        Transforms.wrapNodes(
            editor,
            { type: BlockquoteType, children: [] },
            {
                match: (n) => Element.isElement(n) && n.type === ParagraphType,
                split: true,
            }
        );
    };

    return (
        <Button
            color="gray"
            highContrast
            size="1"
            variant={isInBlockquoteActive(editor) ? "solid" : "surface"}
            onClick={handleClick}
            title="插入引用块"
        >
            <QuoteIcon width="16" height="16" />
        </Button>
    );
};

// 创建引用块插件
export const withBlockquote = (editor: Editor) => {
    const { normalizeNode } = editor;

    // editor.normalizeNode = ([node, path]) => {
    //     if (Element.isElement(node) && node.type === BlockquoteType) {
    //         // 确保引用块内的内容是段落
    //         for (const [child, childPath] of Node.children(editor, path)) {
    //             if (Element.isElement(child) && child.type !== ParagraphType) {
    //                 Transforms.setNodes(
    //                     editor,
    //                     { type: ParagraphType },
    //                     { at: childPath }
    //                 );
    //             }
    //         }
    //     }

    //     // 调用原始的normalizeNode
    //     normalizeNode([node, path]);
    // };

    return editor;
};

// 检查当前是否在引用块中
const isInBlockquoteActive = (editor: Editor) => {
    const { selection } = editor;
    if (!selection) return false;
    
    // 检查当前节点是否在引用块内
    return Editor.above(editor, {
        match: n => Element.isElement(n) && n.type === BlockquoteType,
    }) !== undefined;
};