import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { TitolProvider } from './context/TitolNavbar';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#363636',
        },
        secondary: {
            main: '#474747',
        },
    },
});
/*
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#363636',
        },
        secondary: {
            main: '#474747',
        },
    },
});
*/
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <TitolProvider>
                <App />
            </TitolProvider>
        </ThemeProvider>
    </BrowserRouter>
);
