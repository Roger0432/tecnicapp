import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlantillaTronc from '../components/PlantillaTronc';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function EditarCastell() {
    const [castell, setCastell] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetch(`${BACKEND_URL}/castell/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    setCastell(data.castell);
                } else {
                    console.error(data.msg);
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
            <PlantillaTronc files={parseInt(castell.alcada - 4, 10)} columnes={parseInt(castell.amplada, 10)} />
        </div>
    );
}

export default EditarCastell;
