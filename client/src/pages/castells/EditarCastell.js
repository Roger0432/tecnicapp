import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs, Box } from "@mui/material";
import EditarTronc from "./EditarTronc";
import EditarPinya from "./EditarPinya";
import "../../styles/Tronc.css";
import { useTitol } from "../../context/TitolNavbar";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function EditarCastell({ assaig }) {
  const { id } = useParams();
  const [value, setValue] = useState("tronc");
  const [castellData, setCastellData] = useState([]);
  const { setTitol } = useTitol();
  const [mostrarFolre, setMostrarFolre] = useState(false);
  const [mostrarManilles, setMostrarManilles] = useState(false);
  const [mostrarPuntals, setMostrarPuntals] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/castell/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setCastellData(data.castell);
          setTitol(data.castell.nom);

          if (data.castell.folre) setMostrarFolre(true);

          if (data.castell.manilles) setMostrarManilles(true);

          if (data.castell.puntals) setMostrarPuntals(true);
        } else {
          console.error(data.msg);
        }
      });
  }, [setTitol, id]);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ width: "100%" }}>
        <Tabs variant="fullWidth" value={value} onChange={handleChangeTab}>
          <Tab value="tronc" label="TRONC" />
          <Tab value="pinya" label="PINYA" />
          <Tab
            value="folre"
            label="FOLRE"
            sx={{ display: mostrarFolre ? "block" : "none" }}
          />
          <Tab
            value="manilles"
            label="MANILLES"
            sx={{ display: mostrarManilles ? "block" : "none" }}
          />
          <Tab
            value="puntals"
            label="PUNTALS"
            sx={{ display: mostrarPuntals ? "block" : "none" }}
          />
        </Tabs>
      </Box>

      {value === "tronc" ? (
        <EditarTronc castell={castellData} />
      ) : value === "pinya" ? (
        <EditarPinya castell={castellData} estructura="pinya" />
      ) : value === "folre" ? (
        <EditarPinya castell={castellData} estructura="folre" />
      ) : value === "manilles" ? (
        <EditarPinya castell={castellData} estructura="manilles" />
      ) : value === "puntals" ? (
        <EditarPinya castell={castellData} estructura="puntals" />
      ) : null}
    </Box>
  );
}

export default EditarCastell;
