import React, { useEffect, useState } from "react";
import { 
    Box, Button, CircularProgress, Stack, TextField, 
    Typography, Container, Paper, IconButton, Divider 
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from "../../../components/Popup";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import SchoolIcon from '@mui/icons-material/School';
import SaveIcon from '@mui/icons-material/Save';

const AddClass = () => {
    const [sclassName, setSclassName] = useState("");

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error, tempDetails } = userState;

    const adminID = currentUser._id
    const address = "Sclass"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        sclassName,
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added' && tempDetails) {
            navigate("/Admin/classes/class/" + tempDetails._id)
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
    }, [status, navigate, error, response, dispatch, tempDetails]);

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
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
                                Add New Class
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748B' }}>
                                Create a new class section for your school
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <StyledPaper elevation={0}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{ 
                            width: 80, height: 80, mx: 'auto', mb: 2, 
                            bgcolor: '#EEF2FF', color: '#6366F1',
                            borderRadius: '20px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <AddHomeWorkIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B' }}>
                            Class Details
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <form onSubmit={submitHandler}>
                        <Stack spacing={4}>
                            <StyledTextField
                                fullWidth
                                label="Class Name"
                                variant="outlined"
                                value={sclassName}
                                placeholder="e.g. Class 10 - Section A"
                                onChange={(event) => {
                                    setSclassName(event.target.value);
                                }}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <SchoolIcon sx={{ color: '#94A3B8', mr: 1 }} />
                                    ),
                                }}
                            />

                            <Box sx={{ display: 'flex', gap: 2 }}>
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
                                    {loader ? 'Creating...' : 'Create Class'}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </StyledPaper>
            </motion.div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    )
}

export default AddClass

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '40px',
  borderRadius: '24px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
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
  '& .MuiInputLabel-root': {
    color: '#64748B',
    '&.Mui-focused': {
      color: '#6366F1',
    },
  },
}));