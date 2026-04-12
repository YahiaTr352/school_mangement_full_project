import React, { useEffect } from 'react';
import { Container, Grid, Paper, Box, Typography, Stack } from '@mui/material';
import { 
    PeopleAlt, 
    School, 
    Person, 
    AccountBalanceWallet,
    NotificationsActive 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import SeeNotice from '../../components/SeeNotice';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector(state => state.user);

    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList ? studentsList.length : 0;
    const numberOfClasses = sclassesList ? sclassesList.length : 0;
    const numberOfTeachers = teachersList ? teachersList.length : 0;

    const stats = [
        {
            title: "Total Students",
            value: numberOfStudents,
            icon: <PeopleAlt sx={{ fontSize: 40 }} />,
            color: "#6366F1", // Indigo
            delay: 0.1
        },
        {
            title: "Total Classes",
            value: numberOfClasses,
            icon: <School sx={{ fontSize: 40 }} />,
            color: "#10B981", // Emerald
            delay: 0.2
        },
        {
            title: "Total Teachers",
            value: numberOfTeachers,
            icon: <Person sx={{ fontSize: 40 }} />,
            color: "#F59E0B", // Amber
            delay: 0.3
        },
        {
            title: "Fees Collection",
            value: 23000,
            icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
            color: "#F43F5E", // Rose
            prefix: "$",
            delay: 0.4
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ mb: 5 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 800, 
                            color: '#1E1B4B', 
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            mb: 1
                        }}
                    >
                        Welcome Back, {currentUser.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748B' }}>
                        Here is what's happening at <Box component="span" sx={{ fontWeight: 700, color: '#6366F1' }}>{currentUser.schoolName}</Box> today.
                    </Typography>
                </Box>
            </motion.div>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: stat.delay }}
                        >
                            <StyledStatCard elevation={0}>
                                <IconContainer sx={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                    {stat.icon}
                                </IconContainer>
                                <Box sx={{ textAlign: 'left', mt: 2 }}>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: '#64748B', 
                                            fontWeight: 600, 
                                            textTransform: 'uppercase', 
                                            letterSpacing: '0.05em',
                                            mb: 0.5
                                        }}
                                    >
                                        {stat.title}
                                    </Typography>
                                    <Typography 
                                        variant="h4" 
                                        sx={{ 
                                            fontWeight: 800, 
                                            color: '#1E1B4B',
                                            fontFamily: '"Plus Jakarta Sans", sans-serif'
                                        }}
                                    >
                                        <CountUp 
                                            start={0} 
                                            end={stat.value} 
                                            duration={2.5} 
                                            prefix={stat.prefix || ""} 
                                        />
                                    </Typography>
                                </Box>
                                <TrendIndicator sx={{ color: stat.color }}>
                                    +12% from last month
                                </TrendIndicator>
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
                                <NotificationsActive sx={{ color: '#6366F1' }} />
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        fontWeight: 700, 
                                        color: '#1E1B4B',
                                        fontFamily: '"Plus Jakarta Sans", sans-serif'
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

export default AdminHomePage;

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

const TrendIndicator = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  marginTop: '12px',
  display: 'flex',
  alignItems: 'center',
  opacity: 0.8,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '32px',
  borderRadius: '20px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
}));