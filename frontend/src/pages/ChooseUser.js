import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop,
  Typography,
} from '@mui/material';
import { AdminPanelSettings, School, Group } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const password = "zxc"

  const { status, currentUser, currentRole } = useSelector(state => state.user);

  const [loader, setLoader] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        const email = "yogendra@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Adminlogin');
      }
    }

    else if (user === "Student") {
      if (visitor === "guest") {
        const rollNum = "1"
        const studentName = "Dipesh Awasthi"
        const fields = { rollNum, studentName, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Studentlogin');
      }
    }

    else if (user === "Teacher") {
      if (visitor === "guest") {
        const email = "tony@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Teacherlogin');
      }
    }
  }

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      }
      else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    }
    else if (status === 'error') {
      setLoader(false)
      setMessage("Network Error")
      setShowPopup(true)
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <StyledRoot>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Typography 
                    variant="h3" 
                    sx={{ 
                        fontWeight: 800, 
                        color: '#1E1B4B', 
                        mb: 2,
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                >
                    Choose Your Role
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: '#64748B', 
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        mx: 'auto'
                    }}
                >
                    Select how you would like to access the platform. Each portal is tailored to your specific needs.
                </Typography>
            </motion.div>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {[
            { 
              role: "Admin", 
              icon: <AdminPanelSettings sx={{ fontSize: 50 }} />, 
              color: "#6366F1", 
              desc: "Manage institution settings, staff, students, and system configurations." 
            },
            { 
              role: "Student", 
              icon: <School sx={{ fontSize: 50 }} />, 
              color: "#10B981", 
              desc: "Access your dashboard, view attendance, check grades, and manage assignments." 
            },
            { 
              role: "Teacher", 
              icon: <Group sx={{ fontSize: 50 }} />, 
              color: "#F59E0B", 
              desc: "Manage classes, track student progress, mark attendance, and upload resources." 
            }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.role}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
              >
                <StyledPaper 
                    elevation={0} 
                    onClick={() => navigateHandler(item.role)}
                    sx={{ borderTop: `6px solid ${item.color}` }}
                >
                  <IconWrapper sx={{ backgroundColor: `${item.color}15`, color: item.color }}>
                    {item.icon}
                  </IconWrapper>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 700, 
                        color: '#1E1B4B', 
                        mb: 1.5,
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {item.role}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                    {item.desc}
                  </Typography>
                  <ActionText sx={{ color: item.color }}>
                    Enter Portal →
                  </ActionText>
                </StyledPaper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backdropFilter: 'blur(4px)' }}
        open={loader}
      >
        <Box sx={{ textAlign: 'center' }}>
            <CircularProgress color="inherit" sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Logging you in...</Typography>
        </Box>
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </StyledRoot>
  );
};

export default ChooseUser;

const StyledRoot = styled('div')(({ theme }) => ({
  backgroundColor: '#F8FAFC',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  padding: '4rem 0',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '40px 30px',
  textAlign: 'center',
  cursor: 'pointer',
  borderRadius: '20px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important',
  transition: 'all 0.3s ease-in-out !important',
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  '&:hover': {
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '90px',
  height: '90px',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
}));

const ActionText = styled(Typography)(({ theme }) => ({
  marginTop: 'auto',
  paddingTop: '24px',
  fontWeight: '700',
  fontSize: '0.9rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  opacity: 0.8,
  transition: 'opacity 0.2s',

  [`${StyledPaper}:hover &`]: {
    opacity: 1,
  },
}));