import * as React from 'react';
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import { useSelector } from 'react-redux';

const TeacherSideBar = ({ toggleDrawer }) => {
    const { currentUser } = useSelector((state) => state.user);
    const sclassName = currentUser.teachSclass

    const location = useLocation();

    const handleItemClick = () => {
        if (window.innerWidth < 600) {
            toggleDrawer();
        }
    };

    return (
        <>
            <React.Fragment>
                <ListItemButton component={Link} to="/" onClick={handleItemClick}>
                    <ListItemIcon>
                        <HomeIcon color={location.pathname === "/" || location.pathname === "/Teacher/dashboard" ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Home" 
                        primaryTypographyProps={{ 
                            style: { color: (location.pathname === "/" || location.pathname === "/Teacher/dashboard") ? '#4338CA' : 'inherit', fontWeight: (location.pathname === "/" || location.pathname === "/Teacher/dashboard") ? '700' : 'normal' } 
                        }} 
                    />
                </ListItemButton>
                <ListItemButton component={Link} to="/Teacher/class" onClick={handleItemClick}>
                    <ListItemIcon>
                        <ClassOutlinedIcon color={location.pathname.startsWith("/Teacher/class") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary={`Class ${sclassName.sclassName}`} 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Teacher/class') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Teacher/class') ? '700' : 'normal' } 
                        }}
                    />
                </ListItemButton>
                <ListItemButton component={Link} to="/Teacher/complain" onClick={handleItemClick}>
                    <ListItemIcon>
                        <AnnouncementOutlinedIcon color={location.pathname.startsWith("/Teacher/complain") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Complain" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Teacher/complain') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Teacher/complain') ? '700' : 'normal' } 
                        }}
                    />
                </ListItemButton>
            </React.Fragment>
            <Divider sx={{ my: 1 }} />
            <React.Fragment>
                <ListSubheader component="div" inset>
                    User
                </ListSubheader>
                <ListItemButton component={Link} to="/Teacher/profile" onClick={handleItemClick}>
                    <ListItemIcon>
                        <AccountCircleOutlinedIcon color={location.pathname.startsWith("/Teacher/profile") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Teacher/profile') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Teacher/profile') ? '700' : 'normal' } 
                        }}
                    />
                </ListItemButton>
                <ListItemButton component={Link} to="/logout" onClick={handleItemClick}>
                    <ListItemIcon>
                        <ExitToAppIcon color={location.pathname.startsWith("/logout") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/logout') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/logout') ? '700' : 'normal' } 
                        }}
                    />
                </ListItemButton>
            </React.Fragment>
        </>
    )
}

export default TeacherSideBar