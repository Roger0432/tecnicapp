import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab, Typography, TextField, InputAdornment } from '@mui/material';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useTitol } from '../../context/TitolNavbar';
import CardEsdeveniment from './CardEsdeveniment';
import Grid from '@mui/material/Grid';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const normalitzarText = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
};

const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}`);
};

function Esdeveniments({ assaig }) {
    const [esdevenimentsFuturs, setEsdevenimentsFuturs] = useState([]);
    const [esdevenimentsPassats, setEsdevenimentsPassats] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [cercaText, setCercaText] = useState('');
    const navigate = useNavigate();
    const { setTitol } = useTitol();

    const esdevenimentsFutursFiltrats = useMemo(() => {
        if (!cercaText.trim()) return esdevenimentsFuturs;

        const textNormalitzat = normalitzarText(cercaText);
        return esdevenimentsFuturs.filter((esdeveniment) => {
            const nomNormalitzat = normalitzarText(esdeveniment.nom);
            const llocNormalitzat = normalitzarText(esdeveniment.lloc);

            return (
                nomNormalitzat.includes(textNormalitzat) ||
                llocNormalitzat.includes(textNormalitzat)
            );
        });
    }, [esdevenimentsFuturs, cercaText]);

    const esdevenimentsPassatsFiltrats = useMemo(() => {
        if (!cercaText.trim()) return esdevenimentsPassats;

        const textNormalitzat = normalitzarText(cercaText);
        return esdevenimentsPassats.filter((esdeveniment) => {
            const nomNormalitzat = normalitzarText(esdeveniment.nom);
            const llocNormalitzat = normalitzarText(esdeveniment.lloc);

            return (
                nomNormalitzat.includes(textNormalitzat) ||
                llocNormalitzat.includes(textNormalitzat)
            );
        });
    }, [esdevenimentsPassats, cercaText]);

    const handleCercaChange = (event) => {
        setCercaText(event.target.value);
    };

    useEffect(() => {
        setTitol(assaig ? 'Assaigs' : 'Diades');

        fetch(`${BACKEND_URL}/esdeveniments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assaig }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    const esdeveniments = data.esdeveniments;

                    let now = new Date();
                    now = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        now.getHours(),
                        now.getMinutes()
                    );

                    const futurs = esdeveniments
                        .filter((e) => {
                            const eventDate = parseDate(e.dia);
                            return eventDate >= now;
                        })
                        .sort((a, b) => parseDate(a.dia) - parseDate(b.dia));

                    const passats = esdeveniments
                        .filter((e) => {
                            const eventDate = parseDate(e.dia);
                            return eventDate < now;
                        })
                        .sort((a, b) => parseDate(b.dia) - parseDate(a.dia));

                    setEsdevenimentsFuturs(futurs);
                    setEsdevenimentsPassats(passats);
                } else {
                    console.error('Failed to fetch esdeveniments');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [assaig, setTitol]);

    const detallsEsdeveniment = (id) => {
        if (assaig) {
            navigate(`/assaig/${id}`);
        } else {
            navigate(`/diada/${id}`);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const groupByMonth = (events) => {
        const grouped = {};
        events.forEach((event) => {
            const eventDate = parseDate(event.dia);
            const monthYear = eventDate
                .toLocaleString('ca-ES', { month: 'long', year: 'numeric' })
                .replace(' del', '');
            const formattedMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
            if (!grouped[formattedMonthYear]) {
                grouped[formattedMonthYear] = [];
            }
            grouped[formattedMonthYear].push(event);
        });
        return grouped;
    };

    const renderGroupedEvents = (events) => {
        const groupedEvents = groupByMonth(events);
        if (Object.keys(groupedEvents).length === 0) {
            return (
                <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{
                        marginTop: 4,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        textAlign: 'center',
                    }}
                >
                    No hi ha cap {assaig ? 'assaig' : 'diada'}
                </Typography>
            );
        }
        return Object.keys(groupedEvents).map((monthYear) => (
            <Box key={monthYear} mt={2}>
                <Typography variant="subtitle2" color="textSecondary" mb={1}>
                    {monthYear}
                </Typography>
                <Grid container spacing={2}>
                    {groupedEvents[monthYear].map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event.id}>
                            <CardEsdeveniment
                                nom={event.nom}
                                dia={event.dia}
                                lloc={event.lloc}
                                hora_inici={event.hora_inici}
                                onClick={() => detallsEsdeveniment(event.id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        ));
    };

    return (
        <Box>
            <Tabs variant="fullWidth" value={tabIndex} onChange={handleTabChange}>
                <Tab label={'Futur'} />
                <Tab label={'Passat'} />
            </Tabs>

            <Box mr={2} sx={{ position: 'relative', height: '100%' }}>
                <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1 }}>
                    {assaig ? (
                        <Fab color="primary" onClick={() => navigate('/crear-assaig')}>
                            <AddIcon />
                        </Fab>
                    ) : (
                        <Fab color="primary" onClick={() => navigate('/crear-diada')}>
                            <AddIcon />
                        </Fab>
                    )}
                </Box>

                <Box ml={2} mt={2}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={`Cerca un ${assaig ? 'assaig' : 'diada'}`}
                        value={cercaText}
                        onChange={handleCercaChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    {tabIndex === 0
                        ? renderGroupedEvents(esdevenimentsFutursFiltrats)
                        : renderGroupedEvents(esdevenimentsPassatsFiltrats)}
                </Box>
            </Box>
        </Box>
    );
}

export default Esdeveniments;
