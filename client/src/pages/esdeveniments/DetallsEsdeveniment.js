import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    IconButton,
    CircularProgress,
    Divider,
    Fab,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Grid,
    Card,
    CardActionArea,
    CardContent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import PlaceIcon from '@mui/icons-material/Place';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import { useTitol } from '../../context/TitolNavbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function DetallsEsdeveniment({ assaig }) {
    const [detalls, setDetalls] = useState(null);
    const [castells, setCastells] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();
    const { setTitol } = useTitol();
    const [open, setOpen] = useState(false);
    const [openDeleteCastell, setOpenDeleteCastell] = useState(false);
    const [selectedCastellId, setSelectedCastellId] = useState(null);

    const [openEditDescripcio, setOpenEditDescripcio] = useState(false);
    const [descripcio, setDescripcio] = useState('');
    const [selectedCastellInfo, setSelectedCastellInfo] = useState(null);

    useEffect(() => {
        fetch(`${BACKEND_URL}/detalls-esdeveniment/${id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    setDetalls(data.esdeveniment);
                    setTitol(data.esdeveniment.nom);
                } else {
                    console.error(data.msg);
                }
            })
            .catch((error) => console.error('Error:', error));

        fetch(`${BACKEND_URL}/castells-esdeveniment/${id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    setCastells(data.castells);
                } else {
                    console.error(data.msg);
                }
            })
            .catch((error) => console.error('Error:', error));
    }, [id, setTitol]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const borrarEsdeveniment = () => {
        fetch(`${BACKEND_URL}/borrar-esdeveniment/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    if (assaig) navigate('/assaigs');
                    else navigate('/diades');
                } else {
                    console.error("Error en esborrar l'esdeveniment");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const editarEsdeveniment = (esdeveniment) => {
        if (assaig) {
            navigate(`/editar-assaig/${id}`, {
                state: { esdeveniment, editar: true },
            });
        } else {
            navigate(`/editar-diada/${id}`, {
                state: { esdeveniment, editar: true },
            });
        }
    };

    const borrarCastell = (id) => {
        setSelectedCastellId(id);
        setOpenDeleteCastell(true);
    };

    const editarDescripcioCastell = (castellId) => {
        const castell = castells.find((c) => c.id === castellId);
        setSelectedCastellInfo(castell);
        setDescripcio(castell.descripcio);
        setOpenEditDescripcio(true);
    };

    const handleEditDescripcio = () => {
        fetch(`${BACKEND_URL}/editar-descripcio-castell`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedCastellInfo.id, descripcio }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    setCastells(
                        castells.map((c) =>
                            c.id === selectedCastellInfo.id ? { ...c, descripcio } : c
                        )
                    );
                } else {
                    console.error('Error en editar la descripció del castell');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        setOpenEditDescripcio(false);
    };

    const handleDeleteCastell = () => {
        fetch(`${BACKEND_URL}/borrar-castell/${selectedCastellId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    setCastells(castells.filter((castell) => castell.id !== selectedCastellId));
                } else {
                    console.error('Error en esborrar el castell');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        setOpenDeleteCastell(false);
    };

    if (!detalls) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress color="primary" />
            </Box>
        );
    }

    const compartirEsdeveniment = () => {
        if (!detalls) return;

        const textCompartir =
            '🔔 *' +
            detalls.nom +
            '*\n' +
            '📅 ' +
            detalls.dia +
            '\n' +
            '🕒 ' +
            detalls.hora_inici +
            '-' +
            detalls.hora_fi +
            '\n' +
            '📍 ' +
            detalls.lloc +
            '\n\n' +
            'Més informació:\n' +
            window.location.href;
        const titolCompartir = detalls.nom;

        if (navigator.share) {
            navigator
                .share({
                    title: titolCompartir,
                    text: textCompartir,
                })
                .catch((error) => {
                    console.error('Error al compartir:', error);
                });
        } else {
            navigator.clipboard
                .writeText(textCompartir)
                .then(() => {
                    console.log('Enllaç copiat!');
                })
                .catch(() => {
                    console.error('Error al copiar al porta-retalls');
                });
        }
    };

    const tipusElement = assaig ? 'prova' : 'castell';
    const tipusTitol = assaig ? 'Proves' : 'Castells';
    const routeAfegir = assaig ? `/nova-prova/${id}` : `/nou-castell/${id}`;

    return (
        <Box m={2} mt={4} sx={{ position: 'relative' }}>
            <Box
                display="flex"
                justifyContent="space-between"
                gap={1}
                sx={{ position: 'absolute', top: 0, right: 0 }}
            >
                <Fab
                    color="primary"
                    aria-label="share"
                    onClick={compartirEsdeveniment}
                    size="small"
                >
                    <ShareIcon fontSize="small" />
                </Fab>
                <Fab
                    color="primary"
                    aria-label="edit"
                    onClick={() => editarEsdeveniment(detalls)}
                    size="small"
                >
                    <EditIcon fontSize="small" />
                </Fab>
                <Fab color="primary" aria-label="delete" onClick={handleOpen} size="small">
                    <DeleteIcon fontSize="small" />
                </Fab>
            </Box>

            {/* eliminar esdeveniment */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Eliminar esdeveniment?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        No podràs recuperar aquest esdeveniment
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel·la
                    </Button>
                    <Button
                        onClick={() => {
                            handleClose();
                            borrarEsdeveniment();
                        }}
                        color="error"
                        autoFocus
                    >
                        Sí, eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* eliminar castell */}
            <Dialog
                open={openDeleteCastell}
                onClose={() => setOpenDeleteCastell(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Eliminar {assaig ? 'prova' : 'castell'}?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        No podràs recuperar {assaig ? 'aquesta prova' : 'aquest castell'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteCastell(false)} color="primary">
                        Cancel·la
                    </Button>
                    <Button onClick={handleDeleteCastell} color="error" autoFocus>
                        Sí, eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* editar descripció castell */}
            <Dialog
                open={openEditDescripcio}
                onClose={() => setOpenEditDescripcio(false)}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    Editar descripció del {assaig ? 'prova' : 'castell'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="descripcio"
                        label="Descripció"
                        type="text"
                        fullWidth
                        value={descripcio}
                        onChange={(e) => setDescripcio(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDescripcio(false)} color="primary">
                        Cancel·la
                    </Button>
                    <Button onClick={handleEditDescripcio} color="primary">
                        Desa
                    </Button>
                </DialogActions>
            </Dialog>

            <Box className="detalls" mb={2} sx={{ maxWidth: 200, width: '100%' }}>
                <Box display="flex" alignItems="center" mb={1} color="gray">
                    <EventIcon />
                    <Typography variant="body1" ml={1} color="gray">
                        {detalls.dia}
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1} color="gray">
                    <AccessTimeIcon />
                    <Typography variant="body1" ml={1} color="gray">
                        {detalls.hora_inici} - {detalls.hora_fi}
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1} color="gray">
                    <PlaceIcon />
                    <Typography variant="body1" ml={1} color="gray">
                        {detalls.lloc}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {tipusTitol}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to={routeAfegir}
                    startIcon={<AddIcon />}
                    sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                    Afegir {tipusTitol.toLowerCase()}
                </Button>
            </Box>

            {castells && castells.length > 0 ? (
                <Grid container spacing={2}>
                    {castells.map((castell, index) => (
                        <Grid item xs={12} sm={6} md={3} lg={3} key={castell.id}>
                            <Card
                                variant="outlined"
                                sx={{
                                    height: '70px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        boxShadow: 3,
                                    },
                                }}
                            >
                                <CardActionArea
                                    component={RouterLink}
                                    to={`/${tipusElement}/${castell.id}`}
                                    sx={{
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'stretch',
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            py: 1.5,
                                            px: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box sx={{ flexGrow: 1, pr: 1 }}>
                                            <Typography
                                                variant="subtitle1"
                                                component="div"
                                                sx={{ fontWeight: 'medium' }}
                                            >
                                                {castell.nom}
                                            </Typography>

                                            {castell.descripcio && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5, fontSize: '0.75rem' }}
                                                >
                                                    {castell.descripcio}
                                                </Typography>
                                            )}
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    editarDescripcioCastell(castell.id);
                                                }}
                                                aria-label="editar"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    borrarCastell(castell.id);
                                                }}
                                                aria-label="eliminar"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 4 }}>
                    No hi ha cap {assaig ? 'prova' : 'castell'}
                </Typography>
            )}
        </Box>
    );
}

export default DetallsEsdeveniment;
