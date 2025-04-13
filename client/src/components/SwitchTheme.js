import React, { useContext } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { ThemeContext } from '../index';

const SwitchTheme = () => {
    const { toggleTheme } = useContext(ThemeContext);

    return (
        <FormGroup>
            <FormControlLabel
                control={<Switch sx={{ ml: 1 }} onChange={toggleTheme} />}
                label="Canviar tema"
            />
        </FormGroup>
    );
};

export default SwitchTheme;