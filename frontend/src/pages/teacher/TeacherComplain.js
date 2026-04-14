import { useEffect, useState } from 'react';
import { 
    Box, 
    CircularProgress, 
    Stack, 
    TextField, 
    Typography, 
    Container, 
    Paper, 
    InputAdornment, 
    Button 
} from '@mui/material';
import { 
    Event as EventIcon, 
    AssignmentLate as ComplainIcon, 
    Send as SendIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Popup from '../../components/Popup';
import { addStuff } from '../../redux/userRelated/userHandle';
import { useDispatch, useSelector } from 'react-redux';

const TeacherComplain = () => {
    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState("");

    const dispatch = useDispatch();
    const { status, currentUser, error } = useSelector(state => state.user);

    const user = currentUser._id;
    const school = currentUser.school?._id;
    const address = "Complain";

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = { user, date, complaint, school };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === "added") {
            setLoader(false);
            setShowPopup(true);
            setMessage("Complain submitted successfully");
            setComplaint("");
            setDate("");
        } else if (error) {
            setLoader(false);
            setShowPopup(true);
            setMessage("Network Error");
        }
    }, [status, error]);

    return (
        <StyledRoot>
            <Container maxWidth="sm">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <StyledPaper elevation={0}>
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <IconBox>
                                <ComplainIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#4338CA' }} />
                            </IconBox>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 800, 
                                color: '#1E1B4B', 
                                mt: 2, 
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                fontSize: { xs: '1.5rem', sm: '2.125rem' }
                            }}>
                                Teacher Feedback
                            </Typography>
                            <Typography variant="body1" sx={{ 
                                color: '#64748B', 
                                mt: 1,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}>
                                Report issues or provide suggestions to the administration.
                            </Typography>
                        </Box>

                        <form onSubmit={submitHandler}>
                            <Stack spacing={3}>
                                <StyledTextField
                                    fullWidth
                                    label="Date of Incident"
                                    type="date"
                                    value={date}
                                    onChange={(event) => setDate(event.target.value)}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EventIcon sx={{ color: '#94A3B8' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <StyledTextField
                                    fullWidth
                                    label="Description"
                                    variant="outlined"
                                    value={complaint}
                                    onChange={(event) => setComplaint(event.target.value)}
                                    required
                                    multiline
                                    rows={5}
                                    placeholder="Provide a detailed description of your concern..."
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                                <ComplainIcon sx={{ color: '#94A3B8' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <SubmitButton
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    disabled={loader}
                                    endIcon={!loader && <SendIcon />}
                                >
                                    {loader ? <CircularProgress size={24} color="inherit" /> : "Submit Feedback"}
                                </SubmitButton>
                            </Stack>
                        </form>
                    </StyledPaper>
                </motion.div>
            </Container>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledRoot>
    );
};

export default TeacherComplain;

// Styled Components
const StyledRoot = styled(Box)(({ theme }) => ({
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: theme.spacing(4, 0),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2, 0),
    },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(6),
    borderRadius: '24px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
        borderRadius: '16px',
    },
}));

const IconBox = styled(Box)(({ theme }) => ({
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    backgroundColor: '#EEF2FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#F8FAFC',
        '& fieldset': {
            borderColor: '#E2E8F0',
            transition: 'all 0.2s',
        },
        '&:hover fieldset': {
            borderColor: '#CBD5E1',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4338CA',
            borderWidth: '2px',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#64748B',
        '&.Mui-focused': {
            color: '#4338CA',
        },
    },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    padding: '14px',
    borderRadius: '12px',
    backgroundColor: '#4338CA',
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '1rem',
    boxShadow: '0 4px 6px -1px rgba(67, 56, 202, 0.3)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: '#3730A3',
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 15px -3px rgba(67, 56, 202, 0.4)',
    },
    '&.Mui-disabled': {
        backgroundColor: '#E2E8F0',
        color: '#94A3B8'
    },
    [theme.breakpoints.down('sm')]: {
        padding: '10px',
        fontSize: '0.9rem',
    },
}));