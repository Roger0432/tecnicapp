import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarListDrawer from "./NavbarListDrawer";
import { AppBar, Drawer, IconButton, Toolbar, Typography, Box, List, ListItemButton, ListItemText, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2';
import '../styles/Navbar.css';
import { useTitol } from "../context/TitolNavbar";

function CustomNavbar() {
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { titol } = useTitol();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const navLinks = [
        { title: "Menú", path: "/main" },
        { title: "Assaigs", path: "/assaigs" },
        { title: "Diades", path: "/diades" },
        { title: "Membres", path: "/membres" }
    ];

    const handleLogout = () => {
        Swal.fire({
            title: 'Tancar sessió?',
            showDenyButton: true,
            confirmButtonText: 'Sí',
            denyButtonText: 'Cancel·la',
            confirmButtonColor: '#dc3545',
            denyButtonColor: '#6c757d',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                navigate('/inicisessio');
            }
        });
    };

    const profileLinks = [
        { title: "Perfil", path: "/perfil", icon: <PersonIcon /> },
        { title: "Configuració", path: "/configuracio", icon: <SettingsIcon /> },
        { 
            title: "Tanca sessió", 
            icon: <LogoutIcon />, 
            onClick: (e) => {
                e.preventDefault();
                setOpen(false);
                handleLogout();
            }
        }
    ];

    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => setOpen(true)}
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                    >
                        <MenuIcon />
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
                            <Divider orientation="vertical" flexItem />

                            <ListItemButton>
                                <div className="dropdown">
                                    <AccountCircleIcon onClick={toggleDropdown} aria-expanded={dropdownOpen} />
                                    {dropdownOpen && (
                                        <div className="dropdown-content" inert={!dropdownOpen ? "" : undefined}>
                                            {
                                                profileLinks.map((item) => (
                                                    <ListItemButton 
                                                        key={item.title} 
                                                        component={Link} 
                                                        to={item.path} 
                                                        sx={{ color: 'black' }}
                                                        onClick={item.onClick}
                                                    >
                                                        {item.icon}
                                                        <ListItemText primary={item.title} />
                                                    </ListItemButton>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </ListItemButton>
                        </List>
                    </Box>

                </Toolbar>

                <Drawer
                    open={open}
                    anchor="left"
                    onClose={() => setOpen(false)}
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                >
                    <NavbarListDrawer navLinks={navLinks} profileLinks={profileLinks} />
                </Drawer>
            </AppBar>
            <Toolbar />
        </>
    );
}

export default CustomNavbar;