import React, { useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlantillaTronc from '../../components/PlantillaTronc';
import { Button, Typography, Modal, Box, List, ListItemText, ListItemButton, Paper, TextField, InputAdornment, Fab, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import '../../styles/EditarCastell.css';
import '../../styles/Tronc.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function EditarTronc({ castell }) {
    const { id } = useParams();
    const [membresTronc, setMembresTronc] = useState([]);
    const [membresNoTronc, setMembresNoTronc] = useState([]);
    const [castellData, setCastellData] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (castell) setCastellData(castell);
        else console.error('Castell no trobat');

        Promise.all([
            fetch(`${BACKEND_URL}/membres-no-tronc/${id}`).then(response => response.json()),
            fetch(`${BACKEND_URL}/membres-tronc/${id}`).then(response => response.json())
        ])
        .then(([membresNoTroncData, troncData]) => {

            if (membresNoTroncData.status) setMembresNoTronc(membresNoTroncData.membres);
            else console.error(membresNoTroncData.msg);

            if (troncData.status) setMembresTronc(troncData.tronc);
            else console.error(troncData.msg);
        })
        .catch(error => console.error('Error:', error));
    }, [id, castell]);

    const handleCellClick = (posicio) => {
        setSelectedCell(posicio);
        setSearchTerm('');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredMembers = membresNoTronc.filter(membre => 
        membre.mote.toLowerCase().includes(searchTerm) || 
        `${membre.nom} ${membre.cognoms}`.toLowerCase().includes(searchTerm)
    );

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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ membresTronc })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.status) {
                console.error(data.msg);
            }
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <Box>
            <PlantillaTronc 
                    files={parseInt(castellData.alcada - 4, 10)} 
                    columnes={parseInt(castellData.amplada, 10)} 
                    agulla={castellData.agulla}
                    castellersTronc={membresTronc}
                    onCellClick={handleCellClick}
                />

            <Box
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    left: 24,
                    right: 24,
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Tooltip title="Back" placement="top">
                    <Fab 
                        color="primary" 
                        aria-label="back"
                        onClick={() => navigate(-1)}
                        sx={{
                            boxShadow: 3
                        }}
                    >
                        <ArrowBackIosNewIcon />
                    </Fab>
                </Tooltip>

                <Tooltip title="Guardar" placement="top">
                    <Fab 
                        color="primary" 
                        aria-label="guardar"
                        onClick={handleGuardar}
                        sx={{
                            boxShadow: 3
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
                        p: 4,
                        borderRadius: 2
                    }}
                >
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Selecciona membre
                    </Typography>
                    
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Cercar membres..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <List sx={{ maxHeight: 400, overflow: 'auto', mb: 2 }}>
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((membre) => (
                                <ListItemButton 
                                    onClick={() => handleMemberSelect(membre)} 
                                    key={membre.id}
                                >
                                    <ListItemText 
                                        primary={membre.mote} 
                                        secondary={`${membre.nom} ${membre.cognoms}`}
                                    />
                                </ListItemButton>
                            ))
                        ) : (
                            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                                No s'han trobat membres
                            </Typography>
                        )}
                    </List>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button 
                            onClick={handleEliminarMembre} 
                            color="error" 
                            variant="contained"
                        >
                            Eliminar membre
                        </Button>
                        <Button 
                            onClick={handleCancelar} 
                            color="primary" 
                            variant="outlined"
                        >
                            Cancel·lar
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </Box>
    );
}

export default EditarTronc;