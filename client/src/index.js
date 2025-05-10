import React, { useState, createContext, useEffect } from 'react';
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
    // Funció per detectar el tema del sistema
    const detectSystemTheme = () => {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'system') {
            return detectSystemTheme();
        }
        return savedTheme || 'light';
    });

    // Efecte per detectar canvis en el tema del sistema
    useEffect(() => {
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            const handleChange = () => {
                // Actualitzem el tema de l'aplicació però mantenim 'system' com a preferència
                localStorage.setItem('actualTheme', detectSystemTheme());
                // Forcem un re-render
                setTheme('system');
            };
            
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    // Guardem les preferències al localStorage
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    };

    // Determinem quin tema mostrar
    const displayTheme = theme === 'system' ? detectSystemTheme() : theme;

    return (
        <ThemeContext.Provider value={{ theme, displayTheme, changeTheme }}>
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
                {({ displayTheme }) => (
                    <ThemeProvider theme={displayTheme === 'light' ? lightTheme : darkTheme}>
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
