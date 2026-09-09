import React from 'react';
import ReactDOM from 'react-dom/client';
import { BoxmockApp } from './BoxmockApp';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BoxmockApp />
  </React.StrictMode>
);
