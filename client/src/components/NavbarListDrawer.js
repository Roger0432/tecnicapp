import React from "react";
import { Link } from "react-router-dom";
import { List, ListItemButton, ListItemText, Box, Divider } from "@mui/material";

function NavbarListDrawer({ navLinks, profileLinks }) {

    return (
        <Box sx={{ width: 250 }} role="presentation">
            <List>
                <ListItemButton component={Link} to="/main">
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
                        <ListItemButton key={item.title} component={Link} to={item.path}>
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
                            onClick={item.onClick}
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