import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { 
    Paper, Box, IconButton, Container, Typography, Stack, 
    Button, CircularProgress, Tooltip, ButtonGroup, 
    ClickAwayListener, Grow, Popper, MenuItem, MenuList 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

import TableTemplate from '../../../components/TableTemplate';
import { BlueButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowStudents = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { studentsList, loading, error, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllStudents(currentUser._id));
            })
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ]

    const studentRows = studentsList && studentsList.length > 0 && studentsList.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            sclassName: student.sclassName?.sclassName || "N/A",
            id: student._id,
        };
    })

    const StudentButtonHaver = ({ row }) => {
        const options = ['Take Attendance', 'Provide Marks'];
        const [open, setOpen] = useState(false);
        const anchorRef = useRef(null);
        const [selectedIndex, setSelectedIndex] = useState(0);

        const handleClick = () => {
            if (selectedIndex === 0) navigate("/Admin/students/student/attendance/" + row.id);
            else if (selectedIndex === 1) navigate("/Admin/students/student/marks/" + row.id);
        };

        const handleMenuItemClick = (event, index) => {
            setSelectedIndex(index);
            setOpen(false);
        };

        const handleToggle = () => setOpen((prevOpen) => !prevOpen);
        const handleClose = (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) return;
            setOpen(false);
        };

        return (
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                <Tooltip title="Delete">
                    <IconButton 
                        onClick={() => deleteHandler(row.id, "Student")}
                        sx={{ color: '#EF4444', '&:hover': { backgroundColor: '#FEE2E2' } }}
                    >
                        <PersonRemoveIcon />
                    </IconButton>
                </Tooltip>
                
                <BlueButton 
                    variant="contained"
                    startIcon={<VisibilityIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                    sx={{ 
                        borderRadius: '10px', 
                        textTransform: 'none', 
                        fontWeight: 600,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        padding: { xs: '8px 16px', sm: '6px 12px' }
                    }}
                >
                    View
                </BlueButton>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ButtonGroup 
                        variant="contained" 
                        ref={anchorRef} 
                        aria-label="split button"
                        sx={{ 
                            boxShadow: 'none',
                            '& .MuiButton-root': {
                                backgroundColor: '#4338CA',
                                borderRadius: '10px 0 0 10px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                padding: { xs: '4px 8px', sm: '6px 16px' },
                                '&:hover': { backgroundColor: '#3730A3' }
                            },
                            '& .MuiButton-containedSizeSmall': {
                                borderRadius: '0 10px 10px 0',
                                minWidth: { xs: '24px', sm: '32px' },
                                px: { xs: 0.5, sm: 1 }
                            }
                        }}
                    >
                        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                        <Button
                            size="small"
                            onClick={handleToggle}
                        >
                            {open ? <KeyboardArrowUp sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} /> : <KeyboardArrowDown sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                        </Button>
                    </ButtonGroup>
                    <Popper
                        sx={{ zIndex: 1 }}
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper sx={{ borderRadius: '12px', mt: 1, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu" autoFocusItem>
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option}
                                                    selected={index === selectedIndex}
                                                    onClick={(event) => handleMenuItemClick(event, index)}
                                                    sx={{ fontWeight: 600, fontSize: '0.9rem' }}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Box>
            </Stack>
        );
    };

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/addstudents")
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Students',
            action: () => deleteHandler(currentUser._id, "Students")
        },
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress sx={{ color: '#6366F1' }} />
                </Box>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        justifyContent="space-between" 
                        alignItems={{ xs: 'flex-start', sm: 'center' }} 
                        spacing={3} 
                        sx={{ mb: 4 }}
                    >
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                                <GroupIcon sx={{ color: '#6366F1', fontSize: { xs: 28, sm: 32 } }} />
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        color: '#1E1B4B', 
                                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                                    }}
                                >
                                    Students List
                                </Typography>
                            </Stack>
                            <Typography variant="body1" sx={{ color: '#64748B', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                Manage and view all students enrolled in <Box component="span" sx={{ fontWeight: 700, color: '#6366F1' }}>{currentUser.schoolName}</Box>
                            </Typography>
                        </Box>
                        
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate("/Admin/addstudents")}
                            sx={{
                                width: { xs: '100%', sm: 'auto' },
                                backgroundColor: '#6366F1',
                                '&:hover': { backgroundColor: '#4F46E5' },
                                borderRadius: '12px',
                                padding: { xs: '10px 16px', sm: '8px 20px' },
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                                boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)'
                            }}
                        >
                            Add Student
                        </Button>
                    </Stack>

                    {response ? (
                        <StyledPaper elevation={0} sx={{ textAlign: 'center', py: 10 }}>
                            <Typography variant="h6" sx={{ color: '#64748B', mb: 2 }}>
                                No students found.
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/Admin/addstudents")}
                                sx={{ borderRadius: '10px', textTransform: 'none' }}
                            >
                                Get Started by Adding a Student
                            </Button>
                        </StyledPaper>
                    ) : (
                        <StyledPaper elevation={0}>
                            {Array.isArray(studentsList) && studentsList.length > 0 && (
                                <TableTemplate 
                                    buttonHaver={StudentButtonHaver} 
                                    columns={studentColumns} 
                                    rows={studentRows} 
                                />
                            )}
                            <SpeedDialTemplate actions={actions} />
                        </StyledPaper>
                    )}
                </motion.div>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default ShowStudents;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: '24px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
  overflow: 'hidden'
}));