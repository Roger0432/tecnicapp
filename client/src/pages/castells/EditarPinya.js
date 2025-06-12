import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ReactComponent as PinyaPilar } from "../../svg/pinya-pilar.svg";
import {
  Box,
  Modal,
  Paper,
  Typography,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Fab,
  Tooltip,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EditarPinya = ({ castell, estructura }) => {
  const { id } = useParams();

  const [castellData, setCastellData] = useState(null);
  const [membresPinya, setMembresPinya] = useState([]);
  const [membresNoPinya, setMembresNoPinya] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const svgRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (castell) setCastellData(castell);
    else console.error("Castell no trobat");

    Promise.all([
      fetch(`${BACKEND_URL}/membres-no-pinya/${id}`).then((response) =>
        response.json()
      ),
      fetch(`${BACKEND_URL}/membres-pinya/${id}`).then((response) =>
        response.json()
      ),
    ])
      .then(([membresNoPinyaData, pinyaData]) => {
        if (membresNoPinyaData.status)
          setMembresNoPinya(membresNoPinyaData.membres);
        else console.error(membresNoPinyaData.msg);

        if (pinyaData.status) setMembresPinya(pinyaData.pinya);
        else console.error(pinyaData.msg);
      })
      .catch((error) => console.error("Error:", error));
  }, [id, castell]);

  useEffect(() => {
    if (svgRef.current) {
      membresPinya.forEach((membre) => {
        const textElement = svgRef.current.querySelector(
          `#text-${membre.posicio}`
        );
        if (textElement) {
          textElement.textContent = membre.mote;
        }
      });

      const formElements = svgRef.current.querySelectorAll(
        '[id^="baix-"], [id^="contrafort-"], [id^="agulla-"], [id^="rengla-"], [id^="lateral-"], [id^="crossa-"]'
      );

      formElements.forEach((element) => {
        element.style.cursor = "pointer";

        const newElement = element.cloneNode(true);
        if (element.parentNode) {
          element.parentNode.replaceChild(newElement, element);
        }

        newElement.addEventListener("click", () => {
          handleCellClick(newElement.id);
        });
      });

      const textElements = svgRef.current.querySelectorAll(
        '[id^="text-baix-"], [id^="text-contrafort-"], [id^="text-agulla-"], [id^="text-rengla-"], [id^="text-lateral-"], [id^="text-crossa-"]'
      );

      textElements.forEach((element) => {
        element.style.cursor = "pointer";

        const newElement = element.cloneNode(true);
        if (element.parentNode) {
          element.parentNode.replaceChild(newElement, element);
        }

        newElement.addEventListener("click", () => {
          const posicioId = newElement.id.replace("text-", "");
          handleCellClick(posicioId);
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membresPinya, castellData]);
  const handleCellClick = (posicio) => {
    setSelectedCell(posicio);
    setSearchTerm("");
  };

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredMembers = membresNoPinya.filter((membre) => {
    const normalizedSearchTerm = normalizeText(searchTerm);
    const normalizedMote = normalizeText(membre.mote);
    const normalizedFullName = normalizeText(`${membre.nom} ${membre.cognoms}`);

    return (
      normalizedMote.includes(normalizedSearchTerm) ||
      normalizedFullName.includes(normalizedSearchTerm)
    );
  });
  const handleMemberSelect = (membreSeleccionat) => {
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

    nousMembresPinya.push({ ...membreSeleccionat, posicio: selectedCell });

    const nousMembresNoPinya = [];
    for (let i = 0; i < membresNoPinyaActuals.length; i++) {
      if (membresNoPinyaActuals[i].id !== membreSeleccionat.id) {
        nousMembresNoPinya.push(membresNoPinyaActuals[i]);
      }
    }

    setMembresPinya(nousMembresPinya);
    setMembresNoPinya(nousMembresNoPinya);
    setSelectedCell(null);

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

    if (svgRef.current) {
      const textElement = svgRef.current.querySelector(`#text-${selectedCell}`);
      if (textElement) {
        textElement.textContent = "";
      }
    }
  };
  const handleCancelar = () => {
    setSelectedCell(null);
  };

  const handleGuardar = () => {
    fetch(`${BACKEND_URL}/actualitzar-pinya/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ membresPinya }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.status) {
          console.error(data.msg);
        } else {
          setSnackbarOpen(true);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (svgRef.current && membresPinya.length > 0) {
      membresPinya.forEach((membre) => {
        const textElement = svgRef.current.querySelector(
          `#text-${membre.posicio}`
        );
        if (textElement) {
          textElement.textContent = membre.mote;
        }
      });
    }
  }, [membresPinya]);

  let pinya_svg = null;
  if (castellData) {
    if (estructura === "pinya") {
      switch (parseInt(castellData.amplada)) {
        case 1:
          pinya_svg = (
            <PinyaPilar
              ref={svgRef}
              style={{ width: "100%", height: "100%" }}
            />
          );
          break;
        case 2:
        //pinya_svg = <PinyaTorre ref={svgRef} style={{ width: '100%', height: '100%' }} />;
        //break;
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
          console.error("Pinya no trobada");
          break;
      }
    } else if (estructura === "folre") {
      switch (parseInt(castellData.amplada)) {
        case 1:
          //pinya_svg = <FolrePilar ref={svgRef} style={{ width: '100%', height: '100%' }} />;
          break;
        case 2:
          //pinya_svg = <FolreTorre ref={svgRef} style={{ width: '100%', height: '100%' }} />;
          break;
        case 3:
          //if (castellData.agulla) pinya_svg = <FolreTresAgulla ref={svgRef} style={{ width: '100%', height: '100%' }} />;
          //else pinya_svg = <FolreTres ref={svgRef} style={{ width: '100%', height: '100%' }} />;
          break;
        case 4:
          //if (castellData.agulla) pinya_svg = <FolreQuatreAgulla ref={svgRef} style={{ width: '100%', height: '100%' }} />;
          //else pinya_svg = <FolreQuatre ref={svgRef} style={{ width: '100%', height: '100%' }} />;
          break;
        case 5:
          //pinya_svg = <FolreCinc ref={svgRef} style={{ width: '100%', height: '100%' }} />;
          break;
        case 7:
          //pinya_svg = <FolreSet ref={svgRef} style={{ width: '100%', height: '100%' }} />;
          break;
        default:
          console.error("Folre no trobat");
          break;
      }
    } else if (estructura === "manilles") {
      switch (parseInt(castellData.amplada)) {
        case 1:
          //pinya_svg = <ManillesPilar ref={svgRef} style={{ width: '100%', height: '100%' }} />;
          break;
        case 2:
          //pinya_svg = <ManillesTorre ref={svgRef} style={{ width: '100%', height: '100%' }} />;
          break;
        case 3:
        //pinya_svg = <ManillesTres ref={svgRef} style={{ width: '100%', height: '100%' }} />;
        default:
          console.error("Manilles no trobades");
          break;
      }
    } else if (estructura === "puntals") {
      switch (parseInt(castellData.amplada)) {
        case 1:
          //pinya_svg = <PuntalsPilar ref={svgRef} style={{ width: '100%', height: '100%' }} />;
          break;
        default:
          console.error("Puntals no trobats");
          break;
      }
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 112px)",
        position: "relative",
        overflow: "hidden",
        flex: 1,
      }}
    >
      <Box
        className="svg-container"
        sx={{
          flexGrow: 1,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <TransformWrapper
          defaultScale={1}
          defaultPositionX={0}
          defaultPositionY={0}
        >
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
            }}
            contentStyle={{
              width: "100%",
              height: "100%",
            }}
          >
            {pinya_svg}
          </TransformComponent>
        </TransformWrapper>
      </Box>{" "}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: "flex",
          justifyContent: "space-between",
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
      </Box>{" "}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{
          mb: 3,
          ml: 3,
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "auto" }}
        >
          Canvis guardats
        </Alert>
      </Snackbar>{" "}
      <Modal
        open={selectedCell !== null}
        onClose={handleCancelar}
        aria-labelledby="modal-seleccionar-membre"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            padding: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Selecciona membre
          </Typography>

          <Box
            sx={{
              position: "absolute",
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
              display: "flex",
              justifyContent: "space-between",
              ml: 2,
              mr: 2,
              mb: 1,
            }}
          >
            <span>Nom</span>
            <span>Alçada mans</span>
          </Typography>

          <List
            sx={{
              maxHeight: 400,
              overflow: "auto",
              border: "1px solid #e0e0e0",
              borderRadius: 1,
            }}
          >
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
                    <ListItemText primary={membre.mote} sx={{ ml: 1 }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mr: 1 }}
                    >
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
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
    </Box>
  );
};

export default EditarPinya;
