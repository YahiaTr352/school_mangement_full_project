import React, { useEffect, useState } from 'react'
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Box, Tab, Container, Typography, BottomNavigation, 
    BottomNavigationAction, Paper, Stack, Grid, IconButton, 
    Divider, Button, Card, CardContent
} from '@mui/material';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AddTaskIcon from '@mui/icons-material/AddTask';

const ViewSubject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

  const { classID, subjectID } = params

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  if (error) {
    console.log(error)
  }

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState('attendance');
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const studentColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
  ]

  const studentRows = sclassStudents.map((student) => {
    return {
      rollNum: student.rollNum,
      name: student.name,
      id: student._id,
    };
  })

  const StudentsAttendanceButtonHaver = ({ row }) => {
    return (
      <Stack direction="row" spacing={1} justifyContent="center">
        <IconButton 
            onClick={() => navigate("/Admin/students/student/" + row.id)}
            sx={{ color: '#6366F1', '&:hover': { backgroundColor: '#EEF2FF' } }}
        >
          <VisibilityIcon />
        </IconButton>
        <PurpleButton
          variant="contained"
          startIcon={<HowToRegIcon />}
          onClick={() =>
            navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)
          }
          sx={{ borderRadius: '10px', textTransform: 'none' }}
        >
          Attendance
        </PurpleButton>
      </Stack>
    );
  };

  const StudentsMarksButtonHaver = ({ row }) => {
    return (
      <Stack direction="row" spacing={1} justifyContent="center">
        <IconButton 
            onClick={() => navigate("/Admin/students/student/" + row.id)}
            sx={{ color: '#6366F1', '&:hover': { backgroundColor: '#EEF2FF' } }}
        >
          <VisibilityIcon />
        </IconButton>
        <PurpleButton 
          variant="contained"
          startIcon={<AddTaskIcon />}
          onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}
          sx={{ borderRadius: '10px', textTransform: 'none' }}
        >
          Marks
        </PurpleButton>
      </Stack>
    );
  };

  const SubjectStudentsSection = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {getresponse ? (
          <StyledPaper elevation={0} sx={{ textAlign: 'center', py: 8 }}>
            <GroupsIcon sx={{ fontSize: 60, color: '#CBD5E1', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#64748B', mb: 3 }}>
                No students found in this class.
            </Typography>
            <Button
                variant="contained"
                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                sx={{ 
                    backgroundColor: '#6366F1', 
                    borderRadius: '12px',
                    textTransform: 'none',
                    padding: '10px 24px'
                }}
            >
                Add Students Now
            </Button>
          </StyledPaper>
        ) : (
          <>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B' }}>
                    Class Students
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
                    Total: {sclassStudents.length} Students
                </Typography>
            </Box>

            <StyledPaper elevation={0}>
                {selectedSection === 'attendance' &&
                <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
                }
                {selectedSection === 'marks' &&
                <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
                }
            </StyledPaper>

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }} elevation={10}>
              <BottomNavigation 
                value={selectedSection} 
                onChange={handleSectionChange} 
                showLabels
                sx={{ height: 70 }}
              >
                <BottomNavigationAction
                  label="Attendance Mode"
                  value="attendance"
                  icon={selectedSection === 'attendance' ? <TableChartIcon color="primary" /> : <TableChartOutlinedIcon />}
                />
                <BottomNavigationAction
                  label="Marks Mode"
                  value="marks"
                  icon={selectedSection === 'marks' ? <InsertChartIcon color="primary" /> : <InsertChartOutlinedIcon />}
                />
              </BottomNavigation>
            </Paper>
          </>
        )}
      </motion.div>
    )
  }

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <StyledPaper elevation={0}>
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconBox sx={{ backgroundColor: '#EEF2FF', color: '#6366F1' }}>
                                <LibraryBooksIcon />
                            </IconBox>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E1B4B' }}>
                                    {subjectDetails && subjectDetails.subName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748B' }}>
                                    Subject Code: {subjectDetails && subjectDetails.subCode}
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Divider />
                        
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={4}>
                                <DetailCard>
                                    <AssignmentIcon sx={{ color: '#6366F1', mb: 1 }} />
                                    <Typography variant="body2" sx={{ color: '#64748B' }}>Sessions</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{subjectDetails && subjectDetails.sessions}</Typography>
                                </DetailCard>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <DetailCard>
                                    <SchoolIcon sx={{ color: '#10B981', mb: 1 }} />
                                    <Typography variant="body2" sx={{ color: '#64748B' }}>Class</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}</Typography>
                                </DetailCard>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <DetailCard>
                                    <GroupsIcon sx={{ color: '#F59E0B', mb: 1 }} />
                                    <Typography variant="body2" sx={{ color: '#64748B' }}>Students</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{numberOfStudents}</Typography>
                                </DetailCard>
                            </Grid>
                        </Grid>
                    </Stack>
                </StyledPaper>
            </Grid>
            
            <Grid item xs={12} md={4}>
                <StyledPaper elevation={0}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1E1B4B' }}>
                        Assigned Teacher
                    </Typography>
                    {subjectDetails && subjectDetails.teacher ? (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <PersonIcon sx={{ fontSize: 60, color: '#6366F1', mb: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {subjectDetails.teacher.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                                Subject Specialist
                            </Typography>
                            <Button 
                                variant="outlined"
                                onClick={() => navigate("/Admin/teachers/teacher/" + subjectDetails.teacher._id)}
                                sx={{ borderRadius: '10px', textTransform: 'none' }}
                            >
                                View Profile
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <PersonIcon sx={{ fontSize: 60, color: '#CBD5E1', mb: 1 }} />
                            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                                No teacher assigned yet.
                            </Typography>
                            <Button 
                                variant="contained"
                                onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}
                                sx={{ 
                                    backgroundColor: '#10B981', 
                                    '&:hover': { backgroundColor: '#059669' },
                                    borderRadius: '10px',
                                    textTransform: 'none'
                                }}
                            >
                                Assign Teacher
                            </Button>
                        </Box>
                    )}
                </StyledPaper>
            </Grid>
        </Grid>
      </motion.div>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 10 }}>
      {subloading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <Typography variant="h6" sx={{ color: '#64748B' }}>Loading details...</Typography>
        </Box>
      ) : (
        <>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton onClick={() => navigate(-1)} sx={{ color: '#6366F1' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            Subject Management
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Box sx={{ width: '100%' }} >
                <TabContext value={value}>
                    <StyledTabList 
                        onChange={handleChange} 
                        aria-label="subject tabs"
                    >
                        <Tab label="Subject Details" value="1" />
                        <Tab label="Student Performance" value="2" />
                    </StyledTabList>
                    
                    <Box sx={{ mt: 3 }}>
                        <TabPanel value="1" sx={{ p: 0 }}>
                            <SubjectDetailsSection />
                        </TabPanel>
                        <TabPanel value="2" sx={{ p: 0 }}>
                            <SubjectStudentsSection />
                        </TabPanel>
                    </Box>
                </TabContext>
            </Box>
        </>
      )}
    </Container>
  )
}

export default ViewSubject;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '32px',
  borderRadius: '24px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    fontSize: '28px',
  },
}));

const DetailCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px !important',
  backgroundColor: '#F8FAFC !important',
  boxShadow: 'none !important',
  border: '1px solid #E2E8F0 !important',
  padding: '16px',
  textAlign: 'center',
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