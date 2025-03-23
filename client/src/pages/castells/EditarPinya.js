import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as PinyaPilar } from '../../svg/pinya-pilar.svg';
import { Box } from '@mui/material';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EditarPinya = ({assaig}) => {

    const { id } = useParams();
    const [castellData, setCastellData] = useState(null);

    useEffect(() => {
        fetch(`${BACKEND_URL}/castell/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                setCastellData(data.castell);
            } else {
                console.error(data.msg);
            }
        })
        .catch(error => console.error('Error:', error));
    }
    , [id]);

    let pinya_svg = null;
    if (castellData) {
        switch (parseInt(castellData.amplada)) {
            case 1:
                pinya_svg = <PinyaPilar />
                break;
            case 2:
                //pinya_svg = <PinyaTorre />
                break;
            case 3:
                //if (castellData.agulla) pinya_svg = <PinyaTresAgulla />
                //else pinya_svg = <PinyaTres />
                break;
            case 4:
                //if (castellData.agulla) pinya_svg = <PinyaQuatreAgulla />
                //else pinya_svg = <PinyaQuatre />
                break;
            case 5:
                //pinya_svg = <PinyaCinc />
                break;
            case 7:
                //pinya_svg = <PinyaSet />
                break;
            case 9:
                //pinya_svg = <PinyaNou />
                break;
            default:
                //pinya_svg = null;
                console.error('Pinya no trobada');
                break;
        }
    }

    return (
        <div className="page">
            
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
            >
                {pinya_svg}
            </Box>

        </div>
    );
};

export default EditarPinya;