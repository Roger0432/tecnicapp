import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NavbarListDrawer from "./NavbarListDrawer";
import { AppBar, Drawer, IconButton, Toolbar, Typography, Box, List, ListItemButton, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useTitol } from "../../context/TitolNavbar";

function CustomNavbar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { titol } = useTitol();

    const menuPaths = [
        '/',
        '/main',
        '/assaigs',
        '/diades',
        '/membres',
        '/perfil',
    ];

    const showMenuIcon = menuPaths.includes(location.pathname);

    const handleBackClick = () => {
        navigate(-1);
    };

    const navLinks = [
        { title: "Menú", path: "/main" },
        { title: "Assaigs", path: "/assaigs" },
        { title: "Diades", path: "/diades" },
        { title: "Membres", path: "/membres" },
        { title: "Perfil", path: "/perfil" },
    ];

    return (
        <Box>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label={showMenuIcon ? "menu" : "back"}
                        onClick={showMenuIcon ? () => setOpen(true) : handleBackClick}
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                    >
                        {showMenuIcon ? <MenuIcon /> : <ArrowBackIosNewIcon fontSize="small" />}
                    </IconButton>

                    <Typography variant="h6">{titol}</Typography>

                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, ml: 'auto' }}>
                        <List component="nav" sx={{ display: 'flex', flexDirection: 'row' }}>
                            {
                                navLinks.map((item) => (
                                    <ListItemButton key={item.title} component={Link} to={item.path}>
                                        <ListItemText primary={item.title} />
                                    </ListItemButton>
                                ))
                            }
                        </List>
                    </Box>

                </Toolbar>

                <Drawer
                    open={open}
                    anchor="left"
                    onClose={() => setOpen(false)}
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                >
                    <NavbarListDrawer
                        navLinks={navLinks}
                        setOpen={setOpen}
                    />
                </Drawer>
            </AppBar>
            <Toolbar />
        </Box>
    );
}

export default CustomNavbar;