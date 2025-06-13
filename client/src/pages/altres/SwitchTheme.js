import React, { useContext } from 'react';
import { ThemeContext } from '../../index';
import { ButtonGroup, Button } from '@mui/material';

const SwitchTheme = () => {
    const { theme, changeTheme } = useContext(ThemeContext);

    return (
        <ButtonGroup variant="outlined" aria-label="selecció de tema">
            <Button
                onClick={() => changeTheme('light')}
                variant={theme === 'light' ? 'contained' : 'outlined'}
            >
                Clar
            </Button>
            <Button
                onClick={() => changeTheme('dark')}
                variant={theme === 'dark' ? 'contained' : 'outlined'}
            >
                Fosc
            </Button>
            <Button
                onClick={() => changeTheme('system')}
                variant={theme === 'system' ? 'contained' : 'outlined'}
            >
                Sistema
            </Button>
        </ButtonGroup>
    );
};

export default SwitchTheme;
