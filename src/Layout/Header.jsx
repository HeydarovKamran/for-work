import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu'; 

const Header = () => {
    const [user, setUser] = useState(localStorage.getItem('token')); 
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setUser(token);
    }, [localStorage.getItem('token')]); 

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        setUser(null);
        navigate('/'); 
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6">
                            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                                Home
                            </Link>
                        </Typography>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        <Button color="inherit" component={Link} to="/" sx={{ marginRight: 2 }}>
                            All Posts
                        </Button>
                        <Button color="inherit" component={Link} to="/mypost" sx={{ marginRight: 2 }}>
                            My Posts
                        </Button>
                        {user ? (
                            <Button color="inherit" onClick={handleLogout}>
                                Exit
                            </Button>
                        ) : (
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                        )}
                    </Box>
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <IconButton color="inherit" onClick={handleMenuClick}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                                All Posts
                            </MenuItem>
                            <MenuItem component={Link} to="/mypost" onClick={handleMenuClose}>
                                My Posts
                            </MenuItem>
                            {user ? (
                                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                                    Exit
                                </MenuItem>
                            ) : (
                                <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                                    Login
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
