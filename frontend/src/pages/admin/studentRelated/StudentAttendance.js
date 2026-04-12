import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import {
    Box, InputLabel, MenuItem, Select, Typography, Stack, 
    TextField, CircularProgress, FormControl, Container, 
    Paper, Button, IconButton, Divider, Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import Popup from '../../../components/Popup';

const StudentAttendance = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams()

    const { id, studentID: paramStudentID, subjectID: paramSubjectID } = params;

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (situation === "Student" && id) {
            setStudentID(id);
            dispatch(getUserDetails(id, "Student"));
        }
        else if (situation === "Subject" && paramStudentID && paramSubjectID) {
            setStudentID(paramStudentID);
            setChosenSubName(paramSubjectID);
            dispatch(getUserDetails(paramStudentID, "Student"));
        }
    }, [situation, id, paramStudentID, paramSubjectID, dispatch]);

    useEffect(() => {
        if (userDetails?._id && userDetails?.sclassName?._id && situation === "Student") {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails?._id, userDetails?.sclassName?._id, situation]);

    const changeHandler = (event) => {
        const selectedSubject = subjectsList?.find(
            (subject) => subject.subName === event.target.value
        );
        if (selectedSubject) {
            setSubjectName(selectedSubject.subName);
            setChosenSubName(selectedSubject._id);
        }
    }

    const fields = { subName: chosenSubName, status, date }

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(updateStudentFields(studentID, fields, "StudentAttendance"))
    }

    useEffect(() => {
        if (response) {
            setLoader(false)
            setShowPopup(true)
            setMessage(response)
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("Error occurred while updating attendance.")
        }
        else if (statestatus === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Attendance updated successfully!")
        }
    }, [response, statestatus, error])

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            {loading || !userDetails ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress sx={{ color: '#6366F1' }} />
                </Box>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <IconButton onClick={() => navigate(-1)} sx={{ color: '#6366F1' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                    Mark Attendance
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <StyledPaper elevation={0}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Avatar 
                                sx={{ 
                                    width: 80, height: 80, mx: 'auto', mb: 2, 
                                    bgcolor: '#EEF2FF', color: '#6366F1',
                                    fontWeight: 700
                                }}
                            >
                                {userDetails?.name ? userDetails.name.charAt(0) : <PersonIcon />}
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B' }}>
                                {userDetails?.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748B' }}>
                                Roll Number: {userDetails?.rollNum} | Class: {userDetails?.sclassName?.sclassName}
                            </Typography>
                        </Box>
                        
                        <Divider sx={{ mb: 4 }} />

                        <form onSubmit={submitHandler}>
                            <Stack spacing={4}>
                                {situation === "Student" && (
                                    <FormControl fullWidth>
                                        <InputLabel id="select-subject-label">Select Subject</InputLabel>
                                        <StyledSelect
                                            labelId="select-subject-label"
                                            value={subjectName}
                                            label="Select Subject"
                                            onChange={changeHandler}
                                            required
                                        >
                                            {subjectsList && subjectsList.length > 0 ? (
                                                subjectsList.map((subject, index) => (
                                                    <MenuItem key={index} value={subject.subName}>
                                                        {subject.subName}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled value="">
                                                    No subjects found
                                                </MenuItem>
                                            )}
                                        </StyledSelect>
                                    </FormControl>
                                )}

                                {situation === "Subject" && (
                                    <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <EventAvailableIcon sx={{ color: '#6366F1' }} />
                                            <Box>
                                                <Typography variant="caption" color="textSecondary">Subject for Attendance</Typography>
                                                <Typography variant="body1" fontWeight={700}>
                                                    {subjectsList?.find(s => s._id === chosenSubName)?.subName || "Current Subject"}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                )}

                                <FormControl fullWidth>
                                    <InputLabel id="attendance-status-label">Attendance Status</InputLabel>
                                    <StyledSelect
                                        labelId="attendance-status-label"
                                        value={status}
                                        label="Attendance Status"
                                        onChange={(event) => setStatus(event.target.value)}
                                        required
                                    >
                                        <MenuItem value="Present">Present</MenuItem>
                                        <MenuItem value="Absent">Absent</MenuItem>
                                    </StyledSelect>
                                </FormControl>

                                <StyledTextField
                                    fullWidth
                                    label="Select Date"
                                    type="date"
                                    value={date}
                                    onChange={(event) => setDate(event.target.value)}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />

                                <Button
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    disabled={loader}
                                    startIcon={loader ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                    sx={{
                                        backgroundColor: '#6366F1',
                                        '&:hover': { backgroundColor: '#4F46E5' },
                                        borderRadius: '12px',
                                        padding: '14px',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {loader ? 'Updating...' : 'Submit Attendance'}
                                </Button>
                            </Stack>
                        </form>
                    </StyledPaper>
                </motion.div>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    )
}

export default StudentAttendance

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '40px',
  borderRadius: '24px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '12px',
    borderColor: '#E2E8F0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#CBD5E1',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#6366F1',
    borderWidth: '2px',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#E2E8F0',
    },
    '&:hover fieldset': {
      borderColor: '#CBD5E1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6366F1',
      borderWidth: '2px',
    },
  },
}));