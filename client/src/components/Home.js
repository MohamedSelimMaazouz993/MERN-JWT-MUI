import React from 'react';
import { Box, Typography,  Container } from '@mui/material';
const Home = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 4,
      }}
    >
      <Container maxWidth='md'>
        <Typography
          variant='h2'
          component='h1'
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          Welcome !
        </Typography>
        <Typography
          variant='h5'
          component='p'
          gutterBottom
          sx={{ color: 'text.secondary' }}
        >
          Its A Progressive Web App built with React and Material-UI 🔥 .
        </Typography>
        <Typography
          variant='body1'
          component='p'
          sx={{ color: 'text.secondary', mb: 4 }}
        >
          Explore the features and enjoy a seamless experience.
        </Typography>
      </Container>
    </Box>
  );
};

export default Home;
