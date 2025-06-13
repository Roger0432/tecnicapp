import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlantillaTronc from '../castells/PlantillaTronc';
import {
    Button,
    Typography,
    Modal,
    Box,
    List,
    ListItemText,
    ListItemButton,
    Paper,
    TextField,
    Fab,
    Tooltip,
    Snackbar,
    Alert,
    Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import '../../styles/Tronc.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function EditarTronc({ castell }) {
    const { id } = useParams();
    const [membresTronc, setMembresTronc] = useState([]);
    const [membresNoTronc, setMembresNoTronc] = useState([]);
    const [castellData, setCastellData] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    useEffect(() => {
        if (castell) setCastellData(castell);
        else console.error('Castell no trobat');

        Promise.all([
            fetch(`${BACKEND_URL}/membres-no-tronc/${id}`).then((response) => response.json()),
            fetch(`${BACKEND_URL}/membres-tronc/${id}`).then((response) => response.json()),
        ])
            .then(([membresNoTroncData, troncData]) => {
                if (membresNoTroncData.status) setMembresNoTronc(membresNoTroncData.membres);
                else console.error(membresNoTroncData.msg);

                if (troncData.status) setMembresTronc(troncData.tronc);
                else console.error(troncData.msg);
            })
            .catch((error) => console.error('Error:', error));
    }, [id, castell]);

    const handleCellClick = (posicio) => {
        setSelectedCell(posicio);
        setSearchTerm('');
    };

    // Funció per normalitzar text (eliminar accents i convertir a minúscules)
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // Actualitzem el terme de cerca amb el valor original
    };

    const filteredMembers = membresNoTronc.filter((membre) => {
        const normalizedSearchTerm = normalizeText(searchTerm);
        const normalizedMote = normalizeText(membre.mote);
        const normalizedFullName = normalizeText(`${membre.nom} ${membre.cognoms}`);

        return (
            normalizedMote.includes(normalizedSearchTerm) ||
            normalizedFullName.includes(normalizedSearchTerm)
        );
    });

    const handleMemberSelect = (membreSeleccionat) => {
        const membresTroncActuals = [...membresTronc];
        const membresNoTroncActuals = [...membresNoTronc];

        let membreAnterior = null;
        for (let i = 0; i < membresTroncActuals.length; i++) {
            if (membresTroncActuals[i].posicio === selectedCell) {
                membreAnterior = membresTroncActuals[i];
                break;
            }
        }

        if (membreAnterior) {
            membresNoTroncActuals.push(membreAnterior);
        }

        const nousMembresTronc = [];
        for (let i = 0; i < membresTroncActuals.length; i++) {
            if (membresTroncActuals[i].posicio !== selectedCell) {
                nousMembresTronc.push(membresTroncActuals[i]);
            }
        }

        nousMembresTronc.push({ ...membreSeleccionat, posicio: selectedCell });

        const nousMembresNoTronc = [];
        for (let i = 0; i < membresNoTroncActuals.length; i++) {
            if (membresNoTroncActuals[i].id !== membreSeleccionat.id) {
                nousMembresNoTronc.push(membresNoTroncActuals[i]);
            }
        }

        setMembresTronc(nousMembresTronc);
        setMembresNoTronc(nousMembresNoTronc);

        setSelectedCell(null);
    };

    const handleEliminarMembre = () => {
        const membresTroncActuals = [...membresTronc];
        const membresNoTroncActuals = [...membresNoTronc];

        let membreAnterior = null;
        for (let i = 0; i < membresTroncActuals.length; i++) {
            if (membresTroncActuals[i].posicio === selectedCell) {
                membreAnterior = membresTroncActuals[i];
                break;
            }
        }

        if (membreAnterior) {
            membresNoTroncActuals.push(membreAnterior);
        }

        const nousMembresTronc = [];
        for (let i = 0; i < membresTroncActuals.length; i++) {
            if (membresTroncActuals[i].posicio !== selectedCell) {
                nousMembresTronc.push(membresTroncActuals[i]);
            }
        }

        setMembresTronc(nousMembresTronc);
        setMembresNoTronc(membresNoTroncActuals);

        setSelectedCell(null);
    };

    const handleCancelar = () => {
        setSelectedCell(null);
    };

    const handleGuardar = () => {
        fetch(`${BACKEND_URL}/actualitzar-tronc/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ membresTronc }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.status) {
                    console.error(data.msg);
                } else {
                    setSnackbarOpen(true);
                }
            })
            .catch((error) => console.error('Error:', error));
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 112px)',
                position: 'relative',
                overflow: 'hidden',
                flex: 1,
            }}
        >
            {/* Contenidor per a la plantilla del tronc */}
            <Box
                className="svg-container"
                sx={{
                    flexGrow: 1,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                <TransformWrapper defaultScale={1} defaultPositionX={0} defaultPositionY={0}>
                    <TransformComponent
                        wrapperStyle={{
                            width: '100%',
                            height: '100%',
                        }}
                        contentStyle={{
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <PlantillaTronc
                            files={parseInt(castellData.alcada - 4, 10)}
                            columnes={parseInt(castellData.amplada, 10)}
                            agulla={castellData.agulla}
                            castellersTronc={membresTronc}
                            onCellClick={handleCellClick}
                        />
                    </TransformComponent>
                </TransformWrapper>
            </Box>

            {/* Botó per guardar els canvis */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Tooltip title="Guardar" placement="top">
                    <Fab
                        color="primary"
                        aria-label="guardar"
                        onClick={handleGuardar}
                        sx={{
                            boxShadow: 3,
                        }}
                    >
                        <SaveIcon />
                    </Fab>
                </Tooltip>
            </Box>

            <Modal
                open={selectedCell !== null}
                onClose={handleCancelar}
                aria-labelledby="modal-seleccionar-membre"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        padding: 2,
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}
                >
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Selecciona membre
                    </Typography>

                    <Box
                        sx={{
                            position: 'absolute',
                            paddingTop: 2,
                            paddingRight: 0,
                            right: 0,
                            top: 0,
                        }}
                    >
                        <Button onClick={handleCancelar} color="primary" size="small">
                            <CloseIcon />
                        </Button>
                    </Box>

                    <TextField
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        label="Cercar membres"
                    />

                    <Typography
                        variant="subtitle2"
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            ml: 2,
                            mr: 2,
                            mb: 1,
                        }}
                    >
                        <span>Nom</span>
                        <span>Alçada espatlla</span>
                    </Typography>

                    <List
                        sx={{
                            maxHeight: 400,
                            overflow: 'auto',
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                        }}
                    >
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((membre) => (
                                <Box key={membre.id}>
                                    <ListItemButton
                                        onClick={() => handleMemberSelect(membre)}
                                        sx={{
                                            padding: 1,
                                        }}
                                    >
                                        <ListItemText primary={membre.mote} sx={{ ml: 1 }} />
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mr: 1 }}
                                        >
                                            {membre.alcada_hombro}
                                        </Typography>
                                    </ListItemButton>
                                    <Divider />
                                </Box>
                            ))
                        ) : (
                            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                                No s'han trobat membres
                            </Typography>
                        )}
                    </List>

                    {/* Botons per eliminar o cancel·lar */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={handleEliminarMembre}
                            variant="outlined"
                            color="error"
                            sx={{ mt: 2 }}
                            startIcon={<DeleteIcon />}
                        >
                            Eliminar membre
                        </Button>
                    </Box>
                </Paper>
            </Modal>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={1000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{
                    mb: 3,
                    ml: 3,
                }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: 'auto' }}>
                    Canvis guardats
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default EditarTronc;
