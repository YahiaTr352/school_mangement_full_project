import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Button, Grid, Box, Typography, Paper, Checkbox, 
    FormControlLabel, TextField, CssBaseline, IconButton, 
    InputAdornment, CircularProgress, Backdrop 
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Badge, Person } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import bgpic from "../assets/designlogin.jpg";

const LoginPage = ({ role }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false);
    const [guestLoader, setGuestLoader] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [rollNumberError, setRollNumberError] = useState(false);
    const [studentNameError, setStudentNameError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (role === "Student") {
            const rollNum = event.target.rollNumber.value;
            const studentName = event.target.studentName.value;
            const password = event.target.password.value;

            if (!rollNum || !studentName || !password) {
                if (!rollNum) setRollNumberError(true);
                if (!studentName) setStudentNameError(true);
                if (!password) setPasswordError(true);
                return;
            }
            const fields = { rollNum, studentName, password };
            setLoader(true);
            dispatch(loginUser(fields, role));
        } else {
            const email = event.target.email.value;
            const password = event.target.password.value;

            if (!email || !password) {
                if (!email) setEmailError(true);
                if (!password) setPasswordError(true);
                return;
            }

            const fields = { email, password };
            setLoader(true);
            dispatch(loginUser(fields, role));
        }
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'rollNumber') setRollNumberError(false);
        if (name === 'studentName') setStudentNameError(false);
    };

    const guestModeHandler = () => {
        const password = "zxc";
        if (role === "Admin") {
            const email = "yogendra@12";
            const fields = { email, password };
            setGuestLoader(true);
            dispatch(loginUser(fields, role));
        } else if (role === "Student") {
            const rollNum = "1";
            const studentName = "Dipesh Awasthi";
            const fields = { rollNum, studentName, password };
            setGuestLoader(true);
            dispatch(loginUser(fields, role));
        } else if (role === "Teacher") {
            const email = "tony@12";
            const fields = { email, password };
            setGuestLoader(true);
            dispatch(loginUser(fields, role));
        }
    };

    useEffect(() => {
        if (status === 'success' || currentUser !== null) {
            if (currentRole === 'Admin') navigate('/Admin/dashboard');
            else if (currentRole === 'Student') navigate('/Student/dashboard');
            else if (currentRole === 'Teacher') navigate('/Teacher/dashboard');
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
            setGuestLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
            setGuestLoader(false);
        }
    }, [status, currentRole, navigate, response, currentUser]);

    return (
        <StyledRoot container>
            <CssBaseline />
            {/* Left Side: Login Form */}
            <Grid item xs={12} md={5} component={Paper} elevation={0} square sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ my: 8, mx: { xs: 4, md: 8 }, width: '100%', maxWidth: '400px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', mb: 1, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            {role} Login
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>
                            Welcome back! Please enter your details to continue.
                        </Typography>
                    </motion.div>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            {role === "Student" ? (
                                <>
                                    <StyledTextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="rollNumber"
                                        label="Roll Number"
                                        name="rollNumber"
                                        autoComplete="off"
                                        type="number"
                                        autoFocus
                                        error={rollNumberError}
                                        helperText={rollNumberError && 'Roll Number is required'}
                                        onChange={handleInputChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Badge sx={{ color: '#94A3B8' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <StyledTextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="studentName"
                                        label="Full Name"
                                        name="studentName"
                                        autoComplete="name"
                                        error={studentNameError}
                                        helperText={studentNameError && 'Name is required'}
                                        onChange={handleInputChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person sx={{ color: '#94A3B8' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </>
                            ) : (
                                <StyledTextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
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
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" sx={{ borderRadius: '4px' }} />}
                                label={<Typography variant="body2" sx={{ color: '#64748B' }}>Remember me</Typography>}
                            />
                            <Typography variant="body2">
                                <Link to="#" style={{ color: '#6366F1', fontWeight: 600, textDecoration: 'none' }}>
                                    Forgot password?
                                </Link>
                            </Typography>
                        </Box>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <LoginButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 4, mb: 2 }}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Login"}
                            </LoginButton>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            <Button
                                fullWidth
                                onClick={guestModeHandler}
                                variant="outlined"
                                sx={{ 
                                    py: 1.5, borderRadius: '12px', borderColor: '#E2E8F0', color: '#475569', 
                                    textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: '#6366F1', backgroundColor: '#F5F3FF' }
                                }}
                            >
                                {guestLoader ? <CircularProgress size={24} color="inherit" /> : "Login as Guest"}
                            </Button>
                        </motion.div>

                        {role === "Admin" && (
                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                    Don't have an account?{' '}
                                    <Link to="/Adminregister" style={{ color: '#6366F1', fontWeight: 700, textDecoration: 'none' }}>
                                        Sign up
                                    </Link>
                                </Typography>
                            </Box>
                        )}
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

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backdropFilter: 'blur(4px)' }} open={guestLoader && false}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledRoot>
    );
};

export default LoginPage;

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

const LoginButton = styled(Button)(({ theme }) => ({
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
