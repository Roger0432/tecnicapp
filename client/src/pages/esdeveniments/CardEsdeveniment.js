import React from 'react';
import { Card, CardContent, Typography, CardActionArea, Box } from '@mui/material';

function CardEsdeveniment({ nom, dia, lloc, hora_inici, onClick }) {
  return (
    <Card sx={{ backgroundColor: 'var(--secondary-main)' }}>
      <CardActionArea onClick={onClick}>
        <CardContent>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" component="div" color="primary" style={{ fontWeight: 'bold' }}>
              {nom}
            </Typography>
            <Typography variant="body2" color="primary">
              {dia}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="primary">
              {lloc}
            </Typography>
            <Typography variant="body2" color="primary">
              {hora_inici}
            </Typography>
          </Box>

        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CardEsdeveniment;