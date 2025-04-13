import React, { useState, createContext } from 'react';
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

export const ThemeContext = createContext();

const ThemeProviderWrapper = ({ children }) => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#363636',
        },
        secondary: {
            main: '#ffffff',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: (theme) => `
                :root {
                    --primary-main: ${theme.palette.primary.main};
                    --secondary-main: ${theme.palette.secondary.main};
                }
            `,
        },
    }
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
        },
        secondary: {
            main: '#363636',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: (theme) => `
                :root {
                    --primary-main: ${theme.palette.primary.main};
                    --secondary-main: ${theme.palette.secondary.main};
                }
            `,
        },
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemeProviderWrapper>
            <ThemeContext.Consumer>
                {({ theme }) => (
                    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                        <CssBaseline />
                        <TitolProvider>
                            <App />
                        </TitolProvider>
                    </ThemeProvider>
                )}
            </ThemeContext.Consumer>
        </ThemeProviderWrapper>
    </BrowserRouter>
);
