import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Box, Container, Typography, Paper, Stack, Grid, 
    IconButton, Divider, Avatar, Button, CircularProgress, Card
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    if (error) {
        console.log(error);
    }

    const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 10 }}>
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
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={() => navigate(-1)} sx={{ color: '#6366F1' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            Teacher Profile
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <StyledPaper elevation={0} sx={{ textAlign: 'center' }}>
                                <Avatar 
                                    sx={{ 
                                        width: 120, height: 120, mx: 'auto', mb: 2, 
                                        bgcolor: '#EEF2FF', color: '#6366F1',
                                        fontSize: '3rem', fontWeight: 700
                                    }}
                                >
                                    {teacherDetails?.name ? teacherDetails.name.charAt(0) : <PersonIcon fontSize="large" />}
                                </Avatar>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E1B4B', mb: 0.5 }}>
                                    {teacherDetails?.name}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#64748B', mb: 3 }}>
                                    Subject Specialist
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                <Stack spacing={2} sx={{ textAlign: 'left' }}>
                                    <DetailItem 
                                        icon={<SchoolIcon fontSize="small" />} 
                                        label="Assigned Class" 
                                        value={teacherDetails?.teachSclass?.sclassName} 
                                    />
                                    <DetailItem 
                                        icon={<LibraryBooksIcon fontSize="small" />} 
                                        label="Teaching Subject" 
                                        value={teacherDetails?.teachSubject?.subName || "Not Assigned"} 
                                    />
                                </Stack>
                            </StyledPaper>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <StyledPaper elevation={0}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 3 }}>
                                            Academic Information
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <InfoCard>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <IconBox sx={{ bgcolor: '#EEF2FF', color: '#6366F1' }}>
                                                            <LibraryBooksIcon />
                                                        </IconBox>
                                                        <Box>
                                                            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Subject</Typography>
                                                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                                                {teacherDetails?.teachSubject?.subName || "None"}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </InfoCard>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InfoCard>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <IconBox sx={{ bgcolor: '#ECFDF5', color: '#10B981' }}>
                                                            <EventNoteIcon />
                                                        </IconBox>
                                                        <Box>
                                                            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Total Sessions</Typography>
                                                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                                                {teacherDetails?.teachSubject?.sessions || "0"}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </InfoCard>
                                            </Grid>
                                        </Grid>

                                        {!isSubjectNamePresent && (
                                            <Box sx={{ mt: 4, textAlign: 'center', p: 4, border: '2px dashed #E2E8F0', borderRadius: '16px' }}>
                                                <Typography variant="body1" sx={{ color: '#64748B', mb: 2 }}>
                                                    This teacher hasn't been assigned a subject yet.
                                                </Typography>
                                                <Button 
                                                    variant="contained"
                                                    startIcon={<AddCircleOutlineIcon />}
                                                    onClick={handleAddSubject}
                                                    sx={{ 
                                                        backgroundColor: '#6366F1',
                                                        '&:hover': { backgroundColor: '#4F46E5' },
                                                        borderRadius: '10px',
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    Assign Subject
                                                </Button>
                                            </Box>
                                        )}
                                    </StyledPaper>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <StyledPaper elevation={0} sx={{ bgcolor: '#F8FAFC', borderStyle: 'dashed' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 1 }}>
                                            Performance Overview
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                                            Detailed analytics and student feedback metrics will appear here once the term evaluations are completed.
                                        </Typography>
                                    </StyledPaper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </motion.div>
            )}
        </Container>
    );
};

export default TeacherDetails;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '32px',
  borderRadius: '24px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
}));

const InfoCard = styled(Card)(({ theme }) => ({
  padding: '20px',
  borderRadius: '16px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: 'none !important',
  border: '1px solid #F1F5F9 !important',
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const DetailItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#F8FAFC', borderRadius: '12px' }}>
        <Box sx={{ color: '#6366F1', display: 'flex' }}>{icon}</Box>
        <Box>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E1B4B' }}>{value || "N/A"}</Typography>
        </Box>
    </Box>
);