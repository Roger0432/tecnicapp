import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import PlantillaTronc from '../components/PlantillaTronc';
import '../styles/EditarCastell.css';
import '../styles/Tronc.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function EditarCastell() {
    const { id } = useParams();
    const [membresTronc, setMembresTronc] = useState([]);
    const [membresNoTronc, setMembresNoTronc] = useState([]);
    const [castellData, setCastellData] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);

    useEffect(() => {
        Promise.all([
            fetch(`${BACKEND_URL}/castell/${id}`).then(response => response.json()),
            fetch(`${BACKEND_URL}/membres-no-tronc/${id}`).then(response => response.json()),
            fetch(`${BACKEND_URL}/membres-tronc/${id}`).then(response => response.json())
        ])
        .then(([castellData, membresNoTroncData, troncData]) => {
            if (castellData.status) setCastellData(castellData.castell);
            else console.error(castellData.msg);

            if (membresNoTroncData.status) setMembresNoTronc(membresNoTroncData.membres);
            else console.error(membresNoTroncData.msg);

            if (troncData.status) setMembresTronc(troncData.tronc);
            else console.error(troncData.msg);
        })
        .catch(error => console.error('Error:', error));
    }, [id]);

    const handleCellClick = (posicio) => {
        setSelectedCell(posicio);
    };

    const handleMemberSelect = (membreSeleccionat) => {
        //Creem una còpia de les llistes actuals
        const membresTroncActuals = [...membresTronc];
        const membresNoTroncActuals = [...membresNoTronc];

        //Busquem si la cel·la seleccionada ja té un membre assignat
        let membreAnterior = null;
        for (let i = 0; i < membresTroncActuals.length; i++) {
            if (membresTroncActuals[i].posicio === selectedCell) {
                membreAnterior = membresTroncActuals[i];
                break;
            }
        }
    
        //Si hi havia un membre anterior, l'afegim a membresNoTronc
        if (membreAnterior) {
            membresNoTroncActuals.push({ mote: membreAnterior.mote });
        }
    
        //Eliminem el membre anterior del tronc (si n'hi havia)
        const nousMembresTronc = [];
        for (let i = 0; i < membresTroncActuals.length; i++) {
            if (membresTroncActuals[i].posicio !== selectedCell) {
                nousMembresTronc.push(membresTroncActuals[i]);
            }
        }
    
        //Afegim el nou membre al tronc
        nousMembresTronc.push({ posicio: selectedCell, mote: membreSeleccionat.mote });
    
        //Eliminem el membre seleccionat de membresNoTronc
        const nousMembresNoTronc = [];
        for (let i = 0; i < membresNoTroncActuals.length; i++) {
            if (membresNoTroncActuals[i].mote !== membreSeleccionat.mote) {
                nousMembresNoTronc.push(membresNoTroncActuals[i]);
            }
        }
    
        //Actualitzem els estats amb les noves llistes
        setMembresTronc(nousMembresTronc);
        setMembresNoTronc(nousMembresNoTronc);
    
        //Tanquem el pop-up
        setSelectedCell(null);
    };

    const handleEliminarMembre = () => {
        // Creem una còpia de les llistes actuals
        const membresTroncActuals = [...membresTronc];
        const membresNoTroncActuals = [...membresNoTronc];
    
        //Busquem el membre assignat a la cel·la seleccionada
        let membreAnterior = null;
        for (let i = 0; i < membresTroncActuals.length; i++) {
            if (membresTroncActuals[i].posicio === selectedCell) {
                membreAnterior = membresTroncActuals[i];
                break;
            }
        }
    
        //Si hi havia un membre, l'afegim a membresNoTronc
        if (membreAnterior) {
            membresNoTroncActuals.push({ mote: membreAnterior.mote });
        }
    
        //Eliminem el membre del tronc
        const nousMembresTronc = [];
        for (let i = 0; i < membresTroncActuals.length; i++) {
            if (membresTroncActuals[i].posicio !== selectedCell) {
                nousMembresTronc.push(membresTroncActuals[i]);
            }
        }
    
        //Actualitzem els estats amb les noves llistes
        setMembresTronc(nousMembresTronc);
        setMembresNoTronc(membresNoTroncActuals);
    
        //Tanquem el pop-up
        setSelectedCell(null);
    };

    const handleCancelar = () => {
        setSelectedCell(null);
    };

    const handleGuardar = () => {
        console.log("membresTronc", membresTronc);
        console.log("membresNoTronc", membresNoTronc);
        /*
        fetch(`${BACKEND_URL}/actualitzar-tronc/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(membresTronc, membresNoTronc)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                console.log('Dades guardades correctament');
            } else {
                console.error(data.msg);
            }
        })
        .catch(error => console.error('Error:', error));
        */
    }

    return (
        <div className="page">
            <h1>{castellData.nom}</h1>

            <button onClick={handleGuardar} className="guardar">Guardar</button>
            <br />
            
            <div className="content">
                <div className="plantilla">
                   <PlantillaTronc 
                        files={parseInt(castellData.alcada - 4, 10)} 
                        columnes={parseInt(castellData.amplada, 10)} 
                        agulla={castellData.agulla}
                        castellersTronc={membresTronc}
                        onCellClick={handleCellClick}
                    />
                </div>

                {selectedCell && (
                    <div className="popup">
                        <ul>
                            {membresNoTronc.map(membre => (
                                <li key={membre.mote} onClick={() => handleMemberSelect(membre)}>
                                    {membre.mote}
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleEliminarMembre}>Eliminar membre del tronc</button>
                        <button onClick={handleCancelar}>Cancel·lar</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditarCastell;