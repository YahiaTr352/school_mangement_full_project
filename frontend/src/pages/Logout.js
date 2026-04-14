import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, Container, Paper, Stack, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import LogoutIcon from '@mui/icons-material/Logout';
import CancelIcon from '@mui/icons-material/Cancel';

const Logout = () => {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ 
                height: { xs: '90vh', sm: '80vh' }, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: '100%' }}
                >
                    <StyledPaper elevation={0} sx={{ p: { xs: 3, sm: 6 } }}>
                        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
                            <Avatar sx={{ 
                                width: { xs: 60, sm: 80 }, 
                                height: { xs: 60, sm: 80 }, 
                                mx: 'auto', mb: 2, 
                                bgcolor: '#FEE2E2', color: '#EF4444',
                                borderRadius: '20px'
                            }}>
                                <LogoutIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
                            </Avatar>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 800, 
                                    color: '#1E1B4B', 
                                    mb: 1, 
                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                    fontSize: { xs: '1.75rem', sm: '2.125rem' }
                                }}
                            >
                                Logging Out?
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748B', mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                Hey <strong>{currentUser?.name}</strong>, are you sure you want to end your session?
                            </Typography>
                        </Box>

                        <Stack spacing={2} sx={{ flexDirection: { xs: 'column', sm: 'column' } }}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleLogout}
                                startIcon={<LogoutIcon />}
                                sx={{
                                    backgroundColor: '#EF4444',
                                    '&:hover': { backgroundColor: '#DC2626' },
                                    borderRadius: '12px',
                                    padding: { xs: '12px', sm: '14px' },
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)',
                                }}
                            >
                                Yes, Log Me Out
                            </Button>
                            
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleCancel}
                                startIcon={<CancelIcon />}
                                sx={{
                                    borderRadius: '12px',
                                    padding: { xs: '12px', sm: '14px' },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    color: '#64748B',
                                    borderColor: '#E2E8F0',
                                    '&:hover': { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }
                                }}
                            >
                                No, Keep Me Logged In
                            </Button>
                        </Stack>
                    </StyledPaper>
                </motion.div>
            </Box>
        </Container>
    );
};

const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '32px !important',
    backgroundColor: '#FFFFFF !important',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important',
    border: '1px solid #F1F5F9 !important',
}));

export default Logout;