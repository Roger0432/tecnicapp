import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContentText,
    DialogContent,
    Tooltip,
    Fab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import TaulaDetallsMembre from '../membres/DetallsMembres';
import { useTitol } from '../../context/TitolNavbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function CrearMembre() {
    const navigate = useNavigate();
    const location = useLocation();
    const { membre = {}, editar = false } = location.state || {};

    const [modeEdicio, setModeEdicio] = useState(false);
    const [mote, setMote] = useState(membre.mote || '');
    const [nom, setNom] = useState(membre.nom || '');
    const [cognoms, setCognoms] = useState(membre.cognoms || '');
    const [alcadaEspatlla, setAlcadaEspatlla] = useState(membre.alcada_espatlla || '');
    const [alcadaMans, setAlcadaMans] = useState(membre.alcada_mans || '');
    const [comentaris, setComentaris] = useState(membre.comentaris || '');
    const [error, setError] = useState('');
    const { setTitol } = useTitol();

    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [successDialogTitle, setSuccessDialogTitle] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleSuccessDialogClose = () => {
        setOpenSuccessDialog(false);
        navigate('/membres');
    };

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteConfirm = () => {
        fetch(`${BACKEND_URL}/borrar-membre/${membre.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    setSuccessDialogTitle('El membre ha estat eliminat correctament');
                    setOpenSuccessDialog(true);
                } else {
                    console.error('Error:', data.msg);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        setOpenDeleteDialog(false);
    };

    const borrarMembre = () => {
        setOpenDeleteDialog(true);
    };

    const handleSaveSuccess = () => {
        setSuccessDialogTitle(editar ? 'Membre editat correctament' : 'Membre creat correctament');
        setOpenSuccessDialog(true);
    };

    useEffect(() => {
        const titol = editar ? (modeEdicio ? 'Editar Membre' : 'Detalls') : 'Crear Membre';
        setTitol(titol);
    }, [editar, modeEdicio, setTitol]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (mote === '' || nom === '') {
            setError("Has d'omplir els camps nom i mote");
            return;
        }

        const data = {
            mote,
            nom,
            cognoms,
            alcada_espatlla: alcadaEspatlla ? parseFloat(alcadaEspatlla) : 0,
            alcada_mans: alcadaMans ? parseFloat(alcadaMans) : 0,
            comentaris,
        };

        let url = `${BACKEND_URL}`;
        if (editar) url += `/editar-membre/${membre.id}`;
        else url += '/crear-membre';

        const method = editar ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    handleSaveSuccess();
                } else {
                    console.error('Error:', data.msg);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <Box m={2} mt={4} display="flex" justifyContent="center">
            {!modeEdicio && editar && (
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{ position: 'fixed', bottom: 24, right: 24 }}
                >
                    <SpeedDial
                        ariaLabel="SpeedDial basic example"
                        icon={<SpeedDialIcon />}
                        direction="up"
                    >
                        <SpeedDialAction
                            icon={<EditIcon />}
                            tooltipTitle="Editar"
                            onClick={() => setModeEdicio(true)}
                        />
                        <SpeedDialAction
                            icon={<DeleteIcon />}
                            tooltipTitle="Eliminar"
                            onClick={borrarMembre}
                        />
                    </SpeedDial>
                </Box>
            )}

            {!modeEdicio && editar ? (
                <TaulaDetallsMembre
                    membre={{
                        mote,
                        nom,
                        cognoms,
                        alcada_espatlla: alcadaEspatlla,
                        alcada_mans: alcadaMans,
                        comentaris,
                    }}
                />
            ) : (
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ width: '100%', maxWidth: '400px' }}
                >
                    <Box className="form-group" display="flex" flexDirection="column">
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                label="Mote"
                                value={mote}
                                onChange={(e) => setMote(e.target.value)}
                                variant="outlined"
                                autoComplete="nickname"
                            />
                        </Box>

                        <Box mb={2}>
                            <TextField
                                fullWidth
                                label="Nom"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                variant="outlined"
                                autoComplete="given-name"
                            />
                        </Box>

                        <Box mb={2}>
                            <TextField
                                fullWidth
                                label="Cognoms"
                                value={cognoms}
                                onChange={(e) => setCognoms(e.target.value)}
                                variant="outlined"
                                autoComplete="family-name"
                            />
                        </Box>

                        <Box mb={2}>
                            <TextField
                                fullWidth
                                label="Alçada de l'espatlla (cm)"
                                value={alcadaEspatlla}
                                onChange={(e) => setAlcadaEspatlla(e.target.value)}
                                variant="outlined"
                                type="number"
                            />
                        </Box>

                        <Box mb={2}>
                            <TextField
                                fullWidth
                                label="Alçada de les mans (cm)"
                                value={alcadaMans}
                                onChange={(e) => setAlcadaMans(e.target.value)}
                                variant="outlined"
                                type="number"
                            />
                        </Box>

                        <Box mb={2}>
                            <TextField
                                fullWidth
                                label="Comentaris"
                                value={comentaris}
                                onChange={(e) => setComentaris(e.target.value)}
                                variant="outlined"
                                multiline
                                rows={4}
                            />
                        </Box>
                    </Box>

                    {modeEdicio && (
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
                                    onClick={handleSubmit}
                                    sx={{
                                        boxShadow: 3,
                                    }}
                                >
                                    <SaveIcon />
                                </Fab>
                            </Tooltip>
                        </Box>
                    )}

                    {!editar && (
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Crear
                        </Button>
                    )}
                    {error && (
                        <Typography color="error" mt={2}>
                            {error}
                        </Typography>
                    )}
                </Box>
            )}

            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteDialogClose}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">Eliminar membre?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Estàs segur que vols eliminar aquest membre? No podràs recuperar-lo.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} color="primary">
                        Cancel·la
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Sí, eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openSuccessDialog}
                onClose={handleSuccessDialogClose}
                aria-labelledby="success-dialog-title"
            >
                <DialogTitle id="success-dialog-title">{successDialogTitle}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleSuccessDialogClose} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CrearMembre;
