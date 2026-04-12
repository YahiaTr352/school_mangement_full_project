import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

const ErrorPage = () => {
    return (
        <StyledContainer>
            <Content>
                <Heading variant="h1">Oops, something went wrong</Heading>
                <Text variant="body1">
                    We apologize for the inconvenience. Our website is currently experiencing technical difficulties. Please check back later.
                </Text>
            </Content>
        </StyledContainer>
    );
};

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontFamily: '"Josefin Sans", sans-serif',
  color: 'white',
  backgroundImage: "url('https://images.pexels.com/photos/593158/pexels-photo-593158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const Content = styled(Box)(({ theme }) => ({
  maxWidth: '800px',
  padding: '20px',
  textAlign: 'center',
}));

const Heading = styled(Typography)(({ theme }) => ({
  marginBottom: '40px',
  fontSize: '32px',
  fontWeight: 'bold',
  color: 'rgb(77, 9, 9)',
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  lineHeight: 1.5,
}));

export default ErrorPage;