import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlantillaTronc from '../../components/PlantillaTronc';
import { Button, Typography, Modal, Box, List, ListItemText, ListItemButton, Paper, TextField, InputAdornment, Fab, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    /* border: 1, 
                    borderColor: 'red' */
                }}
            >
                <TransformWrapper>
                    <TransformComponent>
                       
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

            <Box
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
            
                <Tooltip title="Guardar" placement="right">
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

                    <Box sx={{ position: 'absolute', top: 32, right: 16 }}>
                        <Button onClick={handleCancelar} color="primary" size="small">
                            <CloseIcon />
                        </Button>
                    </Box>
                    
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

                    <Typography variant="subtitle1" sx={{ display: 'flex', justifyContent: 'space-between', ml: 2, mr: 2, mb: 1 }}>
                        <span><strong>Nom</strong></span>
                        <span><strong>Alçada hombro</strong></span>
                    </Typography>
                    
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
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                        {membre.alcada_hombro} cm
                                    </Typography>
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
                            sx={{ mt:2 }}
                            startIcon={<DeleteIcon />}
                        >
                            Eliminar membre
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </Box>
    );
}

export default EditarTronc;