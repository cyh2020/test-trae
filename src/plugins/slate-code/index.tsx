import React, { useCallback } from "react";
import isHotkey from "is-hotkey";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import { Node, Editor, Range, Element, Transforms, NodeEntry, BasePoint } from "slate";
import {
    RenderElementProps,
    useSlate,
    ReactEditor,
    useSlateStatic,
    useSelected,
} from "slate-react";
import { normalizeTokens } from "./plugins/normalizeTokens";
import { Button, DropdownMenu, RadioGroup } from "@radix-ui/themes";
import { CodeIcon } from "@radix-ui/react-icons";
import type { CodeBlockElement } from "../../types/editor";

const ParagraphType = "paragraph";
const CodeBlockType = "code-block";
const CodeLineType = "code-line";

// 渲染代码块
export const CodeElementRender = (props: RenderElementProps) => {
    const { attributes, children, element } = props;
    const editor = useSlateStatic();

    if (element.type === CodeBlockType) {
        const setLanguage = (language: string) => {
            const path = ReactEditor.findPath(editor, element);
            Transforms.setNodes(editor, { language }, { at: path });
        };

        return (
            <div
                {...attributes}
                style={{
                    fontFamily: "monospace",
                    fontSize: "16px",
                    lineHeight: "20px",
                    marginTop: 0,
                    background: "rgba(0, 20, 60, .03)",
                    padding: "5px 13px",
                    position: "relative"
                }}
                spellCheck={false}
            >
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="ghost" size="1">
                            {element.language || "html"}
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        {
                            ['css', 'html', 'java', 'javascript', 
                            'jsx', 'markdown', 'php', 'python',
                            'sql', 'tsx', 'typescript'].map(lang => {
                                return (
                                    <DropdownMenu.Item
                                        key={lang}
                                        onClick={() => setLanguage(lang)}
                                    >
                                        {lang}
                                    </DropdownMenu.Item>
                                );
                            })
                        }
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                {children}
            </div>
        );
    }

    if (element.type === CodeLineType) {
        return (
            <div {...attributes} style={{ position: "relative" }}>
                {children}
            </div>
        );
    }

    const Tag = editor.isInline(element) ? "span" : "div";
    return (
        <Tag {...attributes} style={{ position: "relative" }}>
            {children}
        </Tag>
    );
};

// 创建CodeBlockButton组件，用于插入代码块
export const CodeBlockButton = () => {
    const editor = useSlateStatic();
    const handleClick = () => {
        // 如果在代码块中，将其转换为普通文本
        if (isInCodeBlockActive(editor)) {
            Transforms.unwrapNodes(editor, {
                match: (n) =>
                  !Editor.isEditor(n) &&
                    Element.isElement(n) &&
                    n.type === CodeBlockType,
            });
            return;
        }
        // 否则，插入代码块
        Transforms.wrapNodes(
            editor,
            { type: CodeBlockType, language: "html", children: [] },
            {
                match: (n) => Element.isElement(n) && n.type === ParagraphType,
                split: true,
            }
        );
        Transforms.setNodes(
            editor,
            { type: CodeLineType },
            { match: (n) => Element.isElement(n) && n.type === ParagraphType }
        );
    };

    return (
        <Button
            color="gray"
            highContrast
            size="1"
            variant={isInCodeBlockActive(editor) ? "solid" : "surface"}
            onClick={handleClick}
            title="插入代码块"
        >
            <CodeIcon width="16" height="16" />
        </Button>
    );
};

// 用于高亮代码块中的文本
export const useDecorate = (editor: Editor) => {
    return useCallback(
        ([node, path]) => {
            if (Element.isElement(node) && node.type === CodeLineType) {
                const ranges = editor.nodeToDecorations.get(node) || [];
                return ranges;
            }

            return [];
        },
        [editor.nodeToDecorations]
    );
};

// 将代码块中的文本转换为装饰
const getChildNodeToDecorations = ([
    block,
    blockPath,
]: NodeEntry<CodeBlockElement>) => {
    const nodeToDecorations = new Map<Element, Range[]>();

    const text = block.children.map((line) => Node.string(line)).join("\n");
    const language = block.language;
    const tokens = Prism.tokenize(text, Prism.languages[language]);
    const normalizedTokens = normalizeTokens(tokens); // make tokens flat and grouped by line
    const blockChildren = block.children as Element[];

    for (let index = 0; index < normalizedTokens.length; index++) {
        const tokens = normalizedTokens[index];
        const element = blockChildren[index];

        if (!nodeToDecorations.has(element)) {
            nodeToDecorations.set(element, []);
        }

        let start = 0;
        for (const token of tokens) {
            const length = token.content.length;
            if (!length) {
                continue;
            }

            const end = start + length;

            const path = [...blockPath, index, 0];
            const range = {
                anchor: { path, offset: start },
                focus: { path, offset: end },
                token: true,
                ...Object.fromEntries(token.types.map((type) => [type, true])),
            };

            nodeToDecorations.get(element)!.push(range);

            start = end;
        }
    }

    return nodeToDecorations;
};

