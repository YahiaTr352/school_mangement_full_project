import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography, Container, Paper, Stack, IconButton } from '@mui/material'
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate } from 'react-router-dom';
import { PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TouchAppIcon from '@mui/icons-material/TouchApp';

const ChooseClass = ({ situation }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error)
    }

    const navigateHandler = (classID) => {
        if (situation === "Teacher") {
            navigate("/Admin/teachers/choosesubject/" + classID)
        }
        else if (situation === "Subject") {
            navigate("/Admin/addsubject/" + classID)
        }
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
        return (
            <Stack direction="row" spacing={1} justifyContent="center">
                <PurpleButton 
                    variant="contained"
                    startIcon={<TouchAppIcon />}
                    onClick={() => navigateHandler(row.id)}
                    sx={{ 
                        borderRadius: '10px', 
                        textTransform: 'none', 
                        fontWeight: 600,
                        backgroundColor: '#6366F1',
                        '&:hover': { backgroundColor: '#4F46E5' }
                    }}
                >
                    Choose
                </PurpleButton>
            </Stack>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <Typography variant="h6" sx={{ color: '#64748B' }}>Loading classes...</Typography>
                </Box>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <IconButton onClick={() => navigate(-1)} sx={{ color: '#6366F1' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Box>
                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                                    <SchoolIcon sx={{ color: '#6366F1', fontSize: 30 }} />
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                        Select a Class
                                    </Typography>
                                </Stack>
                                <Typography variant="body1" sx={{ color: '#64748B' }}>
                                    {situation === "Teacher" ? "Select a class to assign a teacher" : "Select a class to add new subjects"}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    {getresponse ? (
                        <StyledPaper elevation={0} sx={{ textAlign: 'center', py: 10 }}>
                            <Typography variant="h6" sx={{ color: '#64748B', mb: 3 }}>
                                No classes found. You need to create a class first.
                            </Typography>
                            <Button 
                                variant="contained" 
                                onClick={() => navigate("/Admin/addclass")}
                                sx={{ 
                                    backgroundColor: '#6366F1', 
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    padding: '10px 24px',
                                    fontWeight: 700
                                }}
                            >
                                Add Class
                            </Button>
                        </StyledPaper>
                    ) : (
                        <StyledPaper elevation={0}>
                            {Array.isArray(sclassesList) && sclassesList.length > 0 && (
                                <TableTemplate buttonHaver={SclassButtonHaver} columns={sclassColumns} rows={sclassRows} />
                            )}
                        </StyledPaper>
                    )}
                </motion.div>
            )}
        </Container>
    )
}

export default ChooseClass

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '32px',
  borderRadius: '24px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
}));