import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    Paper, Box, IconButton, Container, Typography, Stack, Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import { motion } from 'framer-motion';

const ShowSubjects = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getSubjectList(currentUser._id, "AllSubjects"));
            })
    }

    const subjectColumns = [
        { id: 'subName', label: 'Subject Name', minWidth: 170 },
        { id: 'sessions', label: 'Sessions', minWidth: 100 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ]

    const subjectRows = subjectsList.map((subject) => {
        return {
            subName: subject.subName,
            sessions: subject.sessions,
            sclassName: subject.sclassName.sclassName,
            sclassID: subject.sclassName._id,
            id: subject._id,
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <Stack direction="row" spacing={1} justifyContent="center">
                <IconButton 
                    onClick={() => deleteHandler(row.id, "Subject")}
                    sx={{ color: '#EF4444', '&:hover': { backgroundColor: '#FEE2E2' } }}
                >
                    <DeleteIcon />
                </IconButton>
                <BlueButton 
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                >
                    View
                </BlueButton>
            </Stack>
        );
    };

    const actions = [
        {
            icon: <PostAddIcon />, name: 'Add New Subject',
            action: () => navigate("/Admin/subjects/chooseclass")
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <Typography variant="h6" sx={{ color: '#64748B' }}>Loading subjects...</Typography>
                </Box>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                                <LibraryBooksIcon sx={{ color: '#6366F1', fontSize: 32 }} />
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        color: '#1E1B4B', 
                                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                                    }}
                                >
                                    Subjects List
                                </Typography>
                            </Stack>
                            <Typography variant="body1" sx={{ color: '#64748B' }}>
                                Manage and view all subjects offered in <Box component="span" sx={{ fontWeight: 700, color: '#6366F1' }}>{currentUser.schoolName}</Box>
                            </Typography>
                        </Box>
                        
                        <Button
                            variant="contained"
                            startIcon={<PostAddIcon />}
                            onClick={() => navigate("/Admin/subjects/chooseclass")}
                            sx={{
                                backgroundColor: '#6366F1',
                                '&:hover': { backgroundColor: '#4F46E5' },
                                borderRadius: '12px',
                                padding: '10px 24px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)'
                            }}
                        >
                            Add Subjects
                        </Button>
                    </Stack>

                    {response ? (
                        <StyledPaper elevation={0} sx={{ textAlign: 'center', py: 10 }}>
                            <Typography variant="h6" sx={{ color: '#64748B', mb: 2 }}>
                                No subjects found.
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/Admin/subjects/chooseclass")}
                                sx={{ borderRadius: '10px', textTransform: 'none' }}
                            >
                                Get Started by Adding a Subject
                            </Button>
                        </StyledPaper>
                    ) : (
                        <StyledPaper elevation={0}>
                            {Array.isArray(subjectsList) && subjectsList.length > 0 && (
                                <TableTemplate 
                                    buttonHaver={SubjectsButtonHaver} 
                                    columns={subjectColumns} 
                                    rows={subjectRows} 
                                />
                            )}
                            <SpeedDialTemplate actions={actions} />
                        </StyledPaper>
                    )}
                </motion.div>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default ShowSubjects;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: '20px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
}));