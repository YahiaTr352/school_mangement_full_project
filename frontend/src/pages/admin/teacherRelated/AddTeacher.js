import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { 
    Box, Button, CircularProgress, Stack, TextField, 
    Typography, Container, Paper, IconButton, Divider, 
    Avatar, Grid
} from '@mui/material';
import { motion } from "framer-motion";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SaveIcon from '@mui/icons-material/Save';

const AddTeacher = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subjectID = params.id

  const { status, response, error } = useSelector(state => state.user);
  const { subjectDetails, loading } = useSelector((state) => state.sclass);

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
  }, [dispatch, subjectID]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false)

  const role = "Teacher"
  const school = subjectDetails && subjectDetails.school
  const teachSubject = subjectDetails && subjectDetails._id
  const teachSclass = subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName._id

  const fields = { name, email, password, role, school, teachSubject, teachSclass }

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    dispatch(registerUser(fields, role))
  }

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl())
      navigate("/Admin/teachers")
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
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
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
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <IconButton onClick={() => navigate(-1)} sx={{ color: '#6366F1' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                Add New Teacher
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748B' }}>
                                Register a new faculty member for the selected curriculum
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <Paper elevation={0} sx={{ 
                    padding: '40px', 
                    borderRadius: '24px !important', 
                    backgroundColor: '#FFFFFF !important',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important',
                    border: '1px solid #F1F5F9 !important'
                }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Avatar 
                            sx={{ 
                                width: 80, height: 80, mx: 'auto', mb: 2, 
                                bgcolor: '#EEF2FF', color: '#6366F1'
                            }}
                        >
                            <PersonAddAlt1Icon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B' }}>
                            Teacher Registration
                        </Typography>
                    </Box>

                    <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: '16px', mb: 4, border: '1px solid #E2E8F0' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <LibraryBooksIcon sx={{ color: '#6366F1', fontSize: '1.2rem' }} />
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Subject</Typography>
                                        <Typography variant="body2" fontWeight={700}>{subjectDetails?.subName}</Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <SchoolIcon sx={{ color: '#10B981', fontSize: '1.2rem' }} />
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Class</Typography>
                                        <Typography variant="body2" fontWeight={700}>{subjectDetails?.sclassName?.sclassName}</Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                variant="outlined"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Enter teacher's full name"
                                required
                                autoComplete="name"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />

                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="teacher@school.com"
                                required
                                autoComplete="email"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Create a strong password"
                                required
                                autoComplete="new-password"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />

                            <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="outlined"
                                    onClick={() => navigate(-1)}
                                    sx={{
                                        borderRadius: '12px',
                                        padding: '14px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        color: '#64748B',
                                        borderColor: '#E2E8F0',
                                        '&:hover': { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }
                                    }}
                                >
                                    Cancel
                                </Button>
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
                                    }}
                                >
                                    {loader ? 'Registering...' : 'Add Teacher'}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Paper>
            </motion.div>
        )}
        <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  )
}

export default AddTeacher