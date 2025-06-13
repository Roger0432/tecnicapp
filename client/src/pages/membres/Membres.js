import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Fab,
    TextField,
    InputAdornment,
    Card,
    CardContent,
    Typography,
    Grid,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    IconButton,
    Tooltip,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTitol } from '../../context/TitolNavbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const normalitzarText = (text) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
};

function Membres() {
    const [membres, setMembres] = useState([]);
    const [membresFiltrats, setMembresFiltrats] = useState([]);
    const [cercaText, setCercaText] = useState('');
    const [ordenacio, setOrdenacio] = useState('nom');
    const [direccioOrdenacio, setDireccioOrdenacio] = useState('asc');
    const navigate = useNavigate();
    const { setTitol } = useTitol();

    useEffect(() => {
        setTitol('Membres');

        fetch(`${BACKEND_URL}/membres`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    const membresAmbNomComplet = data.membres.map((membre) => ({
                        ...membre,
                        nomComplet: `${membre.nom} ${membre.cognoms}`,
                    }));
                    ordenarMembres(membresAmbNomComplet, ordenacio, direccioOrdenacio);
                } else {
                    console.error('Error:', data.msg);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [setTitol]);

    const getValorOrdenacio = (membre, criteri) => {
        switch (criteri) {
            case 'nom':
                return membre.nomComplet;
            case 'mote':
                return membre.mote || membre.nomComplet;
            case 'alcada':
                return membre.alcada_hombro !== undefined ? membre.alcada_hombro : Infinity;
            default:
                return membre.nomComplet;
        }
    };

    const ordenarMembres = (membresPerOrdenar, criteriOrdenacio, direccio) => {
        const membresOrdenats = [...membresPerOrdenar].sort((a, b) => {
            const valorA = getValorOrdenacio(a, criteriOrdenacio);
            const valorB = getValorOrdenacio(b, criteriOrdenacio);

            if (criteriOrdenacio === 'alcada') {
                return direccio === 'asc' ? valorA - valorB : valorB - valorA;
            } else {
                const comparacio = String(valorA).localeCompare(String(valorB));
                return direccio === 'asc' ? comparacio : -comparacio;
            }
        });

        setMembres(membresOrdenats);
        aplicarCercaActual(membresOrdenats);
    };

    const aplicarCercaActual = (membresOrdenats) => {
        if (cercaText.trim() === '') {
            setMembresFiltrats(membresOrdenats);
        } else {
            const textNormalitzat = normalitzarText(cercaText);

            const filtrats = membresOrdenats.filter((membre) => {
                const nomNormalitzat = normalitzarText(membre.nomComplet);
                const moteNormalitzat = membre.mote ? normalitzarText(membre.mote) : '';

                return (
                    nomNormalitzat.includes(textNormalitzat) ||
                    moteNormalitzat.includes(textNormalitzat)
                );
            });

            setMembresFiltrats(filtrats);
        }
    };

    useEffect(() => {
        if (membres.length > 0) {
            ordenarMembres(membres, ordenacio, direccioOrdenacio);
        }
    }, [ordenacio, direccioOrdenacio]);

    useEffect(() => {
        aplicarCercaActual(membres);
    }, [cercaText, membres]);

    const handleCercaChange = (event) => {
        setCercaText(event.target.value);
    };

    const handleOrdenacioChange = (event) => {
        setOrdenacio(event.target.value);
    };

    const toggleDireccioOrdenacio = () => {
        setDireccioOrdenacio((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    const handleCardClick = (membre) => {
        navigate('/crear-membre', { state: { membre, editar: true } });
    };

    return (
        <Box m={2}>
            <Box sx={{ position: 'relative', height: '100%' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'flex-end' },
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Cerca un membre"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        value={cercaText}
                        onChange={handleCercaChange}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            minWidth: { xs: '100%', sm: '200px' },
                        }}
                    >
                        <FormControl sx={{ flexGrow: 1 }}>
                            <InputLabel id="ordenacio-label">Ordenar per</InputLabel>
                            <Select
                                labelId="ordenacio-label"
                                id="ordenacio-select"
                                value={ordenacio}
                                onChange={handleOrdenacioChange}
                                label="Ordenar per"
                                variant="outlined"
                            >
                                <MenuItem value="nom">Nom</MenuItem>
                                <MenuItem value="mote">Mote</MenuItem>
                                <MenuItem value="alcada">Alçada espatlla</MenuItem>
                            </Select>
                        </FormControl>
                        <Tooltip title={direccioOrdenacio === 'asc' ? 'Ascendent' : 'Descendent'}>
                            <IconButton
                                onClick={toggleDireccioOrdenacio}
                                sx={{
                                    ml: 1,
                                    height: 40,
                                    width: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {direccioOrdenacio === 'asc' ? (
                                    <ArrowUpwardIcon />
                                ) : (
                                    <ArrowDownwardIcon />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Box sx={{ marginTop: 4 }}>
                    <Grid container spacing={2}>
                        {membresFiltrats.map((membre) => (
                            <Grid item xs={12} sm={6} md={4} key={membre.id}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            boxShadow: 6,
                                        },
                                    }}
                                    onClick={() => handleCardClick(membre)}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="body1"
                                            component="div"
                                            fontWeight="bold"
                                        >
                                            {membre.mote || 'Sense mote'}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Typography variant="body2" color="text.secondary">
                                                {membre.nomComplet}
                                            </Typography>
                                            {membre.alcada_hombro && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {membre.alcada_hombro} cm
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1 }}>
                    <Fab color="primary" aria-label="add" onClick={() => navigate('/crear-membre')}>
                        <PersonAddIcon />
                    </Fab>
                </Box>
            </Box>
        </Box>
    );
}

export default Membres;
