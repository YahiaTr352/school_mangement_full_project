import React from 'react';
import { 
    Box, Container, Typography, Paper, Stack, Grid, Avatar, 
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ClassIcon from '@mui/icons-material/Class';

const TeacherProfile = () => {
    const { currentUser } = useSelector((state) => state.user);

    const teachSclass = currentUser.teachSclass;
    const teachSubject = currentUser.teachSubject;
    const teachSchool = currentUser.school;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        Teacher Profile
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748B' }}>
                        Personal details and teaching assignments
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <StyledPaper elevation={0} sx={{ textAlign: 'center', p: 4 }}>
                            <Avatar sx={{ 
                                width: 120, height: 120, mx: 'auto', mb: 2, 
                                bgcolor: '#4338CA', fontSize: '3rem',
                                boxShadow: '0 10px 15px -3px rgba(67, 56, 202, 0.3)'
                            }}>
                                {currentUser.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 0.5 }}>
                                {currentUser.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#4338CA', fontWeight: 600, mb: 3 }}>
                                Professional Educator
                            </Typography>
                            
                            <Divider sx={{ mb: 3 }} />
                            
                            <Stack spacing={2} sx={{ textAlign: 'left' }}>
                                <InfoItem icon={<BadgeIcon sx={{ color: '#94A3B8' }} />} label="Role" value="Teacher" />
                                <InfoItem icon={<EmailIcon sx={{ color: '#94A3B8' }} />} label="Email" value={currentUser.email} />
                                <InfoItem icon={<SchoolIcon sx={{ color: '#94A3B8' }} />} label="Institution" value={teachSchool?.schoolName} />
                            </Stack>
                        </StyledPaper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <StyledPaper elevation={0} sx={{ p: 4, mb: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AutoStoriesIcon color="primary" /> Teaching Assignments
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <AssignmentBox 
                                        icon={<ClassIcon sx={{ fontSize: 30, color: '#6366F1' }} />}
                                        label="Assigned Class"
                                        value={teachSclass?.sclassName}
                                        color="#EEF2FF"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <AssignmentBox 
                                        icon={<AutoStoriesIcon sx={{ fontSize: 30, color: '#10B981' }} />}
                                        label="Primary Subject"
                                        value={teachSubject?.subName}
                                        color="#ECFDF5"
                                    />
                                </Grid>
                            </Grid>
                        </StyledPaper>

                        <StyledPaper elevation={0} sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 3 }}>
                                Account Overview
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <StatBox label="Teacher ID" value={`#${currentUser._id.substring(0, 8)}`} />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <StatBox label="Status" value="Active" color="#10B981" />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <StatBox label="Permissions" value="Limited Access" />
                                </Grid>
                            </Grid>
                        </StyledPaper>
                    </Grid>
                </Grid>
            </motion.div>
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

const AssignmentBox = ({ icon, label, value, color }) => (
    <Box sx={{ 
        p: 3, 
        borderRadius: '20px', 
        bgcolor: color,
        display: 'flex',
        alignItems: 'center',
        gap: 2
    }}>
        <Box sx={{ 
            bgcolor: 'white', 
            p: 1.5, 
            borderRadius: '12px', 
            display: 'flex',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                {label}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E1B4B', lineHeight: 1.2 }}>
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

export default TeacherProfile;