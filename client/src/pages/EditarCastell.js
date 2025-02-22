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

    return (
        <div className="page">
            <h1>{castellData.nom}</h1>

            <button className="guardar">Guardar</button>
            <br />
            
            <div className="content">
                <div className="plantilla">
                   <PlantillaTronc 
                        files={parseInt(castellData.alcada - 4, 10)} 
                        columnes={parseInt(castellData.amplada, 10)} 
                        agulla={castellData.agulla}
                        castellersTronc={membresTronc}
                    />
                </div>

            </div>
            
        </div>
    );
}

export default EditarCastell;
