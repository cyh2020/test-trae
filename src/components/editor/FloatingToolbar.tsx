import React, { useCallback, useState, useEffect, useRef } from "react";
import { useFocused, useSlate } from "slate-react";
import { Editor as SlateEditor } from "slate";
import { Popover, Button, Flex, Box, Card, Theme } from "@radix-ui/themes";
import { createPortal } from "react-dom";
import {
    FontBoldIcon,
    FontItalicIcon,
    UnderlineIcon,
} from "@radix-ui/react-icons";
import * as Portal from "@radix-ui/react-portal";

const FloatingToolbar: React.FC = () => {
    // const { selectionPosition } = useFloatingToolbar(editor);
    const ref = useRef<HTMLDivElement | null>();
    const editor = useSlate();
    const inFocus = useFocused();

    useEffect(() => {
        const el = ref.current;
        const { selection } = editor;

        if (!el) {
            return;
        }

        if (!selection || !inFocus) {
            el.removeAttribute("style");
            el.style.display = "none";
            return;
        }

        const domSelection = window.getSelection();
        const domRange = domSelection.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();
        el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight - 10}px`;
        el.style.left = `${
            rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
        }px`;
        el.style.position = "absolute";
        el.style.display = "block";
    });

    const toggleMark = (format: string) => {
        const isActive = SlateEditor.marks(editor)?.[format] === true;
        if (isActive) {
            SlateEditor.removeMark(editor, format);
        } else {
            SlateEditor.addMark(editor, format, true);
        }
    };

    // if (!selectionPosition) return null;

    const content = (
        <Portal.Root>
        <Theme>
            <Box ref={ref}>
                <Card size="1">
                    <Flex gap="1">
                        <Button
                            variant="surface"
                            size="1"
                            onClick={() => toggleMark("bold")}
                        >
                            <FontBoldIcon width="16" height="16" />
                        </Button>
                        <Button
                            variant="surface"
                            size="1"
                            onClick={() => toggleMark("italic")}
                        >
                            <FontItalicIcon width="16" height="16" />
                        </Button>
                        <Button
                            variant="surface"
                            size="1"
                            onClick={() => toggleMark("underline")}
                        >
                            <UnderlineIcon width="16" height="16" />
                        </Button>
                    </Flex>
                </Card>
            </Box>
        </Theme>
        </Portal.Root>
    );

    return createPortal(content, document.querySelector("#root")!);
};

export default FloatingToolbar;
