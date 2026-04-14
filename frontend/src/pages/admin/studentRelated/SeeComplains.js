import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Paper, Box, Checkbox, Container, Typography, Stack, CircularProgress, IconButton, Tooltip, Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import TableTemplate from '../../../components/TableTemplate';

const SeeComplains = () => {
    const dispatch = useDispatch();
    const { complainsList, loading, error, response } = useSelector((state) => state.complain);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllComplains(currentUser._id, "Complain"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const complainColumns = [
        { id: 'user', label: 'Student Name', minWidth: 170 },
        { id: 'complaint', label: 'Complaint Message', minWidth: 200 },
        { id: 'date', label: 'Date Submitted', minWidth: 170 },
    ];

    const complainRows = complainsList && complainsList.length > 0 && complainsList.map((complain) => {
        const date = new Date(complain.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : "Invalid Date";
        return {
            user: complain.user?.name || "Unknown",
            complaint: complain.complaint,
            date: dateString,
            id: complain._id,
        };
    });

    const ComplainButtonHaver = ({ row }) => {
        return (
            <Tooltip title="Mark as Reviewed">
                <IconButton color="primary">
                    <CheckCircleOutlineIcon />
                </IconButton>
            </Tooltip>
        );
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
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
                    <Box sx={{ mb: 4 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                            <FeedbackIcon sx={{ color: '#F43F5E', fontSize: { xs: 28, sm: 32 } }} />
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 800, 
                                    color: '#1E1B4B', 
                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                                }}
                            >
                                Complaints Box
                            </Typography>
                        </Stack>
                        <Typography variant="body1" sx={{ color: '#64748B', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            Review and manage student feedback and concerns
                        </Typography>
                    </Box>

                    {response || !Array.isArray(complainsList) || complainsList.length === 0 ? (
                        <StyledPaper elevation={0} sx={{ textAlign: 'center', py: { xs: 8, sm: 12 }, px: 3 }}>
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Box sx={{ 
                                    backgroundColor: '#F1F5F9', 
                                    width: { xs: 80, sm: 100 }, 
                                    height: { xs: 80, sm: 100 }, 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    mx: 'auto', 
                                    mb: 3 
                                }}>
                                    <CheckCircleOutlineIcon sx={{ fontSize: { xs: 40, sm: 50 }, color: '#10B981' }} />
                                </Box>
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        fontWeight: 700, 
                                        color: '#1E1B4B', 
                                        mb: 1.5,
                                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                    }}
                                >
                                    All Clear!
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        color: '#64748B', 
                                        maxWidth: '400px', 
                                        mx: 'auto',
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }}
                                >
                                    There are no pending complaints to review. Great job maintaining a happy school environment!
                                </Typography>
                            </motion.div>
                        </StyledPaper>
                    ) : (
                        <StyledPaper elevation={0}>
                            <TableTemplate 
                                buttonHaver={ComplainButtonHaver} 
                                columns={complainColumns} 
                                rows={complainRows} 
                            />
                        </StyledPaper>
                    )}
                </motion.div>
            )}
        </Container>
    );
};

export default SeeComplains;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: '24px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
  overflow: 'hidden'
}));