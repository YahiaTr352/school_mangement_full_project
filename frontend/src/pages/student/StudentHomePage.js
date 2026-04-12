import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Box, Typography, Stack } from '@mui/material';
import { 
    MenuBook, 
    Assignment, 
    AssignmentTurnedIn,
    NotificationsActive,
    TrendingUp
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import SeeNotice from '../../components/SeeNotice';

const StudentHomePage = () => {
    const dispatch = useDispatch();
    const { userDetails, currentUser, loading, response } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const classID = currentUser.sclassName._id;

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
    }, [dispatch, currentUser._id, classID]);

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const numberOfSubjects = subjectsList ? subjectsList.length : 0;
    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const stats = [
        {
            title: "Total Subjects",
            value: numberOfSubjects,
            icon: <MenuBook sx={{ fontSize: 40 }} />,
            color: "#6366F1", // Indigo
            delay: 0.1
        },
        {
            title: "Total Assignments",
            value: 15, // Static for now
            icon: <Assignment sx={{ fontSize: 40 }} />,
            color: "#10B981", // Emerald
            delay: 0.2
        },
        {
            title: "Overall Attendance",
            value: overallAttendancePercentage,
            icon: <AssignmentTurnedIn sx={{ fontSize: 40 }} />,
            color: "#F59E0B", // Amber
            suffix: "%",
            delay: 0.3
        },
        {
            title: "Academic Rank",
            value: 12, // Static for now
            icon: <TrendingUp sx={{ fontSize: 40 }} />,
            color: "#F43F5E", // Rose
            prefix: "#",
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
                        Hello, {currentUser.name}! 👋
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748B' }}>
                        Welcome to your dashboard at <Box component="span" sx={{ fontWeight: 700, color: '#6366F1' }}>{currentUser.schoolName}</Box>.
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
                                            suffix={stat.suffix || ""}
                                            decimals={stat.suffix === "%" ? 1 : 0}
                                        />
                                    </Typography>
                                </Box>
                            </StyledStatCard>
                        </motion.div>
                    </Grid>
                ))}

                <Grid item xs={12} md={4}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <StyledPaper elevation={0}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 3 }}>
                                Attendance Distribution
                            </Typography>
                            <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {loading ? (
                                    <Typography color="textSecondary">Loading chart...</Typography>
                                ) : response ? (
                                    <Typography color="textSecondary">No data found</Typography>
                                ) : (
                                    <CustomPieChart data={chartData} />
                                )}
                            </Box>
                        </StyledPaper>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
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
                                    Latest Announcements
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

export default StudentHomePage;

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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '32px',
  borderRadius: '20px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
  height: '100%',
}));