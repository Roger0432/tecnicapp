import React, { useEffect, useState } from 'react';
import { ReactComponent as PinyaPilar } from '../../svg/pinya-pilar.svg';
import { Box } from '@mui/material';


const EditarPinya = ({ assaig, castell }) => {

    const [castellData, setCastellData] = useState(null);

    useEffect(() => {
        if (castell) setCastellData(castell);
        else console.error('Castell no trobat');
    }
    , [castell]);

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
        <Box m={1}>
            
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
            >
                {pinya_svg}
            </Box>

        </Box>
    );
};

export default EditarPinya;