import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { 
    Box, Table, TableBody, TableContainer, TableHead, Typography, 
    Paper, Container, Stack, IconButton, Button, CircularProgress 
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom';
import { getTeacherFreeClassSubjects } from '../../../redux/sclassRelated/sclassHandle';
import { updateTeachSubject } from '../../../redux/teacherRelated/teacherHandle';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PostAddIcon from '@mui/icons-material/PostAdd';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

const ChooseSubject = ({ situation }) => {
    const params = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [classID, setClassID] = useState("");
    const [teacherID, setTeacherID] = useState("");
    const [loader, setLoader] = useState(false)

    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);

    const paramID = params.id;
    const paramClassID = params.classID;
    const paramTeacherID = params.teacherID;

    useEffect(() => {
        if (situation === "Norm" && paramID) {
            setClassID(paramID);
            dispatch(getTeacherFreeClassSubjects(paramID));
        }
        else if (situation === "Teacher" && paramClassID && paramTeacherID) {
            setClassID(paramClassID);
            setTeacherID(paramTeacherID);
            dispatch(getTeacherFreeClassSubjects(paramClassID));
        }
    }, [situation, paramID, paramClassID, paramTeacherID, dispatch]);

    if (error) {
        console.log(error)
    }

    const updateSubjectHandler = (teacherId, teachSubject) => {
        setLoader(true)
        dispatch(updateTeachSubject(teacherId, teachSubject))
        navigate("/Admin/teachers")
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <IconButton onClick={() => navigate(-1)} sx={{ color: '#6366F1' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Box>
                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                                    <LibraryBooksIcon sx={{ color: '#6366F1', fontSize: 30 }} />
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1B4B', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                        Choose a Subject
                                    </Typography>
                                </Stack>
                                <Typography variant="body1" sx={{ color: '#64748B' }}>
                                    Select an available subject to assign to the teacher
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    {response ? (
                        <StyledPaper elevation={0} sx={{ textAlign: 'center', py: 10 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 2 }}>
                                All subjects have teachers assigned already
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>
                                You need to create new subjects for this class first.
                            </Typography>
                            <Button 
                                variant="contained"
                                startIcon={<PostAddIcon />}
                                onClick={() => navigate("/Admin/addsubject/" + classID)}
                                sx={{ 
                                    backgroundColor: '#6366F1', 
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    padding: '12px 24px',
                                    fontWeight: 700
                                }}
                            >
                                Add New Subjects
                            </Button>
                        </StyledPaper>
                    ) : (
                        <StyledPaper elevation={0}>
                            <TableContainer>
                                <Table aria-label="subjects table">
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell align="center" style={{ fontWeight: 700 }}>#</StyledTableCell>
                                            <StyledTableCell align="center" style={{ fontWeight: 700 }}>Subject Name</StyledTableCell>
                                            <StyledTableCell align="center" style={{ fontWeight: 700 }}>Subject Code</StyledTableCell>
                                            <StyledTableCell align="center" style={{ fontWeight: 700 }}>Actions</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(subjectsList) && subjectsList.length > 0 && subjectsList.map((subject, index) => (
                                            <StyledTableRow key={subject._id}>
                                                <StyledTableCell align="center">
                                                    {index + 1}
                                                </StyledTableCell>
                                                <StyledTableCell align="center" sx={{ fontWeight: 600 }}>
                                                    {subject.subName}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Typography variant="body2" sx={{ color: '#64748B', bgcolor: '#F1F5F9', px: 1.5, py: 0.5, borderRadius: '6px', display: 'inline-block' }}>
                                                        {subject.subCode}
                                                    </Typography>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {situation === "Norm" ? (
                                                        <Button 
                                                            variant="contained"
                                                            startIcon={<TouchAppIcon />}
                                                            onClick={() => navigate("/Admin/teachers/addteacher/" + subject._id)}
                                                            sx={{ 
                                                                backgroundColor: '#6366F1', 
                                                                borderRadius: '10px', 
                                                                textTransform: 'none',
                                                                '&:hover': { backgroundColor: '#4F46E5' }
                                                            }}
                                                        >
                                                            Select
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            variant="contained" 
                                                            disabled={loader}
                                                            startIcon={loader ? <CircularProgress size={20} color="inherit" /> : <TouchAppIcon />}
                                                            onClick={() => updateSubjectHandler(teacherID, subject._id)}
                                                            sx={{ 
                                                                backgroundColor: '#10B981', 
                                                                borderRadius: '10px', 
                                                                textTransform: 'none',
                                                                '&:hover': { backgroundColor: '#059669' }
                                                            }}
                                                        >
                                                            {loader ? 'Assigning...' : 'Assign Subject'}
                                                        </Button>
                                                    )}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </StyledPaper>
                    )}
                </motion.div>
            )}
        </Container>
    );
};

export default ChooseSubject;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '32px',
  borderRadius: '24px !important',
  backgroundColor: '#FFFFFF !important',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important',
  border: '1px solid #F1F5F9 !important',
  overflow: 'hidden'
}));