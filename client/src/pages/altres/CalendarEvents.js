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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
    const [esdeveniments, setEsdeveniments] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setTitol('Calendari');
    }, [setTitol]);

    useEffect(() => {
        fetch(`${BACKEND_URL}/esdeveniments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    const formattedEvents = data.esdeveniments.map((event) => {
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
                                ...event,
                            },
                        };
                    });

                    setEsdeveniments(formattedEvents);
                } else {
                    console.error(data.msg);
                }
            })
            .catch((error) => {
                console.error('Error fetching events:', error);
            });
    }, []);
    const convertirFormatoFecha = (fechaStr) => {
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
                    left: 'prev',
                    right: 'next',
                }}
                footerToolbar={{
                    center: '',
                    left: 'today',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
                }}
                titleFormat={(date) => {
                    const month = date.date.marker.toLocaleDateString('ca-ES', { month: 'long' });
                    const year = date.date.marker.getFullYear();

                    const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

                    return `${monthCapitalized} del ${year}`;
                }}
                views={{
                    listMonth: {
                        buttonText: 'Agenda',
                    },
                }}
                events={esdeveniments}
                height="85vh"
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
                        ...info.event.extendedProps,
                    });
                    setModalOpen(true);
                }}
            />

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
                <Card
                    sx={{
                        width: 400,
                        maxWidth: '90vw',
                        outline: 'none',
                        boxShadow: 24,
                        borderRadius: 2,
                    }}
                >
                    <CardHeader
                        title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography
                                    variant="h6"
                                    component="h2"
                                    onClick={() => {
                                        if (selectedEvent) {
                                            const route = selectedEvent.assaig
                                                ? `/assaig/${selectedEvent.id}`
                                                : `/diada/${selectedEvent.id}`;
                                            navigate(route);
                                        }
                                    }}
                                    sx={{
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        color: 'primary.main',
                                    }}
                                >
                                    {selectedEvent?.nom || 'Esdeveniment'}
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
                                {/* dia (dijous, 19 de juny del 2025) */}
                                {selectedEvent.dia && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EventIcon color="action" fontSize="small" />
                                        <Typography variant="body1">
                                            {(() => {
                                                const [dia, mes, anyo] = selectedEvent.dia
                                                    .split('-')
                                                    .map((num) => parseInt(num, 10));
                                                const fecha = new Date(anyo, mes - 1, dia);

                                                if (isNaN(fecha.getTime())) {
                                                    console.error(
                                                        'Fecha inválida:',
                                                        selectedEvent.dia
                                                    );
                                                    return selectedEvent.dia;
                                                }

                                                const dateString = fecha.toLocaleDateString(
                                                    'ca-ES',
                                                    {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    }
                                                );
                                                return (
                                                    dateString.charAt(0).toUpperCase() +
                                                    dateString.slice(1)
                                                );
                                            })()}
                                        </Typography>
                                    </Box>
                                )}

                                {/* hora (10:00 - 12:00) */}
                                {selectedEvent.hora_inici && selectedEvent.hora_fi && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTimeIcon color="action" fontSize="small" />
                                        <Typography variant="body1">
                                            {selectedEvent.hora_inici} - {selectedEvent.hora_fi}
                                        </Typography>
                                    </Box>
                                )}
                                {/* lloc (Local de Capgrossos) */}
                                {selectedEvent.lloc && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOnIcon color="action" fontSize="small" />
                                        <Typography
                                            variant="body1"
                                            component="span"
                                            onClick={() =>
                                                window.open(
                                                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.lloc)}`,
                                                    '_blank'
                                                )
                                            }
                                            sx={{
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                                color: 'primary.main',
                                            }}
                                        >
                                            {selectedEvent.lloc}
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
