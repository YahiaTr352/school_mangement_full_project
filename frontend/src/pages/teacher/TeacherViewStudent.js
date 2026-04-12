import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Collapse,
    Table,
    TableBody,
    TableHead,
    Typography,
    Container,
    Grid,
    Paper,
    Avatar,
    Chip,
    CircularProgress,
    IconButton,
    TableContainer,
    Tooltip,
    TableCell,
    TableRow,
} from '@mui/material';
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
    Person,
    School,
    Class,
    Badge,
    AssignmentTurnedIn,
    Assessment,
    AddCircleOutline,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const TeacherViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading, error } = useSelector((state) => state.user);

    const address = "Student";
    const studentID = params.id;
    
    // Safety check for currentUser and teachSubject
    const teachSubject = currentUser?.teachSubject?.subName || null;
    const teachSubjectID = currentUser?.teachSubject?._id || null;

    useEffect(() => {
        if (studentID) {
            dispatch(getUserDetails(studentID, address));
        }
    }, [dispatch, studentID]);

    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState([]);
    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [openStates, setOpenStates] = useState({});

    useEffect(() => {
        if (userDetails) {
            setSclassName(userDetails.sclassName || {});
            setStudentSchool(userDetails.school || {});
            setSubjectMarks(userDetails.examResult || []);
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress sx={{ color: '#6366F1' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error" variant="h6">Error loading student details. Please try again.</Typography>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => window.location.reload()}>Retry</Button>
            </Box>
        );
    }

    if (!userDetails || Object.keys(userDetails).length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">No student details found.</Typography>
            </Box>
        );
    }

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    // Helper to filter attendance and marks for the teacher's subject
    const attendanceRecords = groupAttendanceBySubject(subjectAttendance);
    const teacherSubjectAttendance = Object.entries(attendanceRecords).filter(([subName]) => subName === teachSubject);
    const teacherSubjectMarks = subjectMarks.filter(result => result.subName?.subName === teachSubject);

    return (
        <StyledRoot>
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header Profile Section */}
                    <ProfileCard elevation={0}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item>
                                <StyledAvatar>
                                    <Person sx={{ fontSize: 40 }} />
                                </StyledAvatar>
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid item xs container direction="column" spacing={1}>
                                    <Grid item>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                            {userDetails.name || "N/A"}
                                        </Typography>
                                    </Grid>
                                    <Grid item sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        <InfoChip icon={<Badge fontSize="small" />} label={`Roll: ${userDetails.rollNum || "N/A"}`} variant="outlined" />
                                        <InfoChip icon={<Class fontSize="small" />} label={`Class: ${sclassName?.sclassName || "N/A"}`} variant="outlined" />
                                        <InfoChip icon={<School fontSize="small" />} label={studentSchool?.schoolName || "N/A"} variant="outlined" />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ProfileCard>

                    <Grid container spacing={4}>
                        {/* Attendance Stats */}
                        <Grid item xs={12} md={5}>
                            <SectionPaper elevation={0}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AssignmentTurnedIn sx={{ color: '#6366F1' }} /> Attendance Overview
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <CustomPieChart data={chartData} />
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#6366F1' }}>
                                            {typeof overallAttendancePercentage === 'number' ? overallAttendancePercentage.toFixed(1) : "0.0"}%
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                                            Overall Attendance Rate
                                        </Typography>
                                    </Box>
                                </Box>
                            </SectionPaper>
                        </Grid>

                        {/* Subject Details (Attendance & Marks) */}
                        <Grid item xs={12} md={7}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {/* Attendance Table */}
                                <SectionPaper elevation={0}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AssignmentTurnedIn sx={{ color: '#6366F1' }} /> Your Subject Attendance
                                        </Typography>
                                        <ActionButton
                                            variant="contained"
                                            startIcon={<AddCircleOutline />}
                                            onClick={() => teachSubjectID && navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)}
                                            disabled={!teachSubjectID}
                                        >
                                            Add Attendance
                                        </ActionButton>
                                    </Box>

                                    {teacherSubjectAttendance.length > 0 ? (
                                        <StyledTableContainer>
                                            <Table>
                                                <TableHead>
                                                    <StyledTableRow>
                                                        <HeaderTableCell>Subject</HeaderTableCell>
                                                        <HeaderTableCell align="center">Present</HeaderTableCell>
                                                        <HeaderTableCell align="center">Total</HeaderTableCell>
                                                        <HeaderTableCell align="center">Percentage</HeaderTableCell>
                                                        <HeaderTableCell align="right">Details</HeaderTableCell>
                                                    </StyledTableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {teacherSubjectAttendance.map(([subName, { present, allData, subId, sessions }], index) => {
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
                                                                            color={percentage > 75 ? "success" : "warning"}
                                                                            size="small"
                                                                            sx={{ fontWeight: 700 }}
                                                                        />
                                                                    </StyledTableCell>
                                                                    <StyledTableCell align="right">
                                                                        <Tooltip title={isOpen ? "Hide Details" : "View Details"}>
                                                                            <IconButton size="small" onClick={() => handleOpen(subId)} sx={{ color: '#6366F1' }}>
                                                                                {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </StyledTableCell>
                                                                </StyledTableRow>
                                                                <TableRow>
                                                                    <StyledTableCell sx={{ p: 0 }} colSpan={6}>
                                                                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                                            <Box sx={{ p: 2, bgcolor: '#F8FAFC' }}>
                                                                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#475569' }}>
                                                                                    Daily Attendance History
                                                                                </Typography>
                                                                                <Table size="small">
                                                                                    <TableHead>
                                                                                        <TableRow>
                                                                                            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                                                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Status</TableCell>
                                                                                        </TableRow>
                                                                                    </TableHead>
                                                                                    <TableBody>
                                                                                        {allData && allData.map((data, idx) => {
                                                                                            const date = new Date(data.date);
                                                                                            const dateStr = date.toString() !== "Invalid Date" ? date.toLocaleDateString() : "N/A";
                                                                                            return (
                                                                                                <TableRow key={idx}>
                                                                                                    <TableCell sx={{ color: '#64748B' }}>{dateStr}</TableCell>
                                                                                                    <TableCell align="right">
                                                                                                        <Chip 
                                                                                                            label={data.status} 
                                                                                                            size="small"
                                                                                                            color={data.status === "Present" ? "success" : "error"}
                                                                                                            variant="outlined"
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
                                    ) : (
                                        <Box sx={{ p: 3, border: '1px dashed #E2E8F0', borderRadius: '12px', textAlign: 'center' }}>
                                            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                                No attendance records found for "{teachSubject || 'your subject'}".
                                            </Typography>
                                        </Box>
                                    )}
                                </SectionPaper>

                                {/* Marks Table */}
                                <SectionPaper elevation={0}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Assessment sx={{ color: '#6366F1' }} /> Your Subject Marks
                                        </Typography>
                                        <ActionButton
                                            variant="contained"
                                            startIcon={<AddCircleOutline />}
                                            onClick={() => teachSubjectID && navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)}
                                            disabled={!teachSubjectID}
                                        >
                                            Add Marks
                                        </ActionButton>
                                    </Box>

                                    {teacherSubjectMarks.length > 0 ? (
                                        <StyledTableContainer>
                                            <Table>
                                                <TableHead>
                                                    <StyledTableRow>
                                                        <HeaderTableCell>Subject</HeaderTableCell>
                                                        <HeaderTableCell align="center">Marks Obtained</HeaderTableCell>
                                                        <HeaderTableCell align="center">Status</HeaderTableCell>
                                                    </StyledTableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {teacherSubjectMarks.map((result, index) => (
                                                        <StyledTableRow key={index}>
                                                            <StyledTableCell sx={{ fontWeight: 600 }}>{result.subName?.subName || teachSubject}</StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#6366F1' }}>
                                                                    {result.marksObtained}
                                                                </Typography>
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <Chip 
                                                                    label={result.marksObtained >= 50 ? "Pass" : "Fail"} 
                                                                    color={result.marksObtained >= 50 ? "success" : "error"}
                                                                    sx={{ fontWeight: 700 }}
                                                                />
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </StyledTableContainer>
                                    ) : (
                                        <Box sx={{ p: 3, border: '1px dashed #E2E8F0', borderRadius: '12px', textAlign: 'center' }}>
                                            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                                No marks recorded for "{teachSubject || 'your subject'}" yet.
                                            </Typography>
                                        </Box>
                                    )}
                                </SectionPaper>
                            </Box>
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>
        </StyledRoot>
    );
};

export default TeacherViewStudent;

// Styled Components
const StyledRoot = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: '24px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    marginBottom: theme.spacing(4),
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '20px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    height: '100%',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 100,
    height: 100,
    backgroundColor: '#EEF2FF',
    color: '#6366F1',
    border: '4px solid #FFFFFF',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
}));

const InfoChip = styled(Chip)(({ theme }) => ({
    borderRadius: '10px',
    padding: '4px',
    fontWeight: 600,
    color: '#475569',
    borderColor: '#E2E8F0',
    backgroundColor: '#F1F5F9',
    '& .MuiChip-icon': {
        color: '#6366F1'
    }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #F1F5F9',
}));

const HeaderTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#F8FAFC',
    color: '#64748B',
    fontWeight: 700,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '16px',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    padding: '8px 20px',
    textTransform: 'none',
    fontWeight: 700,
    backgroundColor: '#6366F1',
    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)',
    '&:hover': {
        backgroundColor: '#4F46E5',
        boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)',
    },
    '&.Mui-disabled': {
        backgroundColor: '#E2E8F0',
        color: '#94A3B8'
    }
}));