import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactComponent as PinyaPilar } from '../../svg/pinya-pilar.svg';
import { Box, Modal, Paper, Typography, TextField, InputAdornment, List, ListItemButton, ListItemText, Button, Fab, Tooltip } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EditarPinya = ({ assaig, castell }) => {
    const { id } = useParams();
    const [castellData, setCastellData] = useState(null);
    const [membresPinya, setMembresPinya] = useState([]);
    const [membresNoPinya, setMembresNoPinya] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const svgRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (castell) setCastellData(castell);
        else console.error('Castell no trobat');

        Promise.all([
            fetch(`${BACKEND_URL}/membres-no-pinya/${id}`).then(response => response.json()),
            fetch(`${BACKEND_URL}/membres-pinya/${id}`).then(response => response.json())
        ])
        .then(([membresNoPinyaData, pinyaData]) => {
            if (membresNoPinyaData.status) setMembresNoPinya(membresNoPinyaData.membres);
            else console.error(membresNoPinyaData.msg);

            if (pinyaData.status) setMembresPinya(pinyaData.pinya);
            else console.error(pinyaData.msg);
        })
        .catch(error => console.error('Error:', error));
    }, [id, castell]);

    useEffect(() => {
        if (svgRef.current) {
            // Primer, actualitzar textos
            membresPinya.forEach(membre => {
                const textElement = svgRef.current.querySelector(`#text-${membre.posicio}`);
                if (textElement) {
                    textElement.textContent = membre.mote;
                }
            });

            // PRIMER: Fer clicables totes les formes 
            const formElements = svgRef.current.querySelectorAll(
                '[id^="baix-"], [id^="contrafort-"], [id^="agulla-"], [id^="rengla-"], [id^="lateral-"], [id^="crossa-"]'
            );
            
            formElements.forEach(element => {
                element.style.cursor = 'pointer';
                
                // Netegem l'event listener anterior si n'hi ha
                const newElement = element.cloneNode(true);
                if (element.parentNode) {
                    element.parentNode.replaceChild(newElement, element);
                }
                
                newElement.addEventListener('click', () => {
                    handleCellClick(newElement.id);
                });
            });

            // SEGON: També fer clicables els texts
            const textElements = svgRef.current.querySelectorAll(
                '[id^="text-baix-"], [id^="text-contrafort-"], [id^="text-agulla-"], [id^="text-rengla-"], [id^="text-lateral-"], [id^="text-crossa-"]'
            );
            
            textElements.forEach(element => {
                element.style.cursor = 'pointer';
                
                // Netegem l'event listener anterior si n'hi ha
                const newElement = element.cloneNode(true);
                if (element.parentNode) {
                    element.parentNode.replaceChild(newElement, element);
                }
                
                newElement.addEventListener('click', () => {
                    // Eliminem el prefix "text-" per obtenir l'ID real de posició
                    const posicioId = newElement.id.replace('text-', '');
                    handleCellClick(posicioId);
                });
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [membresPinya, castellData]);

    const handleCellClick = (posicio) => {
        setSelectedCell(posicio);
        setSearchTerm('');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredMembers = membresNoPinya.filter(membre => 
        membre.mote.toLowerCase().includes(searchTerm) || 
        `${membre.nom} ${membre.cognoms}`.toLowerCase().includes(searchTerm)
    );

    const handleMemberSelect = (membreSeleccionat) => {
        const membresPinyaActuals = [...membresPinya];
        const membresNoPinyaActuals = [...membresNoPinya];
    
        // Buscar si ja hi ha un membre a aquesta posició
        let membreAnterior = null;
        for (let i = 0; i < membresPinyaActuals.length; i++) {
            if (membresPinyaActuals[i].posicio === selectedCell) {
                membreAnterior = membresPinyaActuals[i];
                break;
            }
        }
    
        // Si n'hi ha, el tornem a la llista de membres disponibles
        if (membreAnterior) {
            membresNoPinyaActuals.push(membreAnterior);
        }
    
        // Eliminem el membre anterior de la pinya
        const nousMembresPinya = [];
        for (let i = 0; i < membresPinyaActuals.length; i++) {
            if (membresPinyaActuals[i].posicio !== selectedCell) {
                nousMembresPinya.push(membresPinyaActuals[i]);
            }
        }
    
        // Afegim el nou membre seleccionat
        nousMembresPinya.push({ ...membreSeleccionat, posicio: selectedCell });
    
        // Actualitzem la llista de membres no assignats
        const nousMembresNoPinya = [];
        for (let i = 0; i < membresNoPinyaActuals.length; i++) {
            if (membresNoPinyaActuals[i].id !== membreSeleccionat.id) {
                nousMembresNoPinya.push(membresNoPinyaActuals[i]);
            }
        }
    
        // Actualitzem l'estat
        setMembresPinya(nousMembresPinya);
        setMembresNoPinya(nousMembresNoPinya);
        setSelectedCell(null);
    
        // Actualitzem el text a l'SVG amb el nou membre
        if (svgRef.current) {
            const textElement = svgRef.current.querySelector(`#text-${selectedCell}`);
            if (textElement) {
                textElement.textContent = membreSeleccionat.mote;
            }
        }
    };

    const handleEliminarMembre = () => {
        const membresPinyaActuals = [...membresPinya];
        const membresNoPinyaActuals = [...membresNoPinya];
    
        let membreAnterior = null;
        for (let i = 0; i < membresPinyaActuals.length; i++) {
            if (membresPinyaActuals[i].posicio === selectedCell) {
                membreAnterior = membresPinyaActuals[i];
                break;
            }
        }
    
        if (membreAnterior) {
            membresNoPinyaActuals.push(membreAnterior);
        }
    
        const nousMembresPinya = [];
        for (let i = 0; i < membresPinyaActuals.length; i++) {
            if (membresPinyaActuals[i].posicio !== selectedCell) {
                nousMembresPinya.push(membresPinyaActuals[i]);
            }
        }
    
        setMembresPinya(nousMembresPinya);
        setMembresNoPinya(membresNoPinyaActuals);
    
        setSelectedCell(null);

        // neteja el contingut de text de l'SVG
        if (svgRef.current) {
            const textElement = svgRef.current.querySelector(`#text-${selectedCell}`);
            if (textElement) {
                textElement.textContent = '';
            }
        }
    };

    const handleCancelar = () => {
        setSelectedCell(null);
    };

    const handleGuardar = () => {
        fetch(`${BACKEND_URL}/actualitzar-pinya/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ membresPinya })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.status) {
                console.error(data.msg);
            }
        })
        .catch(error => console.error('Error:', error));
    };

    // actualitza el text de l'SVG amb els noms dels membres
    useEffect(() => {
        if (svgRef.current && membresPinya.length > 0) {
            membresPinya.forEach(membre => {
                const textElement = svgRef.current.querySelector(`#text-${membre.posicio}`);
                if (textElement) {
                    textElement.textContent = membre.mote;
                }
            });
        }
    }, [membresPinya]);

    let pinya_svg = null;
    if (castellData) {
        switch (parseInt(castellData.amplada)) {
            case 1:
                pinya_svg = <PinyaPilar ref={svgRef} />;
                break;
            case 2:
                //pinya_svg = <PinyaTorre ref={svgRef} />;
                break;
            case 3:
                //if (castellData.agulla) pinya_svg = <PinyaTresAgulla ref={svgRef} />;
                //else pinya_svg = <PinyaTres ref={svgRef} />;
                break;
            case 4:
                //if (castellData.agulla) pinya_svg = <PinyaQuatreAgulla ref={svgRef} />;
                //else pinya_svg = <PinyaQuatre ref={svgRef} />;
                break;
            case 5:
                //pinya_svg = <PinyaCinc ref={svgRef} />;
                break;
            case 7:
                //pinya_svg = <PinyaSet ref={svgRef} />;
                break;
            case 9:
                //pinya_svg = <PinyaNou ref={svgRef} />;
                break;
            default:
                console.error('Pinya no trobada');
                break;
        }
    }     

    return (
        <Box m={1}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                    maxWidth: '650px',
                    maxHeight: '650px',
                    width: '100%',
                    height: 'auto',
                    marginLeft: { xs: 0, sm: 'calc((100vw - 650px) / 2)' },
                }}
            >
                {pinya_svg}
            </Box>

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
};

export default EditarPinya;