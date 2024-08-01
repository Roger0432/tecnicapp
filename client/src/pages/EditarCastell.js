import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlantillaTronc from '../components/PlantillaTronc';
import '../styles/EditarCastell.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function EditarCastell() {
    const [castell, setCastell] = useState(null);
    const [membres, setMembres] = useState([]);
    const [membreSeleccionat, setMembreSeleccionat] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetch(`${BACKEND_URL}/castell/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    setCastell(data.castell);
                } 
                else {
                    console.error(data.msg);
                }
            })
            .catch(error => console.error('Error:', error));

        fetch(`${BACKEND_URL}/membres`)
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    setMembres(data.membres);
                } 
                else {
                    console.error(data.msg);
                }
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    const membreClicat = (membreId) => {
        setMembreSeleccionat(membreId);
        console.log(membreId);
    };

    if (!castell) {
        return <div>Carregant...</div>;
    }

    return (
        <div className="page">
            <h1>{castell.nom}</h1>

            <button className="guardar">Guardar</button>
            <br />
            
            <div className="content">

                <div className="plantilla">
                    <PlantillaTronc 
                        id={id}
                        files={parseInt(castell.alcada - 4, 10)} 
                        columnes={parseInt(castell.amplada, 10)} 
                        agulla={castell.agulla} 
                    />
                </div>

                <div className="membres">
                    {membres.map(membre => (
                        <div 
                            className="casteller" 
                            onClick={() => membreClicat(membre.id)}
                            key={membre.id}
                            style={{ backgroundColor: membre.id === membreSeleccionat ? 
                                'lightgrey' : 
                                'white' 
                            }}
                        >
                            {membre.mote}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default EditarCastell;