// precalculate editor.nodeToDecorations map to use it inside decorate function then
export const SetNodeToDecorations = () => {
    const editor = useSlate();

    const blockEntries = Array.from(
        Editor.nodes(editor, {
            at: [],
            mode: "highest",
            match: (n) => Element.isElement(n) && n.type === CodeBlockType,
        })
    );

    const nodeToDecorations = mergeMaps(
        ...blockEntries.map(getChildNodeToDecorations)
    );

    editor.nodeToDecorations = nodeToDecorations;

    return null;
};

const useOnKeydown = (editor: Editor) => {
    const onKeyDown: React.KeyboardEventHandler = useCallback(
        (e) => {
            if (isHotkey("tab", e)) {
                // handle tab key, insert spaces
                e.preventDefault();

                Editor.insertText(editor, "  ");
            }
        },
        [editor]
    );

    return onKeyDown;
};

const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
    const map = new Map<K, V>();

    for (const m of maps) {
        for (const item of m) {
            map.set(...item);
        }
    }

    return map;
};

// Prismjs theme stored as a string instead of emotion css function.
// It is useful for copy/pasting different themes. Also lets keeping simpler Leaf implementation
// In the real project better to use just css file
export const prismThemeCss = `
/**
 * prism.js default theme for JavaScript, CSS and HTML
 * Based on dabblet (http://dabblet.com)
 * @author Lea Verou
 */

code[class*="language-"],
pre[class*="language-"] {
    color: black;
    background: none;
    text-shadow: 0 1px white;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
}

pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,
code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {
    text-shadow: none;
    background: #b3d4fc;
}

pre[class*="language-"]::selection, pre[class*="language-"] ::selection,
code[class*="language-"]::selection, code[class*="language-"] ::selection {
    text-shadow: none;
    background: #b3d4fc;
}

@media print {
    code[class*="language-"],
    pre[class*="language-"] {
        text-shadow: none;
    }
}

/* Code blocks */
pre[class*="language-"] {
    padding: 1em;
    margin: .5em 0;
    overflow: auto;
}

:not(pre) > code[class*="language-"],
pre[class*="language-"] {
    background: #f5f2f0;
}

/* Inline code */
:not(pre) > code[class*="language-"] {
    padding: .1em;
    border-radius: .3em;
    white-space: normal;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
    color: slategray;
}

.token.punctuation {
    color: #999;
}

.token.namespace {
    opacity: .7;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
    color: #905;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
    color: #690;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
    color: #9a6e3a;
    /* This background color was intended by the author of this theme. */
    background: hsla(0, 0%, 100%, .5);
}

.token.atrule,
.token.attr-value,
.token.keyword {
    color: #07a;
}

.token.function,
.token.class-name {
    color: #DD4A68;
}

.token.regex,
.token.important,
.token.variable {
    color: #e90;
}

.token.important,
.token.bold {
    font-weight: bold;
}
.token.italic {
    font-style: italic;
}

.token.entity {
    cursor: help;
}
`;



// 获取下一行的缩进量
const getNextIndent = (text: string): number => {
  return Math.max(text.search(/\S/), 0);
};

// 创建代码块插件
export const withCodeBlock = (editor: Editor) => {
  const { insertBreak, insertText, onKeyDown } = editor;

  // 处理Tab键
  editor.insertText = (text) => {
    const { selection } = editor;

    if (selection && text === '\t' && isInCodeBlockActive(editor)) {
      editor.insertText('  ');
      return;
    }

    insertText(text);
  };

  return editor;
};

// 检查当前是否在代码行中
const isInCodeBlockActive = (editor: Editor) => {
    // 获取当前光标所在的node，或者是光标选中的node
    const { selection } = editor;
    if (!selection) return false;
    if (!Range.isCollapsed(selection as Range)) {
        return false;
    }
    
    // 检查当前节点是否在代码块内
    return Editor.above(editor, {
        match: n => Element.isElement(n) && (n.type === CodeLineType || n.type === CodeBlockType),
    }) !== undefined;
};
