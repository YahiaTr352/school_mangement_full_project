import * as React from 'react';
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';

const StudentSideBar = ({ toggleDrawer }) => {
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
                        <HomeIcon color={location.pathname === "/" || location.pathname === "/Student/dashboard" ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Home" 
                        primaryTypographyProps={{ 
                            style: { color: (location.pathname === "/" || location.pathname === "/Student/dashboard") ? '#4338CA' : 'inherit', fontWeight: (location.pathname === "/" || location.pathname === "/Student/dashboard") ? '700' : 'normal' } 
                        }} 
                    />
                </ListItemButton>
                <ListItemButton component={Link} to="/Student/subjects" onClick={handleItemClick}>
                    <ListItemIcon>
                        <AssignmentIcon color={location.pathname.startsWith("/Student/subjects") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Subjects" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Student/subjects') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Student/subjects') ? '700' : 'normal' } 
                        }}
                    />
                </ListItemButton>
                <ListItemButton component={Link} to="/Student/attendance" onClick={handleItemClick}>
                    <ListItemIcon>
                        <ClassOutlinedIcon color={location.pathname.startsWith("/Student/attendance") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Attendance" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Student/attendance') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Student/attendance') ? '700' : 'normal' } 
                        }}
                    />
                </ListItemButton>
                <ListItemButton component={Link} to="/Student/complain" onClick={handleItemClick}>
                    <ListItemIcon>
                        <AnnouncementOutlinedIcon color={location.pathname.startsWith("/Student/complain") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Complain" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Student/complain') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Student/complain') ? '700' : 'normal' } 
                        }}
                    />
                </ListItemButton>
            </React.Fragment>
            <Divider sx={{ my: 1 }} />
            <React.Fragment>
                <ListSubheader component="div" inset>
                    User
                </ListSubheader>
                <ListItemButton component={Link} to="/Student/profile" onClick={handleItemClick}>
                    <ListItemIcon>
                        <AccountCircleOutlinedIcon color={location.pathname.startsWith("/Student/profile") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Student/profile') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Student/profile') ? '700' : 'normal' } 
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

export default StudentSideBar