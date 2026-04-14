import { useEffect, useState } from 'react';
import { IconButton, Box, Menu, MenuItem, ListItemIcon, Tooltip, Container, Paper, Typography, Button, Stack, CircularProgress } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import TableTemplate from '../../../components/TableTemplate';

import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SchoolIcon from '@mui/icons-material/School';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowClasses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user)

  const adminID = currentUser._id

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address))
      .then(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
      })
  }

  const sclassColumns = [
    { id: 'name', label: 'Class Name', minWidth: 170 },
  ]

  const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
    return {
      name: sclass.sclassName,
      id: sclass._id,
    };
  })

  const SclassButtonHaver = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
        <Tooltip title="View Details">
            <IconButton 
                onClick={() => navigate("/Admin/classes/class/" + row.id)}
                sx={{ color: '#6366F1', '&:hover': { backgroundColor: '#F5F3FF' } }}
            >
                <VisibilityIcon />
            </IconButton>
        </Tooltip>
        
        <Tooltip title="Delete">
            <IconButton 
                onClick={() => deleteHandler(row.id, "Sclass")}
                sx={{ color: '#F43F5E', '&:hover': { backgroundColor: '#FFF1F2' } }}
            >
                <DeleteIcon />
            </IconButton>
        </Tooltip>

        <Tooltip title="More Actions">
            <IconButton onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: styles.styledPaperMenu,
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => { handleClose(); navigate("/Admin/addsubject/" + row.id); }}>
            <ListItemIcon><PostAddIcon fontSize="small" /></ListItemIcon>
            Add Subjects
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); navigate("/Admin/class/addstudents/" + row.id); }}>
            <ListItemIcon><PersonAddAlt1Icon fontSize="small" /></ListItemIcon>
            Add Student
          </MenuItem>
        </Menu>
      </Stack>
    );
  };

  const actions = [
    {
      icon: <AddCardIcon color="primary" />, name: 'Add New Class',
      action: () => navigate("/Admin/addclass")
    },
    {
      icon: <DeleteIcon color="error" />, name: 'Delete All Classes',
      action: () => deleteHandler(adminID, "Sclasses")
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
            mb: 4, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
        }}>
          <Box>
            <Typography variant="h4" sx={{ 
                fontWeight: 800, 
                color: '#1E1B4B', 
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}>
              Classes Overview
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Manage and organize all your school's classes in one place.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate("/Admin/addclass")}
            sx={{ 
                borderRadius: '10px', 
                backgroundColor: '#6366F1', 
                textTransform: 'none', 
                fontWeight: 700,
                py: { xs: 1, sm: 1.5 }, 
                px: { xs: 2, sm: 3 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                width: { xs: '100%', sm: 'auto' },
                boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)',
                '&:hover': { backgroundColor: '#4F46E5' }
            }}
          >
            Create New Class
          </Button>
        </Box>
      </motion.div>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#6366F1' }} />
        </Box>
      ) : (
        <>
          {getresponse ? (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Paper sx={{ p: 10, textAlign: 'center', borderRadius: '24px', border: '2px dashed #E2E8F0', backgroundColor: '#F8FAFC' }} elevation={0}>
                    <IconWrapper>
                        <SchoolIcon sx={{ fontSize: 60, color: '#94A3B8' }} />
                    </IconWrapper>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 1 }}>No Classes Found</Typography>
                    <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>It looks like you haven't added any classes yet.</Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate("/Admin/addclass")}
                        sx={{ backgroundColor: '#6366F1', borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
                    >
                        Get Started - Add Your First Class
                    </Button>
                </Paper>
            </motion.div>
          ) : (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <StyledTableContainer elevation={0}>
                    {Array.isArray(sclassesList) && sclassesList.length > 0 &&
                        <TableTemplate buttonHaver={SclassButtonHaver} columns={sclassColumns} rows={sclassRows} />
                    }
                </StyledTableContainer>
            </motion.div>
          )}
          <SpeedDialTemplate actions={actions} />
        </>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  );
};

export default ShowClasses;

const styles = {
  styledPaperMenu: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))',
    mt: 1.5,
    borderRadius: '12px',
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  }
}

const StyledTableContainer = styled(Paper)(({ theme }) => ({
  borderRadius: '20px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
  overflow: 'hidden',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '120px',
  height: '120px',
  backgroundColor: '#FFFFFF',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
}));