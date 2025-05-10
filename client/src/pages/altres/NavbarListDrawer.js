import React from "react";
import { Link } from "react-router-dom";
import { 
  List, 
  ListItemButton, 
  ListItemText, 
  ListItemIcon,
  Box, 
  Divider, 
  Typography, 
  Avatar,
  Paper,
  useTheme
} from "@mui/material";

import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function NavbarListDrawer({ navLinks, setOpen }) {
    const theme = useTheme();

    const handleClick = () => {
        setOpen(false);
    };

    const getIconByPath = (path) => {
        switch(path) {
            case "/main":
                return <HomeIcon />;
            case "/assaigs":
                return <EventIcon />;
            case "/diades":
                return <EmojiEventsIcon />;
            case "/membres":
                return <PeopleIcon />;
            case "/perfil":
                return <AccountCircleIcon />;
            default:
                return <HomeIcon />;
        }
    };

    return (
        <Paper 
            sx={{ 
                width: 250,
                height: '100%',
                overflow: 'auto',
                bgcolor: theme.palette.background.paper,
                borderRadius: 0
            }} 
        >
            <Box 
                sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                }}
            >
                <Avatar
                    src="/img/escut_passerells.png"
                    alt="Escut Passerells"
                    sx={{ 
                        width: 80, 
                        height: 80, 
                        mb: 1
                    }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Passerells
                </Typography>
                <Typography variant="subtitle2">
                    del TecnoCampus
                </Typography>
            </Box>
            
            <Divider />
            
            <List component="nav" sx={{ pt: 1 }}>
                {
                    navLinks.map((item) => (
                        <ListItemButton 
                            key={item.title} 
                            component={Link} 
                            to={item.path}
                            onClick={handleClick}
                            sx={{
                                borderRadius: 1,
                                mx: 1,
                                mb: 0.5,
                                '&:hover': {
                                    bgcolor: theme.palette.action.hover,
                                }
                            }}
                        >
                            <ListItemIcon>
                                {getIconByPath(item.path)}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.title} 
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                        </ListItemButton>
                    ))
                }                
            </List>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Divider sx={{ mt: 'auto' }} />
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    © Tecnicapp {new Date().getFullYear()}
                </Typography>
            </Box>
        </Paper>
    );
}

export default NavbarListDrawer;