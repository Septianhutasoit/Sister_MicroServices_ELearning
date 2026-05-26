import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Sekarang ini benar
import App from './App'; // Sesuaikan jika ekstensinya .tsx
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);