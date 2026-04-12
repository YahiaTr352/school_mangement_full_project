import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import {
    Paper, Table, TableBody, TableContainer,
    TableHead, TablePagination, Button, Box, IconButton,
    Container, Typography, Stack, CircularProgress, Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import { BlueButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowTeachers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)
    };

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'teachSubject', label: 'Subject', minWidth: 150 },
        { id: 'teachSclass', label: 'Class', minWidth: 170 },
    ];

    const rows = teachersList.map((teacher) => {
        return {
            name: teacher.name,
            teachSubject: teacher.teachSubject?.subName || null,
            teachSclass: teacher.teachSclass.sclassName,
            teachSclassID: teacher.teachSclass._id,
            id: teacher._id,
        };
    });

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Teacher',
            action: () => navigate("/Admin/teachers/chooseclass")
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Teachers',
            action: () => deleteHandler(currentUser._id, "Teachers")
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
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                                <GroupIcon sx={{ color: '#6366F1', fontSize: 32 }} />
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        color: '#1E1B4B', 
                                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                                    }}
                                >
                                    Teachers List
                                </Typography>
                            </Stack>
                            <Typography variant="body1" sx={{ color: '#64748B' }}>
                                Manage and view all faculty members of <Box component="span" sx={{ fontWeight: 700, color: '#6366F1' }}>{currentUser.schoolName}</Box>
                            </Typography>
                        </Box>
                        
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate("/Admin/teachers/chooseclass")}
                            sx={{
                                backgroundColor: '#6366F1',
                                '&:hover': { backgroundColor: '#4F46E5' },
                                borderRadius: '12px',
                                padding: '10px 24px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)'
                            }}
                        >
                            Add Teacher
                        </Button>
                    </Stack>

                    {response ? (
                        <StyledPaper elevation={0} sx={{ textAlign: 'center', py: 10 }}>
                            <Typography variant="h6" sx={{ color: '#64748B', mb: 2 }}>
                                No teachers found.
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/Admin/teachers/chooseclass")}
                                sx={{ borderRadius: '10px', textTransform: 'none' }}
                            >
                                Get Started by Adding a Teacher
                            </Button>
                        </StyledPaper>
                    ) : (
                        <StyledPaper elevation={0}>
                            <TableContainer>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <StyledTableRow>
                                            {columns.map((column) => (
                                                <StyledTableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth, fontWeight: 700 }}
                                                >
                                                    {column.label}
                                                </StyledTableCell>
                                            ))}
                                            <StyledTableCell align="center" style={{ fontWeight: 700 }}>
                                                Actions
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            if (column.id === 'teachSubject') {
                                                                return (
                                                                    <StyledTableCell key={column.id} align={column.align}>
                                                                        {value ? (
                                                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4338CA' }}>
                                                                                {value}
                                                                            </Typography>
                                                                        ) : (
                                                                            <Button 
                                                                                variant="outlined"
                                                                                size="small"
                                                                                startIcon={<LibraryAddIcon />}
                                                                                onClick={() => {
                                                                                    navigate(`/Admin/teachers/choosesubject/${row.teachSclassID}/${row.id}`)
                                                                                }}
                                                                                sx={{ borderRadius: '8px', textTransform: 'none' }}
                                                                            >
                                                                                Add Subject
                                                                            </Button>
                                                                        )}
                                                                    </StyledTableCell>
                                                                );
                                                            }
                                                            return (
                                                                <StyledTableCell key={column.id} align={column.align}>
                                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                                </StyledTableCell>
                                                            );
                                                        })}
                                                        <StyledTableCell align="center">
                                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                                <Tooltip title="Delete">
                                                                    <IconButton 
                                                                        onClick={() => deleteHandler(row.id, "Teacher")}
                                                                        sx={{ color: '#EF4444', '&:hover': { backgroundColor: '#FEE2E2' } }}
                                                                    >
                                                                        <PersonRemoveIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <BlueButton 
                                                                    variant="contained"
                                                                    startIcon={<VisibilityIcon />}
                                                                    onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}
                                                                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                                                                >
                                                                    View
                                                                </BlueButton>
                                                            </Stack>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(event, newPage) => setPage(newPage)}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(parseInt(event.target.value, 10));
                                    setPage(0);
                                }}
                            />
                            <SpeedDialTemplate actions={actions} />
                        </StyledPaper>
                    )}
                </motion.div>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default ShowTeachers;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: '24px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
  overflow: 'hidden'
}));