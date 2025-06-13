import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

function TaulaDetallsMembre({ membre }) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            <strong>Mote</strong>
                        </TableCell>
                        <TableCell>{membre.mote}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            <strong>Nom</strong>
                        </TableCell>
                        <TableCell>{membre.nom}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            <strong>Cognoms</strong>
                        </TableCell>
                        <TableCell>{membre.cognoms}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            <strong>Alçada de l'hombro</strong>
                        </TableCell>
                        <TableCell>{membre.alcada_hombro}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            <strong>Alçada de les mans</strong>
                        </TableCell>
                        <TableCell>{membre.alcada_mans}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            <strong>Comentaris</strong>
                        </TableCell>
                        <TableCell>{membre.comentaris}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TaulaDetallsMembre;
