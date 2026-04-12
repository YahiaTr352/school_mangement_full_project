import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { 
    Box, Button, Collapse, IconButton, Table, TableBody, TableHead, 
    Typography, Tab, Paper, BottomNavigation, BottomNavigationAction, 
    Container, Stack, Grid, Divider, Card, CardContent, Avatar, Chip,
    CircularProgress
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { 
    KeyboardArrowUp, KeyboardArrowDown, 
    Delete as DeleteIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Badge as BadgeIcon,
    AccountBalance as BankIcon,
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    TrendingUp as TrendingUpIcon,
    EventAvailable as EventIcon
} from '@mui/icons-material';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart'
import CustomPieChart from '../../../components/CustomPieChart'
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import Popup from '../../../components/Popup';

const ViewStudent = () => {
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

    const studentID = params.id
    const address = "Student"

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID])

    useEffect(() => {
        if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [openStates, setOpenStates] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [value, setValue] = useState('1');
    const [selectedSection, setSelectedSection] = useState('table');

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const deleteHandler = () => {
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)
    }

    const removeHandler = (id, deladdress) => {
        dispatch(removeStuff(id, deladdress))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten"))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const StudentAttendanceSection = () => {
        const renderTableSection = () => {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B' }}>
                            Subject-wise Attendance
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button 
                                variant="outlined" 
                                color="error" 
                                startIcon={<DeleteIcon />} 
                                onClick={() => removeHandler(studentID, "RemoveStudentAtten")}
                                sx={{ borderRadius: '10px', textTransform: 'none' }}
                            >
                                Reset All
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}
                                sx={{ 
                                    backgroundColor: '#6366F1', 
                                    borderRadius: '10px', 
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: '#4F46E5' }
                                }}
                            >
                                Add Attendance
                            </Button>
                        </Stack>
                    </Stack>
                    
                    <StyledPaper elevation={0}>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Subject</StyledTableCell>
                                    <StyledTableCell>Present</StyledTableCell>
                                    <StyledTableCell>Total Sessions</StyledTableCell>
                                    <StyledTableCell>Percentage</StyledTableCell>
                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                                return (
                                    <TableBody key={index}>
                                        <StyledTableRow>
                                            <StyledTableCell sx={{ fontWeight: 600 }}>{subName}</StyledTableCell>
                                            <StyledTableCell>{present}</StyledTableCell>
                                            <StyledTableCell>{sessions}</StyledTableCell>
                                            <StyledTableCell>
                                                <Chip 
                                                    label={`${subjectAttendancePercentage}%`}
                                                    color={subjectAttendancePercentage > 75 ? "success" : "warning"}
                                                    size="small"
                                                    sx={{ fontWeight: 700 }}
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <IconButton size="small" onClick={() => handleOpen(subId)} sx={{ color: '#6366F1' }}>
                                                        {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => removeSubAttendance(subId)} sx={{ color: '#EF4444' }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <Button 
                                                        variant="contained" 
                                                        size="small"
                                                        onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}
                                                        sx={{ 
                                                            backgroundColor: '#4338CA', 
                                                            borderRadius: '8px', 
                                                            textTransform: 'none',
                                                            '&:hover': { backgroundColor: '#3730A3' }
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Stack>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 2, p: 2, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700, color: '#4338CA' }}>
                                                            Daily Logs: {subName}
                                                        </Typography>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <StyledTableRow>
                                                                    <StyledTableCell>Date</StyledTableCell>
                                                                    <StyledTableCell align="right">Status</StyledTableCell>
                                                                </StyledTableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {allData.map((data, index) => {
                                                                    const date = new Date(data.date);
                                                                    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                    return (
                                                                        <StyledTableRow key={index}>
                                                                            <StyledTableCell>{dateString}</StyledTableCell>
                                                                            <StyledTableCell align="right">
                                                                                <Chip 
                                                                                    label={data.status} 
                                                                                    size="small" 
                                                                                    variant="outlined"
                                                                                    color={data.status === "Present" ? "success" : "error"}
                                                                                />
                                                                            </StyledTableCell>
                                                                        </StyledTableRow>
                                                                    )
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </Box>
                                                </Collapse>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                )
                            }
                            )}
                        </Table>
                    </StyledPaper>
                </motion.div>
            )
        }
        return (
            <Box sx={{ pb: 10 }}>
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <StyledPaper elevation={0}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Attendance Visualization</Typography>
                                    <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                                </StyledPaper>
                            </motion.div>
                        )}

                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }} elevation={10}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels sx={{ height: 70 }}>
                                <BottomNavigationAction
                                    label="Table View"
                                    value="table"
                                    icon={<TableChartIcon />}
                                />
                                <BottomNavigationAction
                                    label="Analytics"
                                    value="chart"
                                    icon={<InsertChartIcon />}
                                />
                            </BottomNavigation>
                        </Paper>
                    </>
                    :
                    <StyledPaper elevation={0} sx={{ textAlign: 'center', py: 10 }}>
                        <EventIcon sx={{ fontSize: 60, color: '#CBD5E1', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#64748B', mb: 3 }}>No attendance records found.</Typography>
                        <Button variant="contained" onClick={() => navigate("/Admin/students/student/attendance/" + studentID)} sx={{ backgroundColor: '#6366F1', borderRadius: '12px', textTransform: 'none', px: 4 }}>
                            Take First Attendance
                        </Button>
                    </StyledPaper>
                }
            </Box>
        )
    }

    const StudentMarksSection = () => {
        const marks = userDetails.examResult || [];
        const renderTableSection = () => {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B' }}>
                            Examination Results
                        </Typography>
                        <Button 
                            variant="contained" 
                            onClick={() => navigate("/Admin/students/student/marks/" + studentID)}
                            sx={{ 
                                backgroundColor: '#6366F1', 
                                borderRadius: '10px', 
                                textTransform: 'none',
                                '&:hover': { backgroundColor: '#4F46E5' }
                            }}
                        >
                            Add Marks
                        </Button>
                    </Stack>
                    <StyledPaper elevation={0}>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Subject</StyledTableCell>
                                    <StyledTableCell align="center">Marks Obtained</StyledTableCell>
                                    <StyledTableCell align="center">Status</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {marks.map((result, index) => {
                                    if (!result.subName || !result.marksObtained) return null;
                                    return (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell sx={{ fontWeight: 600 }}>{result.subName.subName}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Typography sx={{ fontWeight: 800, color: '#4338CA' }}>{result.marksObtained}</Typography>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Chip 
                                                    label={result.marksObtained >= 33 ? "Passed" : "Failed"} 
                                                    color={result.marksObtained >= 33 ? "success" : "error"}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </StyledPaper>
                </motion.div>
            )
        }
        return (
            <Box sx={{ pb: 10 }}>
                {marks && Array.isArray(marks) && marks.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <StyledPaper elevation={0}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Performance Graph</Typography>
                                    <CustomBarChart chartData={marks} dataKey="marksObtained" />
                                </StyledPaper>
                            </motion.div>
                        )}

                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }} elevation={10}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels sx={{ height: 70 }}>
                                <BottomNavigationAction label="Report Card" value="table" icon={<TableChartIcon />} />
                                <BottomNavigationAction label="Performance" value="chart" icon={<InsertChartIcon />} />
                            </BottomNavigation>
                        </Paper>
                    </>
                    :
                    <StyledPaper elevation={0} sx={{ textAlign: 'center', py: 10 }}>
                        <TrendingUpIcon sx={{ fontSize: 60, color: '#CBD5E1', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#64748B', mb: 3 }}>No exam results uploaded yet.</Typography>
                        <Button variant="contained" onClick={() => navigate("/Admin/students/student/marks/" + studentID)} sx={{ backgroundColor: '#6366F1', borderRadius: '12px', textTransform: 'none', px: 4 }}>
                            Add Exam Marks
                        </Button>
                    </StyledPaper>
                }
            </Box>
        )
    }

    const StudentDetailsSection = () => {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <StyledPaper elevation={0} sx={{ textAlign: 'center' }}>
                            <Avatar 
                                sx={{ 
                                    width: 120, height: 120, mx: 'auto', mb: 2, 
                                    bgcolor: '#EEF2FF', color: '#6366F1',
                                    fontSize: '3rem', fontWeight: 700
                                }}
                            >
                                {userDetails?.name ? userDetails.name.charAt(0) : <PersonIcon fontSize="large" />}
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E1B4B', mb: 0.5 }}>
                                {userDetails?.name}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748B', mb: 3 }}>
                                Student Profile
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Stack spacing={2} sx={{ textAlign: 'left' }}>
                                <InfoRow>
                                    <BadgeIcon fontSize="small" />
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Roll Number</Typography>
                                        <Typography variant="body2" fontWeight={700}>{userDetails?.rollNum}</Typography>
                                    </Box>
                                </InfoRow>
                                <InfoRow>
                                    <SchoolIcon fontSize="small" />
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Class</Typography>
                                        <Typography variant="body2" fontWeight={700}>{userDetails?.sclassName?.sclassName}</Typography>
                                    </Box>
                                </InfoRow>
                                <InfoRow>
                                    <BankIcon fontSize="small" />
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Institution</Typography>
                                        <Typography variant="body2" fontWeight={700}>{userDetails?.school?.schoolName}</Typography>
                                    </Box>
                                </InfoRow>
                            </Stack>
                            <Button 
                                variant="contained" 
                                fullWidth 
                                startIcon={<DeleteIcon />}
                                onClick={deleteHandler}
                                sx={{ 
                                    mt: 4, bgcolor: '#FEE2E2', color: '#EF4444', 
                                    '&:hover': { bgcolor: '#FCA5A5' },
                                    borderRadius: '12px', textTransform: 'none', fontWeight: 600
                                }}
                            >
                                Remove Student
                            </Button>
                        </StyledPaper>
                    </Grid>
                    
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <DetailCard>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Attendance Summary</Typography>
                                    <Box sx={{ position: 'relative', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {subjectAttendance.length > 0 ? (
                                            <CustomPieChart data={chartData} />
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">No Data Available</Typography>
                                        )}
                                    </Box>
                                </DetailCard>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DetailCard sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <TrendingUpIcon sx={{ fontSize: 40, color: '#6366F1', mb: 2 }} />
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#4338CA' }}>
                                        {overallAttendancePercentage.toFixed(1)}%
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                                        Overall Attendance
                                    </Typography>
                                </DetailCard>
                            </Grid>
                            <Grid item xs={12}>
                                <StyledPaper elevation={0} sx={{ borderStyle: 'dashed', borderColor: '#CBD5E1', textAlign: 'center', py: 6 }}>
                                    <EditIcon sx={{ fontSize: 40, color: '#CBD5E1', mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Edit Student Information</Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>Update personal details, roll number or password.</Typography>
                                    <Button variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none' }}>Modify Records</Button>
                                </StyledPaper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </motion.div>
        )
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 10 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress sx={{ color: '#6366F1' }} />
                </Box>
            ) : (
                <>
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <IconButton onClick={() => navigate(-1)} sx={{ color: '#6366F1' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                Student Information
                            </Typography>
                        </Stack>
                    </Box>

                    <TabContext value={value}>
                        <StyledTabList onChange={handleChange} aria-label="student tabs">
                            <Tab label="Profile Overview" value="1" />
                            <Tab label="Attendance Record" value="2" />
                            <Tab label="Exam Results" value="3" />
                        </StyledTabList>
                        
                        <Box sx={{ mt: 3 }}>
                            <TabPanel value="1" sx={{ p: 0 }}><StudentDetailsSection /></TabPanel>
                            <TabPanel value="2" sx={{ p: 0 }}><StudentAttendanceSection /></TabPanel>
                            <TabPanel value="3" sx={{ p: 0 }}><StudentMarksSection /></TabPanel>
                        </Box>
                    </TabContext>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    )
}

export default ViewStudent

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '32px',
  borderRadius: '24px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
}));

const DetailCard = styled(Card)(({ theme }) => ({
  padding: '24px',
  borderRadius: '20px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
  height: '100%',
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '12px',
  borderRadius: '12px',
  backgroundColor: '#F8FAFC',
  '& svg': {
    color: '#6366F1',
  },
}));

const StyledTabList = styled(TabList)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#6366F1',
    height: '3px',
    borderRadius: '3px',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    color: '#64748B',
    '&.Mui-selected': {
      color: '#6366F1',
    },
  },
}));