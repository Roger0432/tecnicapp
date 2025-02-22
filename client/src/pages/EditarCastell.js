import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import PlantillaTronc from '../components/PlantillaTronc';
import '../styles/EditarCastell.css';
import '../styles/Tronc.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function EditarCastell() {
    const [castell, setCastell] = useState(null);
    const { id } = useParams();

    const [tronc, setTronc] = useState([]);

    useEffect(() => {
        Promise.all([
            fetch(`${BACKEND_URL}/castell/${id}`).then(response => response.json()),
            fetch(`${BACKEND_URL}/membres-no-tronc/${id}`).then(response => response.json()),
            fetch(`${BACKEND_URL}/membres-tronc/${id}`).then(response => response.json())
        ])
        .then(([castellData, membresNoTroncData, troncData]) => {
            if (castellData.status) {
                setCastell(castellData.castell);
            } else {
                console.error(castellData.msg);
            }

            if (membresNoTroncData.status) {
                //setMembres(membresNoTroncData.membres);
            } else {
                console.error(membresNoTroncData.msg);
            }

            if (troncData.status) {
                setTronc(troncData.tronc);
            } else {
                console.error(troncData.msg);
            }
        })
        .catch(error => console.error('Error:', error));
    }, [id]);

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
                        files={parseInt(castell.alcada - 4, 10)} 
                        columnes={parseInt(castell.amplada, 10)} 
                        agulla={castell.agulla}
                        castellersTronc={tronc}
                    />
                </div>

            </div>
        </div>
    );
}

export default EditarCastell;
