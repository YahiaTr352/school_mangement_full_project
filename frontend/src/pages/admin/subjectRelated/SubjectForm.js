import React, { useEffect, useState } from "react";
import { 
    Button, TextField, Grid, Box, Typography, CircularProgress, 
    Container, Paper, Stack, IconButton, Divider 
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SubjectForm = () => {
    const [subjects, setSubjects] = useState([{ subName: "", subCode: "", sessions: "" }]);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const sclassName = params.id
    const adminID = currentUser._id
    const address = "Subject"

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    const handleSubjectNameChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subName = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSubjectCodeChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subCode = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSessionsChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].sessions = event.target.value || 0;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "", sessions: "" }]);
    };

    const handleRemoveSubject = (index) => () => {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const fields = {
        sclassName,
        subjects: subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
        })),
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
            dispatch(underControl())
            setLoader(false)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <Container maxWidth="md" sx={{ 
            minHeight: '80vh', 
            display: 'flex', 
            flexDirection: 'column',
            py: { xs: 2, md: 4 }
        }}>
            <Box sx={{ mb: { xs: 3, md: 4 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ color: '#6366F1', p: { xs: 0.5, sm: 1 } }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 800, 
                            color: '#1E1B4B', 
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                        }}>
                            Add New Subjects
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748B', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            Fill in the details to add new subjects to the class
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    style={{ width: '100%' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <StyledPaper elevation={0}>
                        <form onSubmit={submitHandler}>
                            <Stack spacing={4}>
                                {subjects.map((subject, index) => (
                                    <Box key={index} sx={{ 
                                        p: { xs: 2, sm: 3 }, 
                                        borderRadius: '16px', 
                                        backgroundColor: '#F8FAFC', 
                                        border: '1px solid #E2E8F0', 
                                        position: 'relative' 
                                    }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                            <Typography variant="h6" sx={{ 
                                                fontWeight: 700, 
                                                color: '#4338CA', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 1,
                                                fontSize: { xs: '1rem', sm: '1.25rem' }
                                            }}>
                                                <LibraryBooksIcon fontSize="small" /> Subject #{index + 1}
                                            </Typography>
                                            {index > 0 && (
                                                <IconButton onClick={handleRemoveSubject(index)} color="error" sx={{ '&:hover': { backgroundColor: '#FEE2E2' }, p: { xs: 0.5, sm: 1 } }}>
                                                    <RemoveCircleOutlineIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Stack>
                                        
                                        <Grid container spacing={{ xs: 2, sm: 3 }}>
                                            <Grid item xs={12} md={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Subject Name"
                                                    variant="outlined"
                                                    value={subject.subName}
                                                    onChange={handleSubjectNameChange(index)}
                                                    placeholder="e.g. Mathematics"
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Subject Code"
                                                    variant="outlined"
                                                    value={subject.subCode}
                                                    onChange={handleSubjectCodeChange(index)}
                                                    placeholder="e.g. MATH101"
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Sessions"
                                                    variant="outlined"
                                                    type="number"
                                                    inputProps={{ min: 0 }}
                                                    value={subject.sessions}
                                                    onChange={handleSessionsChange(index)}
                                                    placeholder="e.g. 30"
                                                    required
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}

                                <Divider />

                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={handleAddSubject}
                                        sx={{ 
                                            width: { xs: '100%', sm: 'auto' },
                                            borderRadius: '12px', 
                                            textTransform: 'none', 
                                            fontWeight: 600,
                                            borderColor: '#6366F1',
                                            color: '#6366F1',
                                            padding: { xs: '10px 16px', sm: '8px 20px' },
                                            fontSize: { xs: '0.875rem', sm: '0.9rem' },
                                            '&:hover': { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' }
                                        }}
                                    >
                                        Add Another Subject
                                    </Button>

                                    <Button 
                                        variant="contained" 
                                        type="submit" 
                                        disabled={loader}
                                        startIcon={loader ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                        sx={{
                                            width: { xs: '100%', sm: 'auto' },
                                            backgroundColor: '#6366F1',
                                            '&:hover': { backgroundColor: '#4F46E5' },
                                            borderRadius: '12px',
                                            padding: { xs: '10px 24px', sm: '10px 28px' },
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            fontSize: { xs: '0.875rem', sm: '0.95rem' },
                                            boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)'
                                        }}
                                    >
                                        {loader ? 'Saving...' : 'Save All Subjects'}
                                    </Button>
                                </Box>
                            </Stack>
                        </form>
                    </StyledPaper>
                </motion.div>
            </Box>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
}

export default SubjectForm

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '40px',
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
  },
  borderRadius: '24px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#E2E8F0',
      transition: 'all 0.2s',
    },
    '&:hover fieldset': {
      borderColor: '#CBD5E1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6366F1',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748B',
    '&.Mui-focused': {
      color: '#6366F1',
    },
  },
}));