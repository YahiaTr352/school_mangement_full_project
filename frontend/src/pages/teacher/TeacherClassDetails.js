import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { 
    Paper, Box, Typography, ButtonGroup, Button, Popper, Grow, 
    ClickAwayListener, MenuList, MenuItem, Container, Stack, 
    CircularProgress, Tooltip, IconButton, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import GroupIcon from '@mui/icons-material/Group';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SchoolIcon from '@mui/icons-material/School';

import TableTemplate from "../../components/TableTemplate";
import { BlueButton } from "../../components/buttonStyles";

const TeacherClassDetails = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);

    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclass?._id
    const subjectID = currentUser.teachSubject?._id

    useEffect(() => {
        if (classID) {
            dispatch(getClassStudents(classID));
        }
    }, [dispatch, classID])

    if (error) {
        console.log(error)
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ]

    const studentRows = sclassStudents && sclassStudents.length > 0 && sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    })

    const StudentsButtonHaver = ({ row }) => {
        const options = ['Take Attendance', 'Provide Marks'];

        const [open, setOpen] = useState(false);
        const anchorRef = useRef(null);
        const [selectedIndex, setSelectedIndex] = useState(0);

        const handleClick = () => {
            if (selectedIndex === 0) {
                navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`)
            } else if (selectedIndex === 1) {
                navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`)
            }
        };

        const handleMenuItemClick = (event, index) => {
            setSelectedIndex(index);
            setOpen(false);
        };

        const handleToggle = () => {
            setOpen((prevOpen) => !prevOpen);
        };

        const handleClose = (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return;
            }
            setOpen(false);
        };

        return (
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                <BlueButton
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate("/Teacher/class/student/" + row.id)}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
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
                                '&:hover': { backgroundColor: '#3730A3' }
                            },
                            '& .MuiButton-containedSizeSmall': {
                                borderRadius: '0 10px 10px 0',
                                minWidth: '32px',
                                px: 1
                            }
                        }}
                    >
                        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                        <Button
                            size="small"
                            onClick={handleToggle}
                        >
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
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
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                                <SchoolIcon sx={{ color: '#6366F1', fontSize: 32 }} />
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        color: '#1E1B4B', 
                                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                                    }}
                                >
                                    Class Management
                                </Typography>
                            </Stack>
                            <Typography variant="body1" sx={{ color: '#64748B' }}>
                                Managing students of <Box component="span" sx={{ fontWeight: 700, color: '#6366F1' }}>{currentUser.teachSclass?.sclassName}</Box>
                            </Typography>
                        </Box>

                        <Paper elevation={0} sx={{ 
                            p: '10px 24px', 
                            borderRadius: '16px', 
                            bgcolor: '#EEF2FF', 
                            border: '1px solid #E0E7FF',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" sx={{ color: '#6366F1', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Total Students
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#1E1B4B', fontWeight: 800, lineHeight: 1 }}>
                                    {sclassStudents ? sclassStudents.length : 0}
                                </Typography>
                            </Box>
                            <GroupIcon sx={{ color: '#6366F1', fontSize: 30 }} />
                        </Paper>
                    </Stack>

                    <Divider sx={{ mb: 4, borderStyle: 'dashed' }} />

                    {getresponse ? (
                        <StyledPaper elevation={0} sx={{ textAlign: 'center', py: 10 }}>
                            <Box sx={{ 
                                width: 80, height: 80, mx: 'auto', mb: 2, 
                                bgcolor: '#F1F5F9', color: '#94A3B8',
                                borderRadius: '24px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                <GroupIcon sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h5" sx={{ color: '#1E1B4B', fontWeight: 700, mb: 1 }}>
                                No Students Found
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748B' }}>
                                There are currently no students enrolled in this class.
                            </Typography>
                        </StyledPaper>
                    ) : (
                        <StyledPaper elevation={0}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AssignmentTurnedInIcon color="primary" /> Student Directory
                            </Typography>
                            {Array.isArray(sclassStudents) && sclassStudents.length > 0 && (
                                <TableTemplate 
                                    buttonHaver={StudentsButtonHaver} 
                                    columns={studentColumns} 
                                    rows={studentRows} 
                                />
                            )}
                        </StyledPaper>
                    )}
                </motion.div>
            )}
        </Container>
    );
};

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: '32px',
    borderRadius: '24px !important',
    backgroundColor: '#FFFFFF !important',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
    border: '1px solid #F1F5F9 !important',
    overflow: 'hidden'
}));

export default TeacherClassDetails;