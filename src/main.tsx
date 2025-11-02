import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import WaitlistAdmin from './pages/WaitlistAdmin.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/waitlistadmin" element={<WaitlistAdmin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
