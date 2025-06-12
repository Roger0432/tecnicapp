import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Modal, 
    Typography, 
    Card, 
    CardContent, 
    CardHeader, 
    IconButton, 
    Divider,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import caLocale from '@fullcalendar/core/locales/ca';
import { useTitol } from '../../context/TitolNavbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function CalendarEvents() {

    const { setTitol } = useTitol();
    const navigate = useNavigate();
    const [ esdeveniments, setEsdeveniments ] = useState([]);
    const [ selectedEvent, setSelectedEvent ] = useState(null);
    const [ modalOpen, setModalOpen ] = useState(false);

    useEffect(() => {
        setTitol('Calendari');
    }, [setTitol]);

      useEffect(() => {
        
        fetch(`${BACKEND_URL}/esdeveniments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        })        
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                
                const formattedEvents = data.esdeveniments.map(event => {
                      const fechaCalendario = convertirFormatoFecha(event.dia);
                    let startDateTime = null;
                    let endDateTime = null;
                    
                    if (fechaCalendario && event.hora_inici) {
                        const [hours, minutes] = event.hora_inici.split(':');
                        startDateTime = `${fechaCalendario}T${hours}:${minutes}:00`;
                    }
                    
                    if (fechaCalendario && event.hora_fi) {
                        const [hours, minutes] = event.hora_fi.split(':');
                        endDateTime = `${fechaCalendario}T${hours}:${minutes}:00`;
                    }
                    
                    return {
                        id: event.id,
                        title: event.nom,
                        start: startDateTime || fechaCalendario,
                        end: endDateTime,                        
                        allDay: !event.hora_inici,
                        extendedProps: {
                            ...event
                        }
                    };
                });
                
                setEsdeveniments(formattedEvents);
            } 
            else {
                console.error(data.msg);
            }
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });        
    }, []);      const convertirFormatoFecha = (fechaStr) => {
        if (!fechaStr) return null;
        
        try {
            const [dia, mes, anyo] = fechaStr.split('-');
            
            if (dia && mes && anyo) {
                const fecha = new Date(anyo, mes - 1, dia);
                
                if (isNaN(fecha.getTime())) {
                    console.error('Error al convertir la fecha:', fechaStr);
                    return null;
                }
                  return `${anyo}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
            }
            
            console.error('Formato de fecha incorrecto:', fechaStr);
            return null;
        } catch (error) {
            console.error('Error al procesar la fecha:', error, fechaStr);
            return null;
        }
    };

    return (
        <Box sx={{ padding: 2 }}>            
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                initialView="dayGridMonth"                  
                headerToolbar={{
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={
                    esdeveniments.map(event => ({
                        title: event.nom,
                        start: event.dia,
                        allDay: true,
                        extendedProps: {
                            location: event.lloc
                        }
                    }))
                }
                height="600px"
                locales={[esLocale, caLocale]}
                locale="ca"
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                eventDidMount={(info) => {
                    info.el.style.cursor = 'pointer';
                }}                
                eventClick={(info) => {
                    setSelectedEvent({
                        title: info.event.title,
                        start: info.event.start,
                        location: info.event.extendedProps.location
                    });
                    setModalOpen(true);
                }}/>
            
            {/* Modal per mostrar informació de l'esdeveniment */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Card sx={{ 
                    width: 400, 
                    maxWidth: '90vw',
                    outline: 'none',
                    boxShadow: 24,
                    borderRadius: 2
                }}>                    
                <CardHeader
                        title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EventIcon color="primary" />
                                <Typography variant="h6" component="h2">
                                    {selectedEvent?.title || 'Esdeveniment'}
                                </Typography>
                            </Box>
                        }
                        action={
                            <IconButton 
                                aria-label="tancar" 
                                onClick={() => setModalOpen(false)}
                                size="small"
                            >
                                <CloseIcon />
                            </IconButton>
                        }
                        sx={{ pb: 1 }}
                    />
                    <Divider />
                                        
                    <CardContent sx={{ pt: 2 }}>
                        {selectedEvent && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    
                                    <Typography variant="body1">
                                        {selectedEvent.start ? 
                                            new Date(selectedEvent.start).toLocaleDateString('ca-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'No disponible'
                                        }
                                    </Typography>
                                </Box>
                                
                                {selectedEvent.location && (
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocationOnIcon color="action" fontSize="small" />
                                            <Typography variant="body1">
                                                {selectedEvent.location}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Modal>
        </Box>
    );
}

export default CalendarEvents;