import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Grid, Box, Typography, Paper, Checkbox, 
    FormControlLabel, TextField, CssBaseline, IconButton, 
    InputAdornment, CircularProgress, Button 
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Business, Person } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { registerUser } from '../../redux/userRelated/userHandle';
import Popup from '../../components/Popup';
import bgpic from "../../assets/designlogin.jpg";

const AdminRegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [adminNameError, setAdminNameError] = useState(false);
    const [schoolNameError, setSchoolNameError] = useState(false);
    const role = "Admin";

    const handleSubmit = (event) => {
        event.preventDefault();

        const name = event.target.adminName.value;
        const schoolName = event.target.schoolName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        if (!name || !schoolName || !email || !password) {
            if (!name) setAdminNameError(true);
            if (!schoolName) setSchoolNameError(true);
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            return;
        }

        const fields = { name, email, password, role, schoolName };
        setLoader(true);
        dispatch(registerUser(fields, role));
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'adminName') setAdminNameError(false);
        if (name === 'schoolName') setSchoolNameError(false);
    };

    useEffect(() => {
        if (status === 'success' || (currentUser !== null && currentRole === 'Admin')) {
            navigate('/Admin/dashboard');
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, currentUser, currentRole, navigate, response]);

    return (
        <StyledRoot container>
            <CssBaseline />
            {/* Left Side: Registration Form */}
            <Grid item xs={12} md={5} component={Paper} elevation={0} square sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ my: 8, mx: { xs: 4, md: 8 }, width: '100%', maxWidth: '400px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', mb: 1, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            Admin Register
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>
                            Launch your institution today. Join 500+ schools managing their future smarter.
                        </Typography>
                    </motion.div>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <StyledTextField
                                margin="normal"
                                required
                                fullWidth
                                id="adminName"
                                label="Full Name"
                                name="adminName"
                                autoComplete="name"
                                autoFocus
                                error={adminNameError}
                                helperText={adminNameError && 'Name is required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person sx={{ color: '#94A3B8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <StyledTextField
                                margin="normal"
                                required
                                fullWidth
                                id="schoolName"
                                label="Institution Name"
                                name="schoolName"
                                autoComplete="off"
                                error={schoolNameError}
                                helperText={schoolNameError && 'School name is required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Business sx={{ color: '#94A3B8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <StyledTextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                error={emailError}
                                helperText={emailError && 'Email is required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#94A3B8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            <StyledTextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={toggle ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                error={passwordError}
                                helperText={passwordError && 'Password is required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#94A3B8' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)} edge="end">
                                                {toggle ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </motion.div>

                        <Box sx={{ mt: 1 }}>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" sx={{ borderRadius: '4px' }} />}
                                label={<Typography variant="body2" sx={{ color: '#64748B' }}>I agree to the Terms & Conditions</Typography>}
                            />
                        </Box>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                            <RegisterButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 4, mb: 2 }}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
                            </RegisterButton>
                        </motion.div>

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                Already have an account?{' '}
                                <Link to="/Adminlogin" style={{ color: '#6366F1', fontWeight: 700, textDecoration: 'none' }}>
                                    Log in
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Grid>

            {/* Right Side: Decorative Image Section */}
            <Grid
                item xs={false} md={7}
                sx={{
                    backgroundImage: `url(${bgpic})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#EEF2FF',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(99, 102, 241, 0.1)', // Indigo overlay
                    }
                }}
            />

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledRoot>
    );
}

export default AdminRegisterPage;

const StyledRoot = styled(Grid)(({ theme }) => ({
  height: '100vh',
  backgroundColor: '#FFFFFF',
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
      borderColor: '#6366F1',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#94A3B8',
    '&.Mui-focused': {
      color: '#6366F1',
    },
  },
}));

const RegisterButton = styled(Button)(({ theme }) => ({
  padding: '14px !important',
  borderRadius: '12px !important',
  backgroundColor: '#6366F1 !important',
  textTransform: 'none !important',
  fontWeight: '700 !important',
  fontSize: '1rem !important',
  boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3) !important',
  transition: 'all 0.2s ease-in-out !important',

  '&:hover': {
    backgroundColor: '#4F46E5 !important',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4) !important',
  },
}));
