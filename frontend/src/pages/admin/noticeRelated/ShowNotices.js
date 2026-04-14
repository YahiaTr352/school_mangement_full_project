import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    Box, IconButton, Typography, Container, Stack, Tooltip, Grid, Card, CardContent, CardActions, Divider, CircularProgress
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { BlueButton, DarkRedButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderColor: '#94a3b8',
    },
}));

const DateBadge = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#f1f5f9',
    padding: '4px 12px',
    borderRadius: '20px',
    color: '#475569',
    fontSize: '0.875rem',
    fontWeight: 500,
}));

const ShowNotices = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        if (address === "Notices") {
            if (window.confirm("Are you sure you want to delete all notices? This action cannot be undone.")) {
                dispatch(deleteUser(deleteID, address))
                    .then(() => {
                        dispatch(getAllNotices(currentUser._id, "Notice"));
                    })
            }
        } else {
            if (window.confirm("Delete this notice?")) {
                dispatch(deleteUser(deleteID, address))
                    .then(() => {
                        dispatch(getAllNotices(currentUser._id, "Notice"));
                    })
            }
        }
    }

    const actions = [
        {
            icon: <NoteAddIcon color="primary" />, name: 'Add New Notice',
            action: () => navigate("/Admin/addnotice")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Notices',
            action: () => deleteHandler(currentUser._id, "Notices")
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress sx={{ color: '#6366F1' }} />
                </Box>
            ) : (
                <>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'flex-start', sm: 'center' }, 
                        mb: { xs: 3, sm: 5 },
                        gap: 2
                    }}>
                        <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
                            <Box sx={{ 
                                backgroundColor: '#4338CA', 
                                p: { xs: 1, sm: 1.5 }, 
                                borderRadius: '12px',
                                display: 'flex',
                                color: 'white'
                            }}>
                                <AssignmentIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />
                            </Box>
                            <Box>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        color: '#1e293b', 
                                        letterSpacing: '-0.02em',
                                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                                    }}
                                >
                                    Notice Board
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                    Manage and broadcast announcements to the school
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                            <BlueButton 
                                variant="contained" 
                                startIcon={<PostAddIcon />}
                                onClick={() => navigate("/Admin/addnotice")}
                                sx={{ 
                                    borderRadius: '10px', 
                                    px: { xs: 2, sm: 3 }, 
                                    py: { xs: 1, sm: 1.2 }, 
                                    textTransform: 'none', 
                                    fontWeight: 600,
                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                    flex: { xs: 1, sm: 'none' }
                                }}
                            >
                                Add Notice
                            </BlueButton>
                            {Array.isArray(noticesList) && noticesList.length > 0 && (
                                <DarkRedButton 
                                    variant="contained" 
                                    startIcon={<DeleteIcon />}
                                    onClick={() => deleteHandler(currentUser._id, "Notices")}
                                    sx={{ 
                                        borderRadius: '10px', 
                                        px: { xs: 2, sm: 3 }, 
                                        py: { xs: 1, sm: 1.2 }, 
                                        textTransform: 'none', 
                                        fontWeight: 600,
                                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                        flex: { xs: 1, sm: 'none' }
                                    }}
                                >
                                    Clear All
                                </DarkRedButton>
                            )}
                        </Stack>
                    </Box>

                    {response || !Array.isArray(noticesList) || noticesList.length === 0 ? (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mt: { xs: 4, sm: 8 },
                            p: { xs: 3, sm: 6 },
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            border: '2px dashed #e2e8f0'
                        }}>
                            <AssignmentIcon sx={{ fontSize: { xs: 50, sm: 80 }, color: '#cbd5e1', mb: 2 }} />
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#64748b', fontSize: { xs: '1.1rem', sm: '1.5rem' } }} gutterBottom>
                                No notices yet
                            </Typography>
                            <Typography variant="body1" color="textSecondary" align="center" sx={{ maxWidth: 400, mb: 3, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                Broadcast important information, holidays, or events to everyone in the school.
                            </Typography>
                            <BlueButton 
                                variant="contained" 
                                onClick={() => navigate("/Admin/addnotice")}
                                sx={{ borderRadius: '10px', px: { xs: 3, sm: 4 }, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                            >
                                Create First Notice
                            </BlueButton>
                        </Box>
                    ) : (
                        <Grid container spacing={{ xs: 2, sm: 3 }}>
                            {noticesList.map((notice) => {
                                const date = new Date(notice.date);
                                const dateString = date.toString() !== "Invalid Date" ? date.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : "Invalid Date";

                                return (
                                    <Grid item xs={12} sm={6} md={4} key={notice._id}>
                                        <StyledCard>
                                            <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                                                <Typography variant="h6" sx={{ 
                                                    fontWeight: 700, 
                                                    color: '#1e293b', 
                                                    mb: 1,
                                                    lineHeight: 1.3,
                                                    fontSize: { xs: '1rem', sm: '1.25rem' },
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {notice.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{ 
                                                    color: '#475569',
                                                    lineHeight: 1.6,
                                                    mb: 1,
                                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 4,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {notice.details}
                                                </Typography>
                                            </CardContent>
                                            <Divider sx={{ borderStyle: 'dashed' }} />
                                            <CardActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 }, justifyContent: 'space-between', backgroundColor: '#fcfcfd' }}>
                                                <DateBadge sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' }, py: 0.5, px: 1.5 }}>
                                                    <CalendarMonthIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                                                    {dateString}
                                                </DateBadge>
                                                <Tooltip title="Delete Notice">
                                                    <IconButton 
                                                        onClick={() => deleteHandler(notice._id, "Notice")} 
                                                        size="small"
                                                        sx={{ 
                                                            color: '#ef4444',
                                                            backgroundColor: '#fee2e2',
                                                            '&:hover': { backgroundColor: '#fecaca' },
                                                            p: { xs: 0.5, sm: 1 }
                                                        }}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </CardActions>
                                        </StyledCard>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                    <SpeedDialTemplate actions={actions} />
                </>
            )}
        </Container>
    );
};

export default ShowNotices;