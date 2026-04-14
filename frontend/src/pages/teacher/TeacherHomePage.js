import React, { useEffect } from 'react';
import { Container, Grid, Paper, Box, Typography, Stack } from '@mui/material';
import { 
    PeopleAlt, 
    Assignment, 
    AutoStories, 
    AccessTime,
    NotificationsActive 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import SeeNotice from '../../components/SeeNotice';

const TeacherHomePage = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { subjectDetails, sclassStudents } = useSelector((state) => state.sclass);

    const classID = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        if (subjectID) dispatch(getSubjectDetails(subjectID, "Subject"));
        if (classID) dispatch(getClassStudents(classID));
    }, [dispatch, subjectID, classID]);

    const numberOfStudents = sclassStudents ? sclassStudents.length : 0;
    const numberOfSessions = subjectDetails ? subjectDetails.sessions : 0;

    const stats = [
        {
            title: "Class Students",
            value: numberOfStudents,
            icon: <PeopleAlt sx={{ fontSize: 40 }} />,
            color: "#6366F1", // Indigo
            delay: 0.1
        },
        {
            title: "Total Lessons",
            value: numberOfSessions,
            icon: <AutoStories sx={{ fontSize: 40 }} />,
            color: "#10B981", // Emerald
            delay: 0.2
        },
        {
            title: "Tests Taken",
            value: 24, // Static as in original
            icon: <Assignment sx={{ fontSize: 40 }} />,
            color: "#F59E0B", // Amber
            delay: 0.3
        },
        {
            title: "Total Hours",
            value: 30, // Static as in original
            icon: <AccessTime sx={{ fontSize: 40 }} />,
            color: "#F43F5E", // Rose
            suffix: " hrs",
            delay: 0.4
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ mb: { xs: 3, sm: 5 } }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 800, 
                            color: '#1E1B4B', 
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            mb: 1,
                            fontSize: { xs: '1.5rem', sm: '2.125rem' }
                        }}
                    >
                        Welcome Back, {currentUser.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748B', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        Teaching <Box component="span" sx={{ fontWeight: 700, color: '#6366F1' }}>{currentUser.teachSubject?.subName}</Box> to 
                        <Box component="span" sx={{ fontWeight: 700, color: '#10B981', ml: 1 }}>{currentUser.teachSclass?.sclassName}</Box>
                    </Typography>
                </Box>
            </motion.div>

            <Grid container spacing={{ xs: 2, sm: 3 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: stat.delay }}
                        >
                            <StyledStatCard elevation={0}>
                                <IconContainer sx={{ 
                                    backgroundColor: `${stat.color}15`, 
                                    color: stat.color,
                                    width: { xs: '48px', sm: '60px' },
                                    height: { xs: '48px', sm: '60px' },
                                    borderRadius: { xs: '12px', sm: '16px' }
                                }}>
                                    {React.cloneElement(stat.icon, { sx: { fontSize: { xs: 30, sm: 40 } } })}
                                </IconContainer>
                                <Box sx={{ textAlign: 'left', mt: { xs: 1.5, sm: 2 } }}>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: '#64748B', 
                                            fontWeight: 600, 
                                            textTransform: 'uppercase', 
                                            letterSpacing: '0.05em',
                                            mb: 0.5,
                                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                        }}
                                    >
                                        {stat.title}
                                    </Typography>
                                    <Typography 
                                        variant="h4" 
                                        sx={{ 
                                            fontWeight: 800, 
                                            color: '#1E1B4B',
                                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                                            fontSize: { xs: '1.5rem', sm: '2.125rem' }
                                        }}
                                    >
                                        <CountUp 
                                            start={0} 
                                            end={stat.value} 
                                            duration={2.5} 
                                            suffix={stat.suffix || ""} 
                                        />
                                    </Typography>
                                </Box>
                                <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, fontWeight: 600, mt: { xs: 1.5, sm: 2 }, color: stat.color, opacity: 0.8 }}>
                                    Active for current semester
                                </Typography>
                            </StyledStatCard>
                        </motion.div>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <StyledPaper elevation={0}>
                            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                                <NotificationsActive sx={{ color: '#6366F1', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        fontWeight: 700, 
                                        color: '#1E1B4B',
                                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                                        fontSize: { xs: '1rem', sm: '1.25rem' }
                                    }}
                                >
                                    Recent Notices & Announcements
                                </Typography>
                            </Stack>
                            <SeeNotice />
                        </StyledPaper>
                    </motion.div>
                </Grid>
            </Grid>
        </Container>
    );
};

const StyledStatCard = styled(Paper)(({ theme }) => ({
    padding: '24px',
    borderRadius: '20px !important',
    backgroundColor: '#FFFFFF !important',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
    border: '1px solid #F1F5F9 !important',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out !important',
    [theme.breakpoints.down('sm')]: {
        padding: '16px',
    },
  
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1) !important',
      borderColor: '#E2E8F0 !important',
    },
}));
  
const IconContainer = styled(Box)(({ theme }) => ({
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
  
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: '32px',
    borderRadius: '20px !important',
    backgroundColor: '#FFFFFF !important',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
    border: '1px solid #F1F5F9 !important',
    [theme.breakpoints.down('sm')]: {
        padding: '20px',
    },
}));

export default TeacherHomePage;