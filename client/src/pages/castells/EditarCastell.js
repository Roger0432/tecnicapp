import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tab, Tabs, Box } from '@mui/material';
import EditarTronc from './EditarTronc';
import EditarPinya from './EditarPinya';
import '../../styles/Tronc.css';
import { useTitol } from '../../context/TitolNavbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function EditarCastell({assaig}) {
    const { id } = useParams();
    const [value, setValue] = useState('tronc');
    const [castellData, setCastellData] = useState([]);
    const { setTitol } = useTitol();

    useEffect(() => {

        fetch(`${BACKEND_URL}/castell/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                setCastellData(data.castell);
                setTitol(data.castell.nom);
            } else {
                console.error(data.msg);
            }
        })
    }, [setTitol, id]);

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <Box>

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
                <EditarTronc castell={castellData} />
            ) : (
                <EditarPinya castell={castellData} />
            )}

        </Box>
    );
}

export default EditarCastell;