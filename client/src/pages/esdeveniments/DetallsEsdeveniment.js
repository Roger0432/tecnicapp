import React, { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, IconButton, Table, TableBody, TableCell, TableRow, CircularProgress, Divider, Fab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import PlaceIcon from "@mui/icons-material/Place";
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import { useTitol } from "../../context/TitolNavbar";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function DetallsEsdeveniment({ assaig }) {
  const [detalls, setDetalls] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { setTitol } = useTitol();
  const [open, setOpen] = useState(false);
  const [openDeleteCastell, setOpenDeleteCastell] = useState(false);
  const [selectedCastellId, setSelectedCastellId] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/esdeveniment/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setDetalls(data.esdeveniment);
          setTitol(data.esdeveniment.nom);
        } else {
          console.error(data.msg);
        }
      })
      .catch((error) => console.error("Error:", error));
  }, [id, setTitol]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const borrarEsdeveniment = () => {
    fetch(`${BACKEND_URL}/borrar-esdeveniment/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          if (assaig) navigate("/assaigs");
          else navigate("/diades");
        } else {
          console.error("Error en esborrar l'esdeveniment");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const editarEsdeveniment = (esdeveniment) => {
    if (assaig) {
      navigate(`/editar-assaig/${id}`, { state: { esdeveniment, editar: true } });
    } else {
      navigate(`/editar-diada/${id}`, { state: { esdeveniment, editar: true } });
    }
  };

  const borrarCastell = (id) => {
    setSelectedCastellId(id);
    setOpenDeleteCastell(true);
  };

  const handleDeleteCastell = () => {
    fetch(`${BACKEND_URL}/borrar-castell/${selectedCastellId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          window.location.reload();
        } else {
          console.error("Error en esborrar el castell");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setOpenDeleteCastell(false);
  };

  if (!detalls) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const compartirEsdeveniment = () => {
    if (!detalls) return;
    
    const textCompartir =
      '🔔 *' + detalls.nom + '*\n' +
      '📅 ' + detalls.dia + '\n' +
      '🕒 ' + detalls.hora_inici + '-' + detalls.hora_fi + '\n' +
      '📍 ' + detalls.lloc + '\n\n' +
      'Més informació:\n' +
      window.location.href;
    const titolCompartir = detalls.nom;
    
    if (navigator.share) {
      navigator.share({
        title: titolCompartir,
        text: textCompartir,
      })
      .catch((error) => {
        console.error('Error al compartir:', error);
      });
    } else {
      navigator.clipboard.writeText(textCompartir)
        .then(() => {
          console.log("Enllaç copiat!");
        })
        .catch(() => {
          console.error('Error al copiar al porta-retalls');
        });
    }
  };

  const tipusElement = detalls.assaig ? "prova" : "castell";
  const tipusTitol = detalls.assaig ? "Proves" : "Castells";
  const routeAfegir = detalls.assaig ? `/nova-prova/${id}` : `/nou-castell/${id}`;

  return (
    <Box className="page" sx={{ position: "relative" }}>

      <Box
        display="flex"
        justifyContent="space-between"
        gap={1}
        sx={{ position: "absolute", top: 0, right: 0 }}
      >
        <Fab
          color="primary"
          aria-label="share"
          onClick={compartirEsdeveniment}
          size="small">
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
        <Fab
          color="primary"
          aria-label="delete"
          onClick={handleOpen}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </Fab>
      </Box>

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
          <Button onClick={() => { handleClose(); borrarEsdeveniment(); }} color="error" autoFocus>
            Sí, eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteCastell}
        onClose={() => setOpenDeleteCastell(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Eliminar {detalls.assaig ? "prova" : "castell"}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            No podràs recuperar {detalls.assaig ? "aquesta prova" : "aquest castell"}
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

      <Box className="detalls" mb={2} sx={{ maxWidth: 200, width: "100%" }}>
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

      <Divider sx={{ mb:2 }} />

      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>

        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
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
          Afegir {tipusTitol}
        </Button>

      </Box>

      {detalls.castells[0] !== null && (
        <Table>
          <TableBody>
            {detalls.castells.map((element, index) => (
              <TableRow key={index}>
                <TableCell sx={{ paddingLeft: detalls.assaig ? 0 : undefined }}>
                  <Button 
                    component={RouterLink} 
                    to={`/${tipusElement}/${detalls.id[index]}`}
                    variant="outlined" 
                    sx={{ textTransform: 'none' }}
                  >
                    {element}
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => borrarCastell(detalls.id[index])}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

export default DetallsEsdeveniment;