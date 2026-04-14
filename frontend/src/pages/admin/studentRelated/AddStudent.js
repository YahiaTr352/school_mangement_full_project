import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { 
    Box, Button, CircularProgress, Stack, TextField, 
    Typography, Container, Paper, IconButton, Divider, 
    Avatar, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { motion } from "framer-motion";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SaveIcon from '@mui/icons-material/Save';

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('')
    const [className, setClassName] = useState('')
    const [sclassName, setSclassName] = useState('')

    const adminID = currentUser?._id
    const role = "Student"
    const attendance = []

    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id || '');
        }
    }, [params.id, situation]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (adminID) {
            dispatch(getAllSclasses(adminID, "Sclass"));
        }
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        if (event.target.value === 'Select Class') {
            setClassName('Select Class');
            setSclassName('');
        } else {
            const selectedClass = sclassesList?.find(
                (classItem) => classItem.sclassName === event.target.value
            );
            if (selectedClass) {
                setClassName(selectedClass.sclassName);
                setSclassName(selectedClass._id);
            }
        }
    }

    const fields = { name, rollNum, password, sclassName, adminID, role, attendance }

    const submitHandler = (event) => {
        event.preventDefault()
        if (!sclassName) {
            setMessage("Please select a classname")
            setShowPopup(true)
        }
        else {
            setLoader(true)
            dispatch(registerUser(fields, role))
        }
    }

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl())
            navigate(-1)
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
        <Container maxWidth="sm" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 } }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
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
                                Add New Student
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748B', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                {situation === "Class" ? "Enroll a student to the selected class" : "Register a new student to the system"}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <Paper elevation={0} sx={{ 
                    padding: { xs: '24px', sm: '40px' }, 
                    borderRadius: '24px !important', 
                    backgroundColor: '#FFFFFF !important',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important',
                    border: '1px solid #F1F5F9 !important'
                }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Avatar 
                            sx={{ 
                                width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, mx: 'auto', mb: 2, 
                                bgcolor: '#EEF2FF', color: '#6366F1'
                            }}
                        >
                            <GroupAddIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                            Student Registration
                        </Typography>
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
                                placeholder="Enter student's full name"
                                required
                                autoComplete="name"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />

                            {situation === "Student" && (
                                <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                                    <InputLabel id="select-class-label">Class</InputLabel>
                                    <Select
                                        labelId="select-class-label"
                                        value={className}
                                        label="Class"
                                        onChange={changeHandler}
                                        required
                                    >
                                        <MenuItem value='Select Class'>Select Class</MenuItem>
                                        {sclassesList?.map((classItem, index) => (
                                            <MenuItem key={index} value={classItem.sclassName}>
                                                {classItem.sclassName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            <TextField
                                fullWidth
                                label="Roll Number"
                                type="number"
                                variant="outlined"
                                value={rollNum}
                                onChange={(event) => setRollNum(event.target.value)}
                                placeholder="Enter roll number"
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Create a password"
                                required
                                autoComplete="new-password"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />

                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: { xs: 'column-reverse', sm: 'row' },
                                gap: 2, 
                                pt: 2 
                            }}>
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="outlined"
                                    onClick={() => navigate(-1)}
                                    sx={{
                                        borderRadius: '12px',
                                        padding: { xs: '10px', sm: '14px' },
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        color: '#64748B',
                                        borderColor: '#E2E8F0',
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
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
                                        padding: { xs: '10px', sm: '14px' },
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)',
                                    }}
                                >
                                    {loader ? 'Adding...' : 'Add Student'}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Paper>
            </motion.div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    )
}

export default AddStudent