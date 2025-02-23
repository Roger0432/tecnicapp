import React from "react";
import { Link } from "react-router-dom";
import { List, ListItemButton, ListItemText, Box, Divider } from "@mui/material";

function NavbarListDrawer({ navLinks, profileLinks }) {

    return (
        <Box sx={{ width: 250 }} role="presentation">
            <List>
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
                        <ListItemButton key={item.title} component={Link} to={item.path}>
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