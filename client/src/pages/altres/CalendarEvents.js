import React, { useEffect, useState } from 'react';
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
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import caLocale from '@fullcalendar/core/locales/ca';
import { useTitol } from '../../context/TitolNavbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function CalendarEvents() {

    const { setTitol } = useTitol();
    const [ esdeveniments, setEsdeveniments ] = useState([]);
    const [ selectedEvent, setSelectedEvent ] = useState(null);
    const [ modalOpen, setModalOpen ] = useState(false);

    useEffect(() => {
        setTitol('Calendari');
    }, [setTitol]);
    
    useEffect(() => {
        
        fetch(`${BACKEND_URL}/events`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                setEsdeveniments(data.events);
            } 
            else {
                console.error(data.msg);
            }
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });        
    }, []);

    return (
        <Box sx={{ padding: 2 }}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
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
                }}                eventClick={(info) => {
                    setSelectedEvent({
                        title: info.event.title,
                        start: info.event.start,
                        location: info.event.extendedProps.location
                    });
                    setModalOpen(true);
                }}            />
            
            {/* Modal per mostrar informació de l'esdeveniment */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="event-modal-title"
                aria-describedby="event-modal-description"
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
                }}>                    <CardHeader
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
                    <Divider />                    <CardContent sx={{ pt: 2 }}>
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