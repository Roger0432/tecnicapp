import React, { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, IconButton, Table, TableBody, TableCell, TableRow, CircularProgress, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import PlaceIcon from "@mui/icons-material/Place";
import Swal from "sweetalert2";
import { Fab } from "@mui/material";
import { useTitol } from "../../context/TitolNavbar";
import AddIcon from '@mui/icons-material/Add';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function DetallsEsdeveniment({ assaig }) {
  const [detalls, setDetalls] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { setTitol } = useTitol();

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

  const borrarEsdeveniment = (id) => {
    Swal.fire({
      title: "Estàs segur?",
      text: "No podràs recuperar aquest esdeveniment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, esborra!",
      cancelButtonText: "Cancel·la",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${BACKEND_URL}/borrar-esdeveniment/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status) {
              Swal.fire({
                title: "Esborrat!",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
              });
              if (assaig) navigate("/assaigs");
              else navigate("/diades");
            } else {
              console.error("Failed to delete esdeveniment");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
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
    Swal.fire({
      title: "Estàs segur?",
      text: `No podràs recuperar ${
        detalls.assaig ? "aquesta prova!" : "aquest castell!"
      }`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, esborra!",
      cancelButtonText: "Cancel·la",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${BACKEND_URL}/borrar-castell/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status) {
              Swal.fire({
                title: "Esborrat!",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
              }).then(() => window.location.reload());
            } else {
              console.error("Failed to delete castell");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
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

  const tipusElement = detalls.assaig ? "prova" : "castell";
  const tipusTitol = detalls.assaig ? "Proves" : "Castells";
  const routeAfegir = detalls.assaig ? `/nova-prova/${id}` : `/nou-castell/${id}`;

  return (
    <Box className="page" sx={{ position: "relative" }}>

      <Box
        display="flex"
        alignItems="center"
        sx={{ position: "absolute", top: 16, right: 0, gap: 1 }} 
      >
        <Fab 
          color="primary" 
          aria-label="edit" 
          size="small"
          onClick={() => editarEsdeveniment(detalls)}
        >
          <EditIcon fontSize="small" />
        </Fab>
        <Fab 
          color="primary" 
          aria-label="delete" 
          size="small"
          onClick={() => borrarEsdeveniment(id)}
        >
          <DeleteIcon fontSize="small" />
        </Fab>
      </Box>

      <Box className="detalls" mb={2}>
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

      <Box display="flex" alignItems="center" justifyContent="space-between">

        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {tipusTitol}
        </Typography>
        
        <Fab
          color="primary"
          aria-label="add"
          size="small"
          component={RouterLink}
          to={routeAfegir}
        >
          <AddIcon fontSize="small" />
        </Fab>

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