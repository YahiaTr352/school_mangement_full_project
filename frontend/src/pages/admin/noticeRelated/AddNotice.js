import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { 
    Box, Button, CircularProgress, Stack, TextField, 
    Typography, Container, Paper, IconButton, Divider 
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SaveIcon from '@mui/icons-material/Save';
import Popup from '../../../components/Popup';

const AddNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, response, error, currentUser } = useSelector(state => state.user);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState('');
  const adminID = currentUser._id

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const fields = { title, details, date, adminID };
  const address = "Notice"

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === 'added') {
      navigate('/Admin/notices');
      dispatch(underControl())
      setLoader(false)
    } else if (status === 'error' || status === 'failed') {
      setMessage(response || "Network Error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton onClick={() => navigate(-1)} sx={{ 
                        color: '#6366F1',
                        backgroundColor: '#EEF2FF',
                        '&:hover': { backgroundColor: '#E0E7FF' }
                    }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            Add Notice
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748B' }}>
                            Post an announcement to the school board
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
                        <AssignmentIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B' }}>
                        Notice Details
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <form onSubmit={submitHandler}>
                    <Stack spacing={4}>
                        <StyledTextField
                            fullWidth
                            label="Notice Title"
                            variant="outlined"
                            value={title}
                            placeholder="Enter a catchy title for the notice"
                            onChange={(event) => setTitle(event.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <TitleIcon sx={{ color: '#94A3B8', mr: 1 }} />
                                ),
                            }}
                        />

                        <StyledTextField
                            fullWidth
                            label="Details"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={details}
                            placeholder="Provide all the necessary details..."
                            onChange={(event) => setDetails(event.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <DescriptionIcon sx={{ color: '#94A3B8', mr: 1, mt: 1, alignSelf: 'flex-start' }} />
                                ),
                            }}
                        />

                        <StyledTextField
                            fullWidth
                            label="Date"
                            type="date"
                            variant="outlined"
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <CalendarTodayIcon sx={{ color: '#94A3B8', mr: 1 }} />
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
                                {loader ? 'Posting...' : 'Post Notice'}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </StyledPaper>
        </motion.div>
        <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  );
};

export default AddNotice;

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