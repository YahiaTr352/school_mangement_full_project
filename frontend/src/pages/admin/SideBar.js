import * as React from 'react';
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import ReportIcon from '@mui/icons-material/Report';
import AssignmentIcon from '@mui/icons-material/Assignment';

const SideBar = ({ toggleDrawer }) => {
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
                        <HomeIcon color={location.pathname === "/" || location.pathname === "/Admin/dashboard" ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Home" 
                        primaryTypographyProps={{ 
                            style: { color: (location.pathname === "/" || location.pathname === "/Admin/dashboard") ? '#4338CA' : 'inherit', fontWeight: (location.pathname === "/" || location.pathname === "/Admin/dashboard") ? '700' : 'normal' } 
                        }} 
                    />
                </ListItemButton>
                <ListItemButton component={Link} to="/Admin/classes" onClick={handleItemClick}>
                    <ListItemIcon>
                        <ClassOutlinedIcon color={location.pathname.startsWith('/Admin/classes') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Classes" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Admin/classes') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Admin/classes') ? '700' : 'normal' } 
                        }}
                    />
                </ListItemButton>
                <ListItemButton component={Link} to="/Admin/subjects" onClick={handleItemClick}>
                    <ListItemIcon>
                        <AssignmentIcon color={location.pathname.startsWith("/Admin/subjects") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Subjects" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Admin/subjects') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Admin/subjects') ? '700' : 'normal' } 
                        }}
                    />
                </ListItemButton>
                <ListItemButton component={Link} to="/Admin/teachers" onClick={handleItemClick}>
                    <ListItemIcon>
                        <SupervisorAccountOutlinedIcon color={location.pathname.startsWith("/Admin/teachers") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Teachers" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Admin/teachers') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Admin/teachers') ? '700' : 'normal' } 
                        }}
                    />
                </ListItemButton>
                <ListItemButton component={Link} to="/Admin/students" onClick={handleItemClick}>
                    <ListItemIcon>
                        <PersonOutlineIcon color={location.pathname.startsWith("/Admin/students") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Students" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Admin/students') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Admin/students') ? '700' : 'normal' } 
                        }}
                    />
                </ListItemButton>
                <ListItemButton component={Link} to="/Admin/notices" onClick={handleItemClick}>
                    <ListItemIcon>
                        <AnnouncementOutlinedIcon color={location.pathname.startsWith("/Admin/notices") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Notices" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Admin/notices') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Admin/notices') ? '700' : 'normal' } 
                        }}
                    />
                </ListItemButton>
                <ListItemButton component={Link} to="/Admin/complains" onClick={handleItemClick}>
                    <ListItemIcon>
                        <ReportIcon color={location.pathname.startsWith("/Admin/complains") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Complains" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Admin/complains') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Admin/complains') ? '700' : 'normal' } 
                        }}
                    />
                </ListItemButton>
            </React.Fragment>
            <Divider sx={{ my: 1 }} />
            <React.Fragment>
                <ListSubheader component="div" inset>
                    User
                </ListSubheader>
                <ListItemButton component={Link} to="/Admin/profile" onClick={handleItemClick}>
                    <ListItemIcon>
                        <AccountCircleOutlinedIcon color={location.pathname.startsWith("/Admin/profile") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" 
                        primaryTypographyProps={{ 
                            style: { color: location.pathname.startsWith('/Admin/profile') ? '#4338CA' : 'inherit', fontWeight: location.pathname.startsWith('/Admin/profile') ? '700' : 'normal' } 
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

export default SideBar
