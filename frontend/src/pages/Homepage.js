import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Students from "../assets/students.svg";

const Homepage = () => {
    return (
        <StyledContainer maxWidth={false}>
            <Grid container spacing={0} sx={{ minHeight: '100vh' }}>
                <Grid item xs={12} md={7} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#F8FAFC', // Slate 50
                    p: 4
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Box sx={{ maxWidth: '600px', textAlign: 'center' }}>
                            <img 
                                src={Students} 
                                alt="students" 
                                style={{ 
                                    width: '100%', 
                                    height: 'auto',
                                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))'
                                }} 
                            />
                        </Box>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={5} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                    p: { xs: 4, md: 8 },
                    pb: { xs: 12, md: 8 }
                }}>
                    <Box sx={{ width: '100%', maxWidth: '440px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Typography 
                                variant="h1" 
                                sx={{ 
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    fontWeight: 800,
                                    color: '#0F172A', // Slate 900
                                    lineHeight: 1.1,
                                    mb: 3,
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                Elevate Your <br />
                                <Box component="span" sx={{ color: '#4338CA' }}>Education</Box> <br />
                                Management
                            </Typography>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: '#64748B', // Slate 500
                                    fontSize: '1.125rem',
                                    lineHeight: 1.6,
                                    mb: 6
                                }}
                            >
                                A comprehensive platform designed to streamline school administration, 
                                empower teachers, and engage students in a seamless digital environment.
                            </Typography>
                        </motion.div>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <StyledLink to="/choose">
                                    <Button 
                                        variant="contained" 
                                        fullWidth
                                        sx={{ 
                                            py: 2, 
                                            borderRadius: '12px',
                                            backgroundColor: '#4338CA',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            boxShadow: '0 4px 6px -1px rgba(67, 56, 202, 0.2)',
                                            '&:hover': {
                                                backgroundColor: '#3730A3',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 10px 15px -3px rgba(67, 56, 202, 0.3)'
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </StyledLink>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                            >
                                <StyledLink to="/chooseasguest">
                                    <Button 
                                        variant="outlined" 
                                        fullWidth
                                        sx={{ 
                                            py: 2, 
                                            borderRadius: '12px',
                                            borderColor: '#E2E8F0',
                                            color: '#475569',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            '&:hover': {
                                                borderColor: '#CBD5E1',
                                                backgroundColor: '#F8FAFC',
                                                color: '#0F172A',
                                                transform: 'translateY(-2px)'
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        Try as Guest
                                    </Button>
                                </StyledLink>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.9 }}
                            >
                                <Box sx={{ mt: 4, textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                        New to the platform?{' '}
                                        <Link 
                                            to="/Adminregister" 
                                            style={{ 
                                                color: '#4338CA', 
                                                fontWeight: 600,
                                                textDecoration: 'none'
                                            }}
                                        >
                                            Create an Admin Account
                                        </Link>
                                    </Typography>
                                </Box>
                            </motion.div>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </StyledContainer>
    );
};

export default Homepage;

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: '0 !important',
  margin: '0 !important',
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  width: '100%',
}));