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
            <Grid container spacing={4}>
                {/* Overall Attendance Card */}
                <Grid item xs={12}>
                    <StatsCard elevation={0}>
                        <Grid container alignItems="center" spacing={3}>
                            <Grid item>
                                <IconCircle sx={{ bgcolor: '#EEF2FF', color: '#6366F1' }}>
                                    <TrendingIcon fontSize="large" />
                                </IconCircle>
                            </Grid>
                            <Grid item>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                    {overallAttendancePercentage.toFixed(1)}%
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 600 }}>
                                    Overall Attendance Record
                                </Typography>
                            </Grid>
                        </Grid>
                    </StatsCard>
                </Grid>

                <Grid item xs={12}>
                    <SectionPaper elevation={0}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                            <AttendanceIcon sx={{ color: '#6366F1' }} />
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                Subject-wise Attendance
                            </Typography>
                        </Stack>
                        
                        <StyledTableContainer>
                            <Table>
                                <TableHead>
                                    <StyledTableRow>
                                        <HeaderTableCell>Subject</HeaderTableCell>
                                        <HeaderTableCell align="center">Present</HeaderTableCell>
                                        <HeaderTableCell align="center">Total Sessions</HeaderTableCell>
                                        <HeaderTableCell align="center">Percentage</HeaderTableCell>
                                        <HeaderTableCell align="right">Details</HeaderTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                                        const percentage = calculateSubjectAttendancePercentage(present, sessions);
                                        const isOpen = openStates[subId];
                                        return (
                                            <React.Fragment key={subId || index}>
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ fontWeight: 600 }}>{subName}</StyledTableCell>
                                                    <StyledTableCell align="center">{present}</StyledTableCell>
                                                    <StyledTableCell align="center">{sessions}</StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Chip 
                                                            label={`${percentage}%`} 
                                                            color={percentage > 75 ? "success" : percentage > 60 ? "warning" : "error"}
                                                            size="small"
                                                            sx={{ fontWeight: 700 }}
                                                        />
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        <Tooltip title={isOpen ? "Hide History" : "View History"}>
                                                            <IconButton size="small" onClick={() => handleOpen(subId)} sx={{ color: '#6366F1' }}>
                                                                {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                                <TableRow>
                                                    <StyledTableCell sx={{ p: 0 }} colSpan={6}>
                                                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                            <Box sx={{ p: 3, bgcolor: '#F8FAFC' }}>
                                                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <EventIcon fontSize="small" /> Attendance History - {subName}
                                                                </Typography>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>Date</TableCell>
                                                                            <TableCell align="right" sx={{ fontWeight: 700, color: '#64748B' }}>Status</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {allData.map((data, idx) => {
                                                                            const date = new Date(data.date);
                                                                            const dateStr = date.toString() !== "Invalid Date" ? date.toLocaleDateString() : "N/A";
                                                                            return (
                                                                                <TableRow key={idx}>
                                                                                    <TableCell sx={{ color: '#475569' }}>{dateStr}</TableCell>
                                                                                    <TableCell align="right">
                                                                                        <Chip 
                                                                                            label={data.status} 
                                                                                            size="small"
                                                                                            variant="outlined"
                                                                                            color={data.status === "Present" ? "success" : "error"}
                                                                                            sx={{ fontWeight: 600 }}
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
            <SectionPaper elevation={0}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                    <InsertChartIcon sx={{ color: '#6366F1' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        Attendance Analytics
                    </Typography>
                </Stack>
                <Box sx={{ width: '100%', mt: 2 }}>
                    <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                </Box>
            </SectionPaper>
        </motion.div>
    );

    return (
        <StyledRoot>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <CircularProgress sx={{ color: '#6366F1' }} />
                    </Box>
                ) : (
                    <AnimatePresence mode="wait">
                        {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                            <Box key="content">
                                {selectedSection === 'table' ? renderTableSection() : renderChartSection()}
                                
                                <NavPaper elevation={10}>
                                    <StyledBottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                        <BottomNavigationAction
                                            label="Table View"
                                            value="table"
                                            icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                        />
                                        <BottomNavigationAction
                                            label="Analysis Chart"
                                            value="chart"
                                            icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                        />
                                    </StyledBottomNavigation>
                                </NavPaper>
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 10 }}>
                                <AttendanceIcon sx={{ fontSize: 80, color: '#E2E8F0', mb: 2 }} />
                                <Typography variant="h5" sx={{ color: '#64748B', fontWeight: 700 }}>
                                    No Attendance Data Found
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#94A3B8' }}>
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
    padding: theme.spacing(4),
    borderRadius: '24px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
}));

const StatsCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: '24px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    background: 'linear-gradient(to right, #FFFFFF, #F8FAFC)',
}));

const IconCircle = styled(Box)(({ theme }) => ({
    width: 80,
    height: 80,
    borderRadius: '20px',
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
}));

const NavPaper = styled(Paper)(({ theme }) => ({
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '50px',
    overflow: 'hidden',
    width: 'max-content',
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
    minWidth: '350px',
    padding: '0 10px',
    '& .MuiBottomNavigationAction-root': {
        color: '#94A3B8',
        minWidth: 'auto',
        padding: '0 20px',
        transition: 'all 0.3s ease',
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