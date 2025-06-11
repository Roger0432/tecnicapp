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
    Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
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
    const navigate = useNavigate();
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
                }}                events={
                    esdeveniments.map(event => ({
                        id: event.id,
                        title: event.nom,
                        start: event.dia,
                        allDay: true,
                        extendedProps: {
                            location: event.lloc,
                            eventId: event.id,
                            assaig: event.assaig
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
                        id: info.event.extendedProps.eventId,
                        title: info.event.title,
                        start: info.event.start,
                        location: info.event.extendedProps.location,
                        assaig: info.event.extendedProps.assaig
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
                                
                                <Typography variant="h6" component="h2">
                                    {selectedEvent?.title || "Esdeveniment"}
                                </Typography>                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => {
                                        if (selectedEvent) {
                                            const route = selectedEvent.assaig ? `/assaig/${selectedEvent.id}` : `/diada/${selectedEvent.id}`;
                                            navigate(route);
                                        }
                                    }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginLeft: '5px',
                                    }}
                                >
                                    <ArrowOutwardIcon />
                                </Button>

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
                           
                                {/* dia (dijous, 19 de juny del 2025) */}
                                {selectedEvent.start && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EventIcon color="action" fontSize="small" />
                                        <Typography variant="body1">
                                            {new Date(selectedEvent.start).toLocaleDateString('ca-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'  
                                            })}
                                        </Typography>
                                    </Box>
                                )}
                                
                                {/* hora (10:00 - 12:00) */}
                                {selectedEvent.start && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTimeIcon color="action" fontSize="small" />
                                        <Typography variant="body1">
                                            {new Date(selectedEvent.start).toLocaleTimeString('ca-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })} - {new Date(selectedEvent.start).toLocaleTimeString('ca-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Typography>
                                    </Box>
                                )}
                                
                                {/* lloc (Local de Capgrossos) */}
                                {selectedEvent.location && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOnIcon color="action" fontSize="small" />
                                        <Typography 
                                            variant="body1"
                                            component="span"
                                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.location)}`, '_blank')}
                                            sx={{ 
                                                cursor: 'pointer', 
                                                textDecoration: 'underline', 
                                                color: 'primary.main' 
                                            }}
                                        >
                                            {selectedEvent.location}
                                        </Typography>
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