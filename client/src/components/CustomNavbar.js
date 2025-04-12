import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import NavbarListDrawer from "./NavbarListDrawer";
import { AppBar, Drawer, IconButton, Toolbar, Typography, Box, List, ListItemButton, ListItemText, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'; // Import ArrowBackIosNewIcon
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Swal from 'sweetalert2';
import '../styles/Navbar.css';
import { useTitol } from "../context/TitolNavbar";

function CustomNavbar() {
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get location object
    const { titol } = useTitol();

    // Define paths where the MenuIcon should be shown
    const menuPaths = [
        '/main',
        '/assaigs',
        '/diades',
        '/membres',
        '/perfil',
        '/configuracio'
    ];

    // Check if the current path is exactly one of the menu paths
    const showMenuIcon = menuPaths.includes(location.pathname);

    const handleBackClick = () => {
        navigate(-1); // Go back to the previous page
    };

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
        { title: "Perfil", path: "/perfil" },
        { title: "Configuració", path: "/configuracio" },
        {
            title: "Tanca sessió",
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
                        aria-label={showMenuIcon ? "menu" : "back"}
                        onClick={showMenuIcon ? () => setOpen(true) : handleBackClick} // Conditional onClick
                        // sx={{ display: { xs: 'flex', sm: 'none' } }} // Keep this if you only want the icon on small screens
                    >
                        {showMenuIcon ? <MenuIcon /> : <ArrowBackIosNewIcon />} {/* Conditional Icon */}
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

                {/* Drawer remains the same, controlled by 'open' state */}
                <Drawer
                    open={open}
                    anchor="left"
                    onClose={() => setOpen(false)}
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                >
                    <NavbarListDrawer
                        navLinks={navLinks}
                        profileLinks={profileLinks}
                        setOpen={setOpen}
                    />
                </Drawer>
            </AppBar>
            <Toolbar />
        </>
    );
}

export default CustomNavbar;