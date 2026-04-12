import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { 
    Box, Container, Typography, Tab, IconButton, Paper, 
    Stack, Grid, Button, Divider, Avatar, Card, CardContent 
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const ClassDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);

    const classID = params.id

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"))
        dispatch(getClassStudents(classID));
    }, [dispatch, classID])

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)
    }

    const subjectColumns = [
        { id: 'name', label: 'Subject Name', minWidth: 170 },
        { id: 'code', label: 'Subject Code', minWidth: 100 },
    ]

    const subjectRows = subjectsList && subjectsList.length > 0 && subjectsList.map((subject) => {
        return {
            name: subject.subName,
            code: subject.subCode,
            id: subject._id,
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <Stack direction="row" spacing={1} justifyContent="center">
                <IconButton 
                    onClick={() => deleteHandler(row.id, "Subject")}
                    sx={{ color: '#EF4444', '&:hover': { backgroundColor: '#FEE2E2' } }}
                >
                    <DeleteIcon />
                </IconButton>
                <BlueButton 
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/Admin/class/subject/${classID}/${row.id}`)}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                >
                    View
                </BlueButton>
            </Stack>
        );
    };

    const subjectActions = [
        {
            icon: <PostAddIcon />, name: 'Add New Subject',
            action: () => navigate("/Admin/addsubject/" + classID)
        }
    ];

    const ClassSubjectsSection = () => {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {response ? (
                    <StyledPaper elevation={0} sx={{ textAlign: 'center', py: 8 }}>
                        <LibraryBooksIcon sx={{ fontSize: 60, color: '#CBD5E1', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#64748B', mb: 3 }}>No subjects assigned to this class yet.</Typography>
                        <Button 
                            variant="contained" 
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                            sx={{ backgroundColor: '#6366F1', borderRadius: '12px', textTransform: 'none', px: 4 }}
                        >
                            Add Subjects
                        </Button>
                    </StyledPaper>
                ) : (
                    <>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B' }}>Subjects Overview</Typography>
                            <Button 
                                variant="outlined" 
                                startIcon={<PostAddIcon />}
                                onClick={() => navigate("/Admin/addsubject/" + classID)}
                                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                            >
                                Add Subject
                            </Button>
                        </Box>
                        <StyledPaper elevation={0}>
                            <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                            <SpeedDialTemplate actions={subjectActions} />
                        </StyledPaper>
                    </>
                )}
            </motion.div>
        )
    }

    const studentColumns = [
        { id: 'name', label: 'Student Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    ]

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    })

    const StudentsButtonHaver = ({ row }) => {
        return (
            <Stack direction="row" spacing={1} justifyContent="center">
                <IconButton 
                    onClick={() => deleteHandler(row.id, "Student")}
                    sx={{ color: '#EF4444', '&:hover': { backgroundColor: '#FEE2E2' } }}
                >
                    <PersonRemoveIcon />
                </IconButton>
                <BlueButton 
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                    sx={{ borderRadius: '10px', textTransform: 'none' }}
                >
                    View
                </BlueButton>
                <PurpleButton 
                    variant="contained"
                    startIcon={<HowToRegIcon />}
                    onClick={() => navigate("/Admin/students/student/attendance/" + row.id)}
                    sx={{ borderRadius: '10px', textTransform: 'none' }}
                >
                    Attendance
                </PurpleButton>
            </Stack>
        );
    };

    const studentActions = [
        {
            icon: <PersonAddAlt1Icon />, name: 'Add New Student',
            action: () => navigate("/Admin/class/addstudents/" + classID)
        }
    ];

    const ClassStudentsSection = () => {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {getresponse ? (
                    <StyledPaper elevation={0} sx={{ textAlign: 'center', py: 8 }}>
                        <GroupIcon sx={{ fontSize: 60, color: '#CBD5E1', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#64748B', mb: 3 }}>No students enrolled in this class.</Typography>
                        <Button 
                            variant="contained" 
                            onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            sx={{ backgroundColor: '#6366F1', borderRadius: '12px', textTransform: 'none', px: 4 }}
                        >
                            Enroll Students
                        </Button>
                    </StyledPaper>
                ) : (
                    <>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B' }}>Class Roster</Typography>
                            <Button 
                                variant="outlined" 
                                startIcon={<PersonAddAlt1Icon />}
                                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                            >
                                Add Student
                            </Button>
                        </Box>
                        <StyledPaper elevation={0}>
                            <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                            <SpeedDialTemplate actions={studentActions} />
                        </StyledPaper>
                    </>
                )}
            </motion.div>
        )
    }

    const ClassTeachersSection = () => {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <StyledPaper elevation={0} sx={{ textAlign: 'center', py: 10 }}>
                    <SupervisorAccountIcon sx={{ fontSize: 60, color: '#CBD5E1', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#64748B', mb: 1 }}>Faculty Management</Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>View and manage teachers assigned to this class section.</Typography>
                    <Button variant="outlined" disabled sx={{ borderRadius: '10px', textTransform: 'none' }}>Coming Soon</Button>
                </StyledPaper>
            </motion.div>
        )
    }

    const ClassDetailsSection = () => {
        const numberOfSubjects = subjectsList.length;
        const numberOfStudents = sclassStudents.length;

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <StyledPaper elevation={0} sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#EEF2FF', color: '#6366F1' }}>
                                <SchoolIcon fontSize="large" />
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E1B4B', mb: 0.5 }}>
                                {sclassDetails && sclassDetails.sclassName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>Class Identification</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Stack spacing={2} sx={{ textAlign: 'left' }}>
                                <DetailItem icon={<LibraryBooksIcon fontSize="small" />} label="Total Subjects" value={numberOfSubjects} />
                                <DetailItem icon={<GroupIcon fontSize="small" />} label="Enrolled Students" value={numberOfStudents} />
                            </Stack>
                        </StyledPaper>
                    </Grid>
                    
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <ActionCard onClick={() => navigate("/Admin/class/addstudents/" + classID)}>
                                    <PersonAddAlt1Icon sx={{ fontSize: 40, color: '#6366F1', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={700}>Add Students</Typography>
                                    <Typography variant="body2" color="textSecondary">Enroll new students to this class</Typography>
                                </ActionCard>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <ActionCard onClick={() => navigate("/Admin/addsubject/" + classID)}>
                                    <PostAddIcon sx={{ fontSize: 40, color: '#10B981', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={700}>Add Subjects</Typography>
                                    <Typography variant="body2" color="textSecondary">Define new curriculum for this class</Typography>
                                </ActionCard>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </motion.div>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 10 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <Typography variant="h6" sx={{ color: '#64748B' }}>Loading class details...</Typography>
                </Box>
            ) : (
                <>
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={() => navigate(-1)} sx={{ color: '#6366F1' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            Class Management
                        </Typography>
                    </Box>

                    <TabContext value={value}>
                        <StyledTabList onChange={handleChange} aria-label="class tabs">
                            <Tab label="Overview" value="1" />
                            <Tab label="Subjects" value="2" />
                            <Tab label="Students" value="3" />
                            <Tab label="Teachers" value="4" />
                        </StyledTabList>
                        
                        <Box sx={{ mt: 3 }}>
                            <TabPanel value="1" sx={{ p: 0 }}><ClassDetailsSection /></TabPanel>
                            <TabPanel value="2" sx={{ p: 0 }}><ClassSubjectsSection /></TabPanel>
                            <TabPanel value="3" sx={{ p: 0 }}><ClassStudentsSection /></TabPanel>
                            <TabPanel value="4" sx={{ p: 0 }}><ClassTeachersSection /></TabPanel>
                        </Box>
                    </TabContext>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default ClassDetails;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '32px',
  borderRadius: '24px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
}));

const DetailItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#F8FAFC', borderRadius: '12px' }}>
        <Box sx={{ color: '#6366F1', display: 'flex' }}>{icon}</Box>
        <Box>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E1B4B' }}>{value}</Typography>
        </Box>
    </Box>
);

const ActionCard = styled(Card)(({ theme }) => ({
  padding: '32px',
  borderRadius: '24px !important',
  textAlign: 'center',
  cursor: 'pointer',
  height: '100%',
  transition: 'all 0.3s ease',
  border: '1px solid #F1F5F9 !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05) !important',
  
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important',
    borderColor: '#6366F1 !important',
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