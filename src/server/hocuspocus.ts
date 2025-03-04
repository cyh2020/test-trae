import { Logger } from '@hocuspocus/extension-logger';
import { Server } from '@hocuspocus/server';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import * as Y from 'yjs';

const initialValue = [{ type: 'paragraph', children: [{ text: '' }] }];

// 配置服务器
const server = Server.configure({
  // 配置服务器监听的端口
  port: 1234,
  address: '0.0.0.0',

  // 添加日志
  extensions: [new Logger()],

  async onLoadDocument(data) {
    // 如果文档为空，则加载初始值
    if (data.document.isEmpty('content')) {
      const insertDelta = slateNodesToInsertDelta(initialValue);
      const sharedRoot = data.document.get('content', Y.XmlText);
      sharedRoot.applyDelta(insertDelta);
    }

    return data.document;
  },
});

// 启动服务器
server.enableMessageLogging();
server.listen();

export default server;