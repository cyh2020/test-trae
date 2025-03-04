import React from 'react';
import { Button } from '@radix-ui/themes';
import { useLatexStore } from '../../stores/latexStore';


const LatexToolbar: React.FC<{}> = () => {
    const {setIsOpen} = useLatexStore();
  return (
    <Button
      color="gray"
      highContrast
      size="1"
      variant="surface"
      onClick={() => setIsOpen(true)}
      title="插入LaTeX公式"
    >
      Latex
    </Button>
  );
};

export default LatexToolbar;