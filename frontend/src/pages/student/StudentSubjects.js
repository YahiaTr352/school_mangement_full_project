import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { 
    BottomNavigation, 
    BottomNavigationAction, 
    Container, 
    Paper, 
    Table, 
    TableBody, 
    TableHead, 
    Typography, 
    Box, 
    Grid,
    CircularProgress,
    Stack,
    Chip,
    TableContainer,
    TableCell
} from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

import {
    InsertChart as InsertChartIcon,
    InsertChartOutlined as InsertChartOutlinedIcon,
    TableChart as TableChartIcon,
    TableChartOutlined as TableChartOutlinedIcon,
    Assignment as AssignmentIcon,
    Class as ClassIcon,
    MenuBook as MenuBookIcon
} from '@mui/icons-material';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const StudentSubjects = () => {
    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
        }
    }, [userDetails]);

    useEffect(() => {
        if (subjectMarks.length === 0) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [subjectMarks.length, dispatch, currentUser.sclassName._id]);

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <StyledPaper elevation={0} sx={{ p: { xs: 2, sm: 4 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                    <AssignmentIcon sx={{ color: '#6366F1', fontSize: { xs: 22, sm: 24 } }} />
                    <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: '#1E1B4B', 
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                        Examination Results
                    </Typography>
                </Stack>
                <StyledTableContainer>
                    <Table size={window.innerWidth < 600 ? "small" : "medium"}>
                        <TableHead>
                            <StyledTableRow>
                                <HeaderTableCell sx={{ px: { xs: 1, sm: 2 } }}>Subject Name</HeaderTableCell>
                                <HeaderTableCell align="center" sx={{ px: { xs: 1, sm: 2 } }}>Marks Obtained</HeaderTableCell>
                                <HeaderTableCell align="center" sx={{ px: { xs: 1, sm: 2 } }}>Status</HeaderTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {subjectMarks.map((result, index) => {
                                if (!result.subName || result.marksObtained === undefined) return null;
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell sx={{ fontWeight: 600, px: { xs: 1, sm: 2 }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                            {result.subName.subName}
                                        </StyledTableCell>
                                        <StyledTableCell align="center" sx={{ px: { xs: 1, sm: 2 } }}>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#6366F1', fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                                                {result.marksObtained}
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center" sx={{ px: { xs: 1, sm: 2 } }}>
                                            <Chip 
                                                label={result.marksObtained >= 33 ? "Pass" : "Fail"} 
                                                color={result.marksObtained >= 33 ? "success" : "error"}
                                                size="small"
                                                sx={{ fontWeight: 700, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                                            />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </StyledPaper>
        </motion.div>
    );

    const renderChartSection = () => (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <StyledPaper elevation={0} sx={{ p: { xs: 2, sm: 4 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                    <InsertChartIcon sx={{ color: '#6366F1', fontSize: { xs: 22, sm: 24 } }} />
                    <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: '#1E1B4B', 
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                        Performance Analytics
                    </Typography>
                </Stack>
                <Box sx={{ width: '100%', mt: 2, overflowX: 'auto' }}>
                    <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                </Box>
            </StyledPaper>
        </motion.div>
    );

    const renderClassDetailsSection = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Container maxWidth="md">
                <StyledPaper elevation={0} sx={{ textAlign: 'center', py: { xs: 4, sm: 6 }, px: { xs: 2, sm: 4 } }}>
                    <ClassIcon sx={{ fontSize: { xs: 50, sm: 60 }, color: '#6366F1', mb: 2 }} />
                    <Typography variant="h4" sx={{ 
                        fontWeight: 800, 
                        color: '#1E1B4B', 
                        mb: 1, 
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontSize: { xs: '1.5rem', sm: '2.125rem' }
                    }}>
                        Class Details
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#64748B', mb: 4, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                        You are enrolled in <Box component="span" sx={{ color: '#6366F1', fontWeight: 700 }}>{currentUser.sclassName.sclassName}</Box>
                    </Typography>
                    
                    <Typography variant="subtitle1" sx={{ 
                        fontWeight: 700, 
                        color: '#475569', 
                        mb: 3, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.1em',
                        fontSize: { xs: '0.8rem', sm: '1rem' }
                    }}>
                        Current Subjects
                    </Typography>
                    
                    <Grid container spacing={2} justifyContent="center">
                        {subjectsList && subjectsList.map((subject, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <SubjectCard sx={{ p: { xs: 2, sm: 2.5 } }}>
                                    <MenuBookIcon sx={{ color: '#6366F1', mr: 2, fontSize: { xs: 20, sm: 24 } }} />
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1E1B4B', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                            {subject.subName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                            Code: {subject.subCode}
                                        </Typography>
                                    </Box>
                                </SubjectCard>
                            </Grid>
                        ))}
                    </Grid>
                </StyledPaper>
            </Container>
        </motion.div>
    );

    return (
        <StyledRoot>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 12 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <CircularProgress sx={{ color: '#6366F1' }} />
                    </Box>
                ) : (
                    <AnimatePresence mode="wait">
                        {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                            <Box key="marks-content">
                                {selectedSection === 'table' ? renderTableSection() : renderChartSection()}
                                
                                <NavPaper elevation={10} sx={{ width: { xs: '90%', sm: 'max-content' } }}>
                                    <StyledBottomNavigation 
                                        value={selectedSection} 
                                        onChange={handleSectionChange} 
                                        showLabels
                                        sx={{ minWidth: { xs: '100%', sm: '350px' } }}
                                    >
                                        <BottomNavigationAction
                                            label="Results"
                                            value="table"
                                            icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                        />
                                        <BottomNavigationAction
                                            label="Performance"
                                            value="chart"
                                            icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                        />
                                    </StyledBottomNavigation>
                                </NavPaper>
                            </Box>
                        ) : (
                            <Box key="class-content">
                                {renderClassDetailsSection()}
                            </Box>
                        )}
                    </AnimatePresence>
                )}
            </Container>
        </StyledRoot>
    );
};

export default StudentSubjects;

// Styled Components
const StyledRoot = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '24px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #F1F5F9',
}));

const HeaderTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#F8FAFC',
    color: '#64748B',
    fontWeight: 700,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '20px',
    [theme.breakpoints.down('sm')]: {
        padding: '12px 8px',
        fontSize: '0.7rem',
    },
}));

const SubjectCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        borderColor: '#6366F1',
        backgroundColor: '#EEF2FF',
        transform: 'translateY(-2px)',
    },
}));

const NavPaper = styled(Paper)(({ theme }) => ({
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '50px',
    overflow: 'hidden',
    zIndex: 1000,
    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
}));

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
    backgroundColor: 'transparent',
    height: '64px',
    width: 'auto',
    padding: '0 10px',
    '& .MuiBottomNavigationAction-root': {
        color: '#94A3B8',
        minWidth: 'auto',
        padding: '0 20px',
        transition: 'all 0.3s ease',
        [theme.breakpoints.down('sm')]: {
            padding: '0 10px',
        },
        '&.Mui-selected': {
            color: '#6366F1',
            '& .MuiSvgIcon-root': {
                transform: 'translateY(-2px)',
            },
            '& .MuiBottomNavigationAction-label': {
                fontWeight: 700,
            }
        },
        '&:hover': {
            color: '#6366F1',
        }
    },
}));