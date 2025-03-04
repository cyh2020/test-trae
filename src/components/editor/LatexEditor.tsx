import React from 'react';
import { Dialog, TextField, Box, Text, Grid, Button } from '@radix-ui/themes';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useSlate } from 'slate-react';
import { Transforms } from 'slate';

const latexExamples = [
  { label: '分数', latex: '\\frac{a}{b}' },
  { label: '上标', latex: 'x^2' },
  { label: '下标', latex: 'x_i' },
  { label: '根号', latex: '\\sqrt{x}' },
  { label: '积分', latex: '\\int_{a}^{b} x dx' },
  { label: '求和', latex: '\\sum_{i=1}^{n} x_i' },
  { label: '极限', latex: '\\lim_{x \\to \\infty} f(x)' },
  { label: '矩阵', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { label: '希腊字母', latex: '\\alpha \\beta \\gamma \\theta \\pi' },
  { label: '三角函数', latex: '\\sin(x) + \\cos(x)' },
  { label: '微分', latex: '\\frac{d}{dx}f(x)' },
  { label: '偏微分', latex: '\\frac{\\partial f}{\\partial x}' }
];

import { useLatexStore } from '../../stores/latexStore';
import { LatexElement } from '@/types/editor';

const LatexEditor: React.FC = () => {
  const { isOpen, setIsOpen, currentLatex, setCurrentLatex, currentPath, setCurrentPath } = useLatexStore();
  const [latexInput, setLatexInput] = React.useState(currentLatex);
  const [previewHtml, setPreviewHtml] = React.useState('');
  const editor = useSlate();

  React.useEffect(() => {
    if (currentLatex) {
      setLatexInput(currentLatex);
      try {
        const html = katex.renderToString(currentLatex);
        setPreviewHtml(html);
      } catch (error) {
        console.error('LaTeX parsing error:', error);
      }
    }
  }, [currentLatex]);

  const handleClose = () => {
    setIsOpen(false);
    setLatexInput('');
    setPreviewHtml('');
    setCurrentLatex('');
    setCurrentPath([]);
  };

  const handleLatexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setLatexInput(input);
    try {
      const html = katex.renderToString(input);
      setPreviewHtml(html);
    } catch (error) {
      console.error('LaTeX parsing error:', error);
    }
  };

  const handleConfirm = () => {
    if (!latexInput) return;

    const latexNode: LatexElement = {
      type: 'latex',
      latex: latexInput,
      children: [{ text: '' }]
    };

    if (currentPath.length > 0) {
      Transforms.setNodes(editor, latexNode, { at: currentPath });
    } else {
      Transforms.insertNodes(editor, latexNode);
    }

    setCurrentLatex('');
    setCurrentPath([]);
    handleClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content style={{ maxWidth: 600 }}>
        <Dialog.Title>编辑 LaTeX 公式</Dialog.Title>
        <Box p="4">
          <TextField.Root
            placeholder="输入LaTeX公式..."
            value={latexInput}
            onChange={handleLatexChange}
          />

          {previewHtml && (
            <Box mb="3" p="2" style={{ background: 'var(--gray-3)', borderRadius: 'var(--radius-2)' }}>
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </Box>
          )}

          <Text as="p" size="2" weight="medium" mb="2">常用公式示例：</Text>

          <Grid columns="2" gap="2" mb="3">
            {latexExamples.map((example, index) => (
              <Button
                key={index}
                variant="surface"
                onClick={() => {
                  setLatexInput(example.latex);
                  try {
                    const html = katex.renderToString(example.latex);
                    setPreviewHtml(html);
                  } catch (error) {
                    console.error('LaTeX parsing error:', error);
                  }
                }}
                style={{ justifyContent: 'flex-start' }}
              >
                {example.label}
              </Button>
            ))}
          </Grid>

          <Box style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="soft" onClick={handleClose}>取消</Button>
            <Button onClick={handleConfirm} disabled={!latexInput}>确定</Button>
          </Box>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default LatexEditor;