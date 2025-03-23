import React, { useState} from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import EditarTronc from './EditarTronc';
import EditarPinya from './EditarPinya';
import '../../styles/EditarCastell.css';
import '../../styles/Tronc.css';

function EditarCastell({assaig}) {
    const [value, setValue] = useState('tronc');

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <div>

            <Box sx={{ width: '100%' }}>
                <Tabs
                    variant="fullWidth"
                    value={value}
                    onChange={handleChangeTab}
                >
                    <Tab value="tronc" label="TRONC" />
                    <Tab value="pinya" label="PINYA" />
                </Tabs>
            </Box>

            {value === 'tronc' ? (
                <EditarTronc assaig={assaig} />
            ) : (
                <EditarPinya assaig={assaig} />
            )}

        </div>
    );
}

export default EditarCastell;