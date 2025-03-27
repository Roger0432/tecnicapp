import React from "react";
import { Link } from "react-router-dom";
import { List, ListItemButton, ListItemText, Box, Divider } from "@mui/material";

function NavbarListDrawer({ navLinks, profileLinks, setOpen }) {

    const handleClick = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ width: 250 }} role="presentation">
            <List>
                <ListItemButton 
                    component={Link} 
                    to="/main"
                    onClick={handleClick}  // Afegim onClick
                >
                    <Box
                        component="img"
                        sx={{
                            height: 64,
                            width: 64,
                            display: 'block',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            margin: 0
                        }}
                        alt="Escut Passerells"
                        src="/img/escut_passerells.png"
                    />  
                </ListItemButton>
                <Divider />
                {
                    navLinks.map((item) => (
                        <ListItemButton 
                            key={item.title} 
                            component={Link} 
                            to={item.path}
                            onClick={handleClick}
                        >
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    ))
                }
                <Divider />
                {
                    profileLinks.map((item) => (
                        <ListItemButton 
                            key={item.title} 
                            component={Link} 
                            to={item.path}
                            onClick={(e) => {
                                handleClick();
                                if (item.onClick) item.onClick(e);
                            }}
                        >
                            {item.icon}
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    ))
                }
            </List>
        </Box>
    );
}

export default NavbarListDrawer;