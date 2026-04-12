import React, { useState, useEffect } from 'react';
import { 
    Box, Container, Typography, Paper, Stack, Grid, Avatar, 
    Divider, Button, TextField, Collapse, IconButton, CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/userRelated/userHandle';
import { underControl } from '../../redux/userRelated/userSlice';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BadgeIcon from '@mui/icons-material/Badge';
import LockIcon from '@mui/icons-material/Lock';
import Popup from '../../components/Popup';

const AdminProfile = () => {
    const dispatch = useDispatch();
    const { currentUser, status, response, error } = useSelector((state) => state.user);
    
    const [showTab, setShowTab] = useState(false);
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState("");
    const [schoolName, setSchoolName] = useState(currentUser.schoolName);

    const address = "Admin";

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        const fields = password === "" ? { name, email, schoolName } : { name, email, password, schoolName };
        dispatch(updateUser(fields, currentUser._id, address));
    };

    useEffect(() => {
        if (status === 'updated') {
            setLoader(false);
            setShowTab(false);
            setMessage("Profile updated successfully");
            setShowPopup(true);
            dispatch(underControl());
        } else if (status === 'failed' || status === 'error') {
            setLoader(false);
            setMessage(response || "Network Error");
            setShowPopup(true);
        }
    }, [status, response, dispatch]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        My Profile
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748B' }}>
                        Manage your account settings and personal information
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <StyledPaper elevation={0} sx={{ textAlign: 'center', p: 4 }}>
                            <Avatar sx={{ 
                                width: 120, height: 120, mx: 'auto', mb: 2, 
                                bgcolor: '#6366F1', fontSize: '3rem',
                                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
                            }}>
                                {currentUser.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 0.5 }}>
                                {currentUser.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6366F1', fontWeight: 600, mb: 3 }}>
                                Administrator
                            </Typography>
                            
                            <Divider sx={{ mb: 3 }} />
                            
                            <Stack spacing={2} sx={{ textAlign: 'left' }}>
                                <InfoItem icon={<BadgeIcon sx={{ color: '#94A3B8' }} />} label="Role" value="Admin" />
                                <InfoItem icon={<SchoolIcon sx={{ color: '#94A3B8' }} />} label="Institution" value={currentUser.schoolName} />
                                <InfoItem icon={<EmailIcon sx={{ color: '#94A3B8' }} />} label="Email" value={currentUser.email} />
                            </Stack>

                            <Button 
                                fullWidth
                                variant="contained" 
                                startIcon={showTab ? <KeyboardArrowUpIcon /> : <EditIcon />}
                                onClick={() => setShowTab(!showTab)}
                                sx={{ 
                                    mt: 4, 
                                    borderRadius: '12px',
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    backgroundColor: showTab ? '#64748B' : '#6366F1',
                                    '&:hover': { backgroundColor: showTab ? '#475569' : '#4F46E5' }
                                }}
                            >
                                {showTab ? 'Cancel Editing' : 'Edit Profile'}
                            </Button>
                        </StyledPaper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Collapse in={showTab} timeout="auto" unmountOnExit>
                            <StyledPaper elevation={0} sx={{ p: 4, mb: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EditIcon color="primary" /> Edit Details
                                </Typography>
                                
                                <form onSubmit={submitHandler}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                label="Full Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                InputProps={{ startAdornment: <PersonIcon sx={{ color: '#94A3B8', mr: 1 }} /> }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                label="School Name"
                                                value={schoolName}
                                                onChange={(e) => setSchoolName(e.target.value)}
                                                required
                                                InputProps={{ startAdornment: <SchoolIcon sx={{ color: '#94A3B8', mr: 1 }} /> }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StyledTextField
                                                fullWidth
                                                label="Email Address"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                InputProps={{ startAdornment: <EmailIcon sx={{ color: '#94A3B8', mr: 1 }} /> }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StyledTextField
                                                fullWidth
                                                label="New Password (leave blank to keep current)"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                InputProps={{ startAdornment: <LockIcon sx={{ color: '#94A3B8', mr: 1 }} /> }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                disabled={loader}
                                                startIcon={loader ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                                sx={{ 
                                                    borderRadius: '12px',
                                                    px: 4, py: 1.5,
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    backgroundColor: '#10B981',
                                                    '&:hover': { backgroundColor: '#059669' }
                                                }}
                                            >
                                                {loader ? 'Updating...' : 'Save Changes'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </StyledPaper>
                        </Collapse>

                        <StyledPaper elevation={0} sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 3 }}>
                                Account Overview
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <StatBox label="User ID" value={`#${currentUser._id.substring(0, 8)}`} />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <StatBox label="Status" value="Active" color="#10B981" />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <StatBox label="Permissions" value="Full Access" />
                                </Grid>
                            </Grid>
                        </StyledPaper>
                    </Grid>
                </Grid>
            </motion.div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon}
        <Box>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, display: 'block', mb: -0.5 }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E1B4B' }}>
                {value}
            </Typography>
        </Box>
    </Box>
);

const StatBox = ({ label, value, color = '#1E1B4B' }) => (
    <Box sx={{ p: 2, borderRadius: '16px', bgcolor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 0.5 }}>
            {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700, color: color }}>
            {value}
        </Typography>
    </Box>
);

const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '24px !important',
    backgroundColor: '#FFFFFF !important',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02) !important',
    border: '1px solid #F1F5F9 !important',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        '& fieldset': { borderColor: '#E2E8F0' },
        '&:hover fieldset': { borderColor: '#CBD5E1' },
        '&.Mui-focused fieldset': { borderColor: '#6366F1', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root': {
        color: '#64748B',
        '&.Mui-focused': { color: '#6366F1' },
    },
}));

export default AdminProfile;