import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './styles/global.css';
import DocumentEditor from './components/Editor';
import Home from './components/Home';
import OnlineEditor from './components/editor/OnlineEditor';
import OnlineConfig from './components/OnlineConfig';

// 获取根元素，并确保其存在
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('找不到root元素');
}

const root = createRoot(rootElement);
root.render(
  <Theme>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<DocumentEditor />} />
        <Route path="/online-editor" element={<OnlineEditor />} />
        <Route path="/online" element={<OnlineConfig />} />
      </Routes>
    </HashRouter>
  </Theme>
);