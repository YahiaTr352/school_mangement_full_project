import React from 'react';
import { 
    Typography, 
    Grid, 
    Box, 
    Avatar, 
    Container, 
    Paper, 
    Divider,
    Stack
} from '@mui/material';
import { 
    Person as PersonIcon, 
    Badge as BadgeIcon, 
    School as SchoolIcon, 
    Class as ClassIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Cake as BirthIcon,
    Wc as GenderIcon,
    ContactPhone as EmergencyIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const StudentProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const sclassName = currentUser.sclassName;
    const studentSchool = currentUser.school;

    return (
        <StyledRoot>
            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header Profile Section */}
                    <HeaderPaper elevation={0}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <StyledAvatar>
                                {String(currentUser.name).charAt(0)}
                            </StyledAvatar>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 800, 
                                color: '#1E1B4B', 
                                mt: 2, 
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                fontSize: { xs: '1.5rem', sm: '2.125rem' }
                            }}>
                                {currentUser.name}
                            </Typography>
                            <Typography variant="body1" sx={{ 
                                color: '#6366F1', 
                                fontWeight: 700, 
                                mt: 0.5,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}>
                                Student ID: #{currentUser._id.slice(-6).toUpperCase()}
                            </Typography>
                        </Box>
                    </HeaderPaper>

                    <Grid container spacing={3}>
                        {/* Academic Details */}
                        <Grid item xs={12}>
                            <InfoPaper elevation={0}>
                                <SectionTitle>
                                    <ClassIcon sx={{ color: '#6366F1', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                                    Academic Details
                                </SectionTitle>
                                <Divider sx={{ mb: 3 }} />
                                <Grid container spacing={{ xs: 2, sm: 3 }}>
                                    <Grid item xs={12} sm={4}>
                                        <InfoItem icon={<BadgeIcon />} label="Roll Number" value={currentUser.rollNum} />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <InfoItem icon={<ClassIcon />} label="Current Class" value={sclassName?.sclassName} />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <InfoItem icon={<SchoolIcon />} label="School" value={studentSchool?.schoolName} />
                                    </Grid>
                                </Grid>
                            </InfoPaper>
                        </Grid>

                        {/* Personal Information */}
                        <Grid item xs={12}>
                            <InfoPaper elevation={0}>
                                <SectionTitle>
                                    <PersonIcon sx={{ color: '#6366F1', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                                    Personal Information
                                </SectionTitle>
                                <Divider sx={{ mb: 3 }} />
                                <Grid container spacing={{ xs: 2, sm: 3 }}>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem icon={<BirthIcon />} label="Date of Birth" value="January 1, 2000" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem icon={<GenderIcon />} label="Gender" value="Male" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem icon={<EmailIcon />} label="Email Address" value="john.doe@example.com" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem icon={<PhoneIcon />} label="Phone Number" value="(123) 456-7890" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem icon={<LocationIcon />} label="Residential Address" value="123 Main Street, City, Country" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem icon={<EmergencyIcon />} label="Emergency Contact" value="(987) 654-3210" />
                                    </Grid>
                                </Grid>
                            </InfoPaper>
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>
        </StyledRoot>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <IconBoxSmall>{icon}</IconBoxSmall>
        <Box>
            <Typography variant="caption" sx={{ 
                color: '#94A3B8', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
            }}>
                {label}
            </Typography>
            <Typography variant="body1" sx={{ 
                color: '#1E1B4B', 
                fontWeight: 600,
                fontSize: { xs: '0.9rem', sm: '1rem' }
            }}>
                {value || 'Not Provided'}
            </Typography>
        </Box>
    </Box>
);

export default StudentProfile;

// Styled Components
const StyledRoot = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    padding: theme.spacing(4, 0),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2, 0),
    },
}));

const HeaderPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(6, 4),
    borderRadius: '24px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    backgroundImage: 'linear-gradient(to bottom, #EEF2FF 0%, #FFFFFF 100%)',
    backgroundSize: '100% 120px',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(4, 2),
        borderRadius: '16px',
        backgroundSize: '100% 80px',
        marginBottom: theme.spacing(2),
    },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    fontSize: '3rem',
    fontWeight: 800,
    backgroundColor: '#6366F1',
    color: '#FFFFFF',
    border: '6px solid #FFFFFF',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.down('sm')]: {
        width: 80,
        height: 80,
        fontSize: '2rem',
        border: '4px solid #FFFFFF',
    },
}));

const InfoPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: '24px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3, 2),
        borderRadius: '16px',
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    variant: 'h6',
    fontWeight: 700,
    color: '#1E1B4B',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.1rem',
        gap: '8px',
    },
}));

const IconBoxSmall = styled(Box)(({ theme }) => ({
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6366F1',
    '& svg': {
        fontSize: '1.25rem'
    },
    [theme.breakpoints.down('sm')]: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        '& svg': {
            fontSize: '1rem'
        }
    }
}));