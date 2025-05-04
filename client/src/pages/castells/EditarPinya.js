// Importem les llibreries necessàries
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as PinyaPilar } from '../../svg/pinya-pilar.svg';
import { ReactComponent as PinyaTorre } from '../../svg/pinya-torre.svg';
import { Box, Modal, Paper, Typography, TextField, List, ListItemButton, ListItemText, Button, Fab, Tooltip, Snackbar, Alert , Divider } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

// Definim la URL del backend
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Component principal per editar la pinya d'un castell
const EditarPinya = ({ castell }) => {
    // Obtenim l'ID del castell des de la URL
    const { id } = useParams();

    // Definim els estats del component
    const [castellData, setCastellData] = useState(null); // Dades del castell
    const [membresPinya, setMembresPinya] = useState([]); // Membres assignats a la pinya
    const [membresNoPinya, setMembresNoPinya] = useState([]); // Membres no assignats a la pinya
    const [selectedCell, setSelectedCell] = useState(null); // Cel·la seleccionada a l'SVG
    const [searchTerm, setSearchTerm] = useState(''); // Terme de cerca per filtrar membres
    const svgRef = useRef(null); // Referència a l'SVG
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Estat per controlar el Snackbar

    // Efecte per carregar les dades inicials del castell i els membres
    useEffect(() => {
        if (castell) setCastellData(castell); // Assignem les dades del castell si existeixen
        else console.error('Castell no trobat');

        // Fem dues crides al backend per obtenir els membres assignats i no assignats
        Promise.all([
            fetch(`${BACKEND_URL}/membres-no-pinya/${id}`).then(response => response.json()),
            fetch(`${BACKEND_URL}/membres-pinya/${id}`).then(response => response.json())
        ])
        .then(([membresNoPinyaData, pinyaData]) => {
            // Assignem els membres no assignats si la resposta és correcta
            if (membresNoPinyaData.status) setMembresNoPinya(membresNoPinyaData.membres);
            else console.error(membresNoPinyaData.msg);

            // Assignem els membres de la pinya si la resposta és correcta
            if (pinyaData.status) setMembresPinya(pinyaData.pinya);
            else console.error(pinyaData.msg);
        })
        .catch(error => console.error('Error:', error)); // Gestionem errors
    }, [id, castell]);

    // Efecte per actualitzar l'SVG amb els membres de la pinya
    useEffect(() => {
        if (svgRef.current) {
            // Actualitzem els textos de l'SVG amb els noms dels membres
            membresPinya.forEach(membre => {
                const textElement = svgRef.current.querySelector(`#text-${membre.posicio}`);
                if (textElement) {
                    textElement.textContent = membre.mote;
                }
            });

            // Fem clicables totes les formes de l'SVG
            const formElements = svgRef.current.querySelectorAll(
                '[id^="baix-"], [id^="contrafort-"], [id^="agulla-"], [id^="rengla-"], [id^="lateral-"], [id^="crossa-"]'
            );
            
            formElements.forEach(element => {
                element.style.cursor = 'pointer'; // Canviem el cursor per indicar que és clicable
                
                // Netegem l'event listener anterior si n'hi ha
                const newElement = element.cloneNode(true);
                if (element.parentNode) {
                    element.parentNode.replaceChild(newElement, element);
                }
                
                // Afegim un event listener per gestionar el clic
                newElement.addEventListener('click', () => {
                    handleCellClick(newElement.id);
                });
            });

            // Fem clicables també els textos de l'SVG
            const textElements = svgRef.current.querySelectorAll(
                '[id^="text-baix-"], [id^="text-contrafort-"], [id^="text-agulla-"], [id^="text-rengla-"], [id^="text-lateral-"], [id^="text-crossa-"]'
            );
            
            textElements.forEach(element => {
                element.style.cursor = 'pointer'; // Canviem el cursor per indicar que és clicable
                
                // Netegem l'event listener anterior si n'hi ha
                const newElement = element.cloneNode(true);
                if (element.parentNode) {
                    element.parentNode.replaceChild(newElement, element);
                }
                
                // Afegim un event listener per gestionar el clic
                newElement.addEventListener('click', () => {
                    // Eliminem el prefix "text-" per obtenir l'ID real de posició
                    const posicioId = newElement.id.replace('text-', '');
                    handleCellClick(posicioId);
                });
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [membresPinya, castellData]);

    // Funció per gestionar el clic en una cel·la de l'SVG
    const handleCellClick = (posicio) => {
        setSelectedCell(posicio); // Assignem la cel·la seleccionada
        setSearchTerm(''); // Reiniciem el terme de cerca
    };

    // Funció per normalitzar text (eliminar accents i convertir a minúscules)
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    };

    // Funció per gestionar el canvi en el camp de cerca
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // Actualitzem el terme de cerca amb el valor original
    };

    // Filtrar els membres no assignats segons el terme de cerca
    const filteredMembers = membresNoPinya.filter(membre => {
        const normalizedSearchTerm = normalizeText(searchTerm);
        const normalizedMote = normalizeText(membre.mote);
        const normalizedFullName = normalizeText(`${membre.nom} ${membre.cognoms}`);
        
        return normalizedMote.includes(normalizedSearchTerm) || 
               normalizedFullName.includes(normalizedSearchTerm);
    });

    // Funció per assignar un membre a una cel·la seleccionada
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

    // Funció per eliminar un membre d'una cel·la seleccionada
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

        // Neteja el contingut de text de l'SVG
        if (svgRef.current) {
            const textElement = svgRef.current.querySelector(`#text-${selectedCell}`);
            if (textElement) {
                textElement.textContent = '';
            }
        }
    };

    // Funció per cancel·lar la selecció d'una cel·la
    const handleCancelar = () => {
        setSelectedCell(null);
    };

    // Funció per guardar els canvis al backend
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
            } else {
                setSnackbarOpen(true); // Mostrem el Snackbar si la resposta és correcta
            }
        })
        .catch(error => console.error('Error:', error));
    };

    // Funció per tancar el Snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Actualitza el text de l'SVG amb els noms dels membres
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

    // Seleccionem l'SVG adequat segons l'amplada del castell
    let pinya_svg = null;
    if (castellData) {
        switch (parseInt(castellData.amplada)) {
            case 1:
                pinya_svg = <PinyaPilar ref={svgRef} style={{ width: '100%', height: '100%' }}/>;
                break;
            case 2:
                pinya_svg = <PinyaTorre ref={svgRef} style={{ width: '100%', height: '100%' }} />;
                break;
            case 3:
                //if (castellData.agulla) pinya_svg = <PinyaTresAgulla ref={svgRef} style={{ width: '100%', height: '100%' }} />;
                //else pinya_svg = <PinyaTres ref={svgRef} style={{ width: '100%', height: '100%' }} />;
                break;
            case 4:
                //if (castellData.agulla) pinya_svg = <PinyaQuatreAgulla ref={svgRef} style={{ width: '100%', height: '100%' }} />;
                //else pinya_svg = <PinyaQuatre ref={svgRef} style={{ width: '100%', height: '100%' }} />;
                break;
            case 5:
                //pinya_svg = <PinyaCinc ref={svgRef} style={{ width: '100%', height: '100%' }} />;
                break;
            case 7:
                //pinya_svg = <PinyaSet ref={svgRef} style={{ width: '100%', height: '100%' }} />;
                break;
            case 9:
                //pinya_svg = <PinyaNou ref={svgRef} style={{ width: '100%', height: '100%' }} />;
                break;
            default:
                console.error('Pinya no trobada');
                break;
        }
    }     

    // Renderitzem el component
    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: 'calc(100vh - 112px)',
            position: 'relative',
            overflow: 'hidden',
            flex: 1
        }}>
            {/* Contenidor per a l'SVG */}
            <Box
                className="svg-container"
                sx={{
                    
                    flexGrow: 1,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                }}
            >
                <TransformWrapper
                    defaultScale={1}
                    defaultPositionX={0}
                    defaultPositionY={0}
                >
                    <TransformComponent
                        wrapperStyle={{
                            width: '100%',
                            height: '100%'
                        }}
                        contentStyle={{
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        {pinya_svg}
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
                            boxShadow: 3
                        }}
                    >
                        <SaveIcon />
                    </Fab>
                </Tooltip>
            </Box>

            {/* Snackbar per mostrar missatges */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={1000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{ 
                    mb: 3, 
                    ml: 3 
                }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity="success" 
                    sx={{ width: 'auto' }}
                >
                    Canvis guardats
                </Alert>
            </Snackbar>

            {/* Modal per seleccionar un membre */}
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
                    }}
                >
                  
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Selecciona membre
                    </Typography>

                    <Box sx={{ position: 'absolute', paddingTop: 2, paddingRight: 0, right: 0, top: 0 }}>
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
                    
                    <Typography variant="subtitle2" sx={{ display: 'flex', justifyContent: 'space-between', ml: 2, mr: 2, mb: 1 }}>
                        <span>Nom</span>
                        <span>Alçada mans</span>
                    </Typography>

                    <List sx={{ maxHeight: 400, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((membre) => (
                                <Box>
                                    <ListItemButton 
                                        onClick={() => handleMemberSelect(membre)} 
                                        key={membre.id}
                                        sx={{ 
                                            padding: 1, 
                                        }}
                                    >
                                        <ListItemText 
                                            primary={membre.mote}
                                            sx={{ ml: 1 }}
                                        />
                                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                            {membre.alcada_mans}
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
};

export default EditarPinya;