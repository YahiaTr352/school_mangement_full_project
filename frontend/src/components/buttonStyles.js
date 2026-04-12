import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

export const RedButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#f00',
    color: 'white',
    marginLeft: '4px',
    '&:hover': {
        backgroundColor: '#eb7979',
        borderColor: '#f26767',
        boxShadow: 'none',
    },
}));

export const BlackButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#000000',
    color: 'white',
    marginLeft: '4px',
    '&:hover': {
        backgroundColor: '#212020',
        borderColor: '#212020',
        boxShadow: 'none',
    },
}));

export const DarkRedButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#650909',
    color: 'white',
    '&:hover': {
        backgroundColor: '#eb7979',
        borderColor: '#f26767',
        boxShadow: 'none',
    },
}));

export const BlueButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#080a43',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#0a1e82',
    },
}));

export const PurpleButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#270843',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#3f1068',
    },
}));

export const LightPurpleButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#7f56da',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#7a1ccb',
    },
}));

export const GreenButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#133104',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#266810',
    },
}));

export const BrownButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#2c1006',
    color: 'white',
    '&:hover': {
        backgroundColor: '#40220c',
        borderColor: '#40220c',
        boxShadow: 'none',
    },
}));

export const IndigoButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#2f2b80',
    color: 'white',
    '&:hover': {
        backgroundColor: '#534ea6',
        borderColor: '#473d90',
        boxShadow: 'none',
    },
}));
