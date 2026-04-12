import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices } from '../redux/noticeRelated/noticeHandle';
import { 
    Box, Typography, Card, CardContent, Divider, Stack, 
    Skeleton, Grid 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AnnouncementIcon from '@mui/icons-material/Announcement';

const SeeNotice = () => {
    const dispatch = useDispatch();

    const { currentUser, currentRole } = useSelector(state => state.user);
    const { noticesList, loading, response } = useSelector((state) => state.notice);

    useEffect(() => {
        if (currentRole === "Admin") {
            dispatch(getAllNotices(currentUser._id, "Notice"));
        } else {
            const schoolID = currentUser.school?._id || currentUser._id;
            dispatch(getAllNotices(schoolID, "Notice"));
        }
    }, [dispatch, currentRole, currentUser]);

    if (loading) {
        return (
            <Stack spacing={2}>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: '16px' }} />
                ))}
            </Stack>
        );
    }

    if (response || !Array.isArray(noticesList) || noticesList.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 5, bgcolor: '#F8FAFC', borderRadius: '16px', border: '2px dashed #E2E8F0' }}>
                <AnnouncementIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
                <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 500 }}>
                    No notices have been posted yet.
                </Typography>
            </Box>
        );
    }

    // Sort notices by date (newest first)
    const sortedNotices = [...noticesList].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <Grid container spacing={2}>
            {sortedNotices.map((notice, index) => {
                const date = new Date(notice.date);
                const dateString = date.toString() !== "Invalid Date" ? date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }) : "N/A";

                return (
                    <Grid item xs={12} key={notice._id}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <StyledNoticeCard elevation={0}>
                                <CardContent sx={{ p: '20px !important' }}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <DateBadge>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#6366F1', textTransform: 'uppercase' }}>
                                                {date.toLocaleDateString('en-US', { month: 'short' })}
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E1B4B', lineHeight: 1 }}>
                                                {date.getDate()}
                                            </Typography>
                                        </DateBadge>
                                        
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 0.5 }}>
                                                {notice.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6, mb: 1.5 }}>
                                                {notice.details}
                                            </Typography>
                                            <Divider sx={{ borderStyle: 'dashed', mb: 1.5 }} />
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <CalendarMonthIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                                                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                                                    Posted on {dateString}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </StyledNoticeCard>
                        </motion.div>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default SeeNotice;

const StyledNoticeCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #F1F5F9',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateX(5px)',
        borderColor: '#E2E8F0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    },
}));

const DateBadge = styled(Box)(({ theme }) => ({
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    backgroundColor: '#EEF2FF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
}));