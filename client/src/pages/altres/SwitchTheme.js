import React, { useContext } from 'react';
import { ThemeContext } from '../../index';
import { ButtonGroup, Button } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

const SwitchTheme = () => {
    const { theme, changeTheme } = useContext(ThemeContext);

    return (
        <ButtonGroup variant="outlined" aria-label="selecció de tema">
            <Button 
                startIcon={<LightModeIcon />}
                onClick={() => changeTheme('light')}
                variant={theme === 'light' ? 'contained' : 'outlined'}
            >
                Clar
            </Button>
            <Button 
                startIcon={<DarkModeIcon />}
                onClick={() => changeTheme('dark')}
                variant={theme === 'dark' ? 'contained' : 'outlined'}
            >
                Fosc
            </Button>
            <Button 
                startIcon={<SettingsBrightnessIcon />}
                onClick={() => changeTheme('system')}
                variant={theme === 'system' ? 'contained' : 'outlined'}
            >
                Sistema
            </Button>
        </ButtonGroup>
    );
};

export default SwitchTheme;