import React, { useEffect, useState } from 'react';
import { 
    KeyboardArrowDown, 
    KeyboardArrowUp, 
    AssignmentTurnedIn as AttendanceIcon,
    InsertChart as InsertChartIcon,
    InsertChartOutlined as InsertChartOutlinedIcon,
    TableChart as TableChartIcon,
    TableChartOutlined as TableChartOutlinedIcon,
    EventNote as EventIcon,
    TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { 
    BottomNavigation, 
    BottomNavigationAction, 
    Box, 
    Collapse, 
    Paper, 
    Table, 
    TableBody, 
    TableHead, 
    Typography, 
    Container, 
    Grid, 
    CircularProgress, 
    IconButton, 
    Chip, 
    TableContainer, 
    TableCell, 
    TableRow,
    Stack,
    Tooltip
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import CustomBarChart from '../../components/CustomBarChart';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    const [openStates, setOpenStates] = useState({});
    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);
    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { present, sessions }]) => {
        const percentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: percentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const renderTableSection = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Grid container spacing={{ xs: 2, sm: 4 }}>
                {/* Overall Attendance Card */}
                <Grid item xs={12}>
                    <StatsCard elevation={0} sx={{ p: { xs: 2.5, sm: 4 } }}>
                        <Grid container alignItems="center" spacing={{ xs: 2, sm: 3 }}>
                            <Grid item>
                                <IconCircle sx={{ 
                                    bgcolor: '#EEF2FF', 
                                    color: '#6366F1',
                                    width: { xs: 60, sm: 80 },
                                    height: { xs: 60, sm: 80 },
                                    borderRadius: '16px'
                                }}>
                                    <TrendingIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
                                </IconCircle>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h3" sx={{ 
                                    fontWeight: 800, 
                                    color: '#1E1B4B', 
                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                    fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
                                }}>
                                    {overallAttendancePercentage.toFixed(1)}%
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 600, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                                    Overall Attendance Record
                                </Typography>
                            </Grid>
                        </Grid>
                    </StatsCard>
                </Grid>

                <Grid item xs={12}>
                    <SectionPaper elevation={0} sx={{ p: { xs: 2, sm: 4 } }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                            <AttendanceIcon sx={{ color: '#6366F1', fontSize: { xs: 22, sm: 24 } }} />
                            <Typography variant="h6" sx={{ 
                                fontWeight: 700, 
                                color: '#1E1B4B', 
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                fontSize: { xs: '1rem', sm: '1.25rem' }
                            }}>
                                Subject-wise Attendance
                            </Typography>
                        </Stack>
                        
                        <StyledTableContainer>
                            <Table size={window.innerWidth < 600 ? "small" : "medium"}>
                                <TableHead>
                                    <StyledTableRow>
                                        <HeaderTableCell sx={{ px: { xs: 1, sm: 2 } }}>Subject</HeaderTableCell>
                                        <HeaderTableCell align="center" sx={{ px: { xs: 1, sm: 2 }, display: { xs: 'none', sm: 'table-cell' } }}>Present</HeaderTableCell>
                                        <HeaderTableCell align="center" sx={{ px: { xs: 1, sm: 2 }, display: { xs: 'none', sm: 'table-cell' } }}>Total</HeaderTableCell>
                                        <HeaderTableCell align="center" sx={{ px: { xs: 1, sm: 2 } }}>%</HeaderTableCell>
                                        <HeaderTableCell align="right" sx={{ px: { xs: 1, sm: 2 } }}>Details</HeaderTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                                        const percentage = calculateSubjectAttendancePercentage(present, sessions);
                                        const isOpen = openStates[subId];
                                        return (
                                            <React.Fragment key={subId || index}>
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ fontWeight: 600, px: { xs: 1, sm: 2 }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                                        {subName}
                                                        <Typography variant="caption" display={{ xs: 'block', sm: 'none' }} color="textSecondary">
                                                            {present}/{sessions} Attended
                                                        </Typography>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{present}</StyledTableCell>
                                                    <StyledTableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{sessions}</StyledTableCell>
                                                    <StyledTableCell align="center" sx={{ px: { xs: 1, sm: 2 } }}>
                                                        <Chip 
                                                            label={`${percentage}%`} 
                                                            color={percentage > 75 ? "success" : percentage > 60 ? "warning" : "error"}
                                                            size="small"
                                                            sx={{ fontWeight: 700, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                                        />
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right" sx={{ px: { xs: 1, sm: 2 } }}>
                                                        <Tooltip title={isOpen ? "Hide History" : "View History"}>
                                                            <IconButton size="small" onClick={() => handleOpen(subId)} sx={{ color: '#6366F1' }}>
                                                                {isOpen ? <KeyboardArrowUp sx={{ fontSize: 20 }} /> : <KeyboardArrowDown sx={{ fontSize: 20 }} />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                                <TableRow>
                                                    <StyledTableCell sx={{ p: 0 }} colSpan={6}>
                                                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                            <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#F8FAFC' }}>
                                                                <Typography variant="subtitle2" sx={{ 
                                                                    mb: 2, 
                                                                    fontWeight: 700, 
                                                                    color: '#475569', 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    gap: 1,
                                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                                }}>
                                                                    <EventIcon sx={{ fontSize: { xs: 16, sm: 20 } }} /> Attendance History
                                                                </Typography>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell sx={{ fontWeight: 700, color: '#64748B', px: 1 }}>Date</TableCell>
                                                                            <TableCell align="right" sx={{ fontWeight: 700, color: '#64748B', px: 1 }}>Status</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {allData.map((data, idx) => {
                                                                            const date = new Date(data.date);
                                                                            const dateStr = date.toString() !== "Invalid Date" ? date.toLocaleDateString() : "N/A";
                                                                            return (
                                                                                <TableRow key={idx}>
                                                                                    <TableCell sx={{ color: '#475569', px: 1, fontSize: '0.75rem' }}>{dateStr}</TableCell>
                                                                                    <TableCell align="right" sx={{ px: 1 }}>
                                                                                        <Chip 
                                                                                            label={data.status} 
                                                                                            size="small"
                                                                                            variant="outlined"
                                                                                            color={data.status === "Present" ? "success" : "error"}
                                                                                            sx={{ fontWeight: 600, height: 20, fontSize: '0.65rem' }}
                                                                                        />
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        </Collapse>
                                                    </StyledTableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </StyledTableContainer>
                    </SectionPaper>
                </Grid>
            </Grid>
        </motion.div>
    );

    const renderChartSection = () => (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <SectionPaper elevation={0} sx={{ p: { xs: 2, sm: 4 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                    <InsertChartIcon sx={{ color: '#6366F1', fontSize: { xs: 22, sm: 24 } }} />
                    <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: '#1E1B4B', 
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                        Attendance Analytics
                    </Typography>
                </Stack>
                <Box sx={{ width: '100%', mt: 2, overflowX: 'auto' }}>
                    <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                </Box>
            </SectionPaper>
        </motion.div>
    );

    return (
        <StyledRoot>
            <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 12 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <CircularProgress sx={{ color: '#6366F1' }} />
                    </Box>
                ) : (
                    <AnimatePresence mode="wait">
                        {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                            <Box key="content">
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
                                            label="Analysis"
                                            value="chart"
                                            icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                        />
                                    </StyledBottomNavigation>
                                </NavPaper>
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 10, px: 2 }}>
                                <AttendanceIcon sx={{ fontSize: { xs: 60, sm: 80 }, color: '#E2E8F0', mb: 2 }} />
                                <Typography variant="h5" sx={{ color: '#64748B', fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                                    No Attendance Data Found
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#94A3B8', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                    Your attendance records will appear here once updated.
                                </Typography>
                            </Box>
                        )}
                    </AnimatePresence>
                )}
            </Container>
        </StyledRoot>
    );
};

export default ViewStdAttendance;

// Styled Components
const StyledRoot = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    paddingBottom: theme.spacing(4),
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '24px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
}));

const StatsCard = styled(Paper)(({ theme }) => ({
    borderRadius: '24px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    background: 'linear-gradient(to right, #FFFFFF, #F8FAFC)',
}));

const IconCircle = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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