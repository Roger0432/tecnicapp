import React, { useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlantillaTronc from '../../components/PlantillaTronc';
import '../../styles/EditarCastell.css';
import '../../styles/Tronc.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function EditarCastell({assaig}) {
    const { id } = useParams();
    const [membresTronc, setMembresTronc] = useState([]);
    const [membresNoTronc, setMembresNoTronc] = useState([]);
    const [castellData, setCastellData] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const navigate = useNavigate();

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
        // 1. Creem una còpia de les llistes actuals per evitar mutacions directes
        const membresTroncActuals = [...membresTronc];
        const membresNoTroncActuals = [...membresNoTronc];
    
        // 2. Busquem si la cel·la seleccionada ja té un membre assignat
        let membreAnterior = null;
        for (let i = 0; i < membresTroncActuals.length; i++) {
            if (membresTroncActuals[i].posicio === selectedCell) {
                membreAnterior = membresTroncActuals[i]; // Guardem el membre anterior
                break;
            }
        }
    
        // 3. Si hi havia un membre anterior, l'afegim a membresNoTronc
        if (membreAnterior) {
            membresNoTroncActuals.push(membreAnterior); // Afegim tot l'objecte del membre
        }
    
        // 4. Eliminem el membre anterior del tronc (si n'hi havia)
        const nousMembresTronc = [];
        for (let i = 0; i < membresTroncActuals.length; i++) {
            if (membresTroncActuals[i].posicio !== selectedCell) {
                nousMembresTronc.push(membresTroncActuals[i]); // Conservem els membres que no són de la cel·la seleccionada
            }
        }
    
        // 5. Afegim el nou membre al tronc
        nousMembresTronc.push({ ...membreSeleccionat, posicio: selectedCell }); // Copiem tot l'objecte i afegim la posició
    
        // 6. Eliminem el membre seleccionat de membresNoTronc
        const nousMembresNoTronc = [];
        for (let i = 0; i < membresNoTroncActuals.length; i++) {
            if (membresNoTroncActuals[i].id !== membreSeleccionat.id) { // Comparem per id
                nousMembresNoTronc.push(membresNoTroncActuals[i]); // Conservem els membres que no són el seleccionat
            }
        }
    
        // 7. Actualitzem els estats amb les noves llistes
        setMembresTronc(nousMembresTronc);
        setMembresNoTronc(nousMembresNoTronc);
    
        // 8. Tanquem el pop-up
        setSelectedCell(null);
    };

    const handleEliminarMembre = () => {
        // 1. Creem una còpia de les llistes actuals per evitar mutacions directes
        const membresTroncActuals = [...membresTronc];
        const membresNoTroncActuals = [...membresNoTronc];
    
        // 2. Busquem el membre assignat a la cel·la seleccionada
        let membreAnterior = null;
        for (let i = 0; i < membresTroncActuals.length; i++) {
            if (membresTroncActuals[i].posicio === selectedCell) {
                membreAnterior = membresTroncActuals[i]; // Guardem el membre anterior
                break;
            }
        }
    
        // 3. Si hi havia un membre, l'afegim a membresNoTronc
        if (membreAnterior) {
            membresNoTroncActuals.push(membreAnterior); // Afegim tot l'objecte del membre
        }
    
        // 4. Eliminem el membre del tronc
        const nousMembresTronc = [];
        for (let i = 0; i < membresTroncActuals.length; i++) {
            if (membresTroncActuals[i].posicio !== selectedCell) {
                nousMembresTronc.push(membresTroncActuals[i]); // Conservem els membres que no són de la cel·la seleccionada
            }
        }
    
        // 5. Actualitzem els estats amb les noves llistes
        setMembresTronc(nousMembresTronc);
        setMembresNoTronc(membresNoTroncActuals);
    
        // 6. Tanquem el pop-up
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
            body: JSON.stringify({ membresTronc }) // Enviem les dades dins d'un objecte
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                if (assaig) navigate(`/assaigs`);
                else navigate(`/diades/`);
            } else {
                console.error(data.msg);
            }
        })
        .catch(error => console.error('Error:', error));
    };

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