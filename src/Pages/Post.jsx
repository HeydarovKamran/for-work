import React, { useEffect, useState } from 'react';
import {
    Container,
    Button,
    Typography,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Input,
    Paper,
    CircularProgress,
} from '@mui/material';
import { AddCircle, KeyboardArrowUp } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostPage() {
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios
            .get('https://for-work-7e4bde187a7b.herokuapp.com/api/posts', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setPosts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
                setLoading(false);
            });

        const handleScroll = () => {
            if (window.scrollY > 200) {
                setScrolling(true);
            } else {
                setScrolling(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [token]);

    const handleCreatePost = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setMessage('');
        setMedia(null);
    };

    const handleSavePost = () => {
        if (!token) {
            alert('Please log in to continue.');
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append('content', message);
        if (media && media.length > 0) {
            Array.from(media).forEach((file) => {
                formData.append('media', file);
            });
        }

        if (message.trim() || (media && media.length > 0)) {
            setLoading(true);
            axios
                .post('https://for-work-7e4bde187a7b.herokuapp.com/api/posts', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    const newPost = response.data;
                    setPosts((prevPosts) => [newPost, ...prevPosts]);
                    setMessage('');
                    setMedia(null);
                    setLoading(false);
                    handleClose();
                })
                .catch((error) => {
                    console.error('Error creating post:', error.response?.data || error.message);
                    setLoading(false);
                });
        } else {
            alert('Post must contain either text or media.');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setOpenImage(true);
    };

    const handleCloseImage = () => {
        setOpenImage(false);
        setSelectedImage(null);
    };

    return (
        <Container sx={{ maxWidth: 'lg', pt: 5 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Posts
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={handleCreatePost}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50px',
                    padding: '10px 20px',
                    boxShadow: 3,
                    textTransform: 'none',
                    fontSize: '16px',
                    marginBottom: 3,
                    '&:hover': {
                        backgroundColor: '#1976d2',
                    },
                }}
            >
                <AddCircle sx={{ mr: 1 }} />
                Create Post
            </Button>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '300px' }}>
                    <CircularProgress />
                </Box>
            ) : (
                posts
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((post, index) => (
                        <Paper key={post._id || index} sx={{ mb: 2, p: 3, borderRadius: 2, boxShadow: 2, '&:hover': { boxShadow: 6 } }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                {post.content}
                            </Typography>

                            {post.media && post.media.length > 0 && (
                                <Box mt={2}>
                                    {post.media.map((mediaItem, idx) => (
                                        <Box key={idx} mb={2}>
                                            {mediaItem.type && mediaItem.type.startsWith('image') ? (
                                                <img
                                                    src={`https://for-work-7e4bde187a7b.herokuapp.com${mediaItem.fileUrl}`}
                                                    alt="media"
                                                    style={{
                                                        borderRadius: '8px',
                                                        objectFit: 'cover',
                                                        maxHeight: '250px', 
                                                        maxWidth:'300px',
                                                        width: '100%',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => handleImageClick(`https://for-work-7e4bde187a7b.herokuapp.com${mediaItem.fileUrl}`)}
                                                />
                                            ) : mediaItem.type && mediaItem.type.startsWith('video') ? (
                                                <video width="100%" height="auto" controls style={{ borderRadius: '8px' }}>
                                                    <source src={mediaItem.fileUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : null}
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            <Typography variant="body2" sx={{ color: '#888', textAlign: 'right' }}> {/* Выравнивание текста вправо */}
                                {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })} в {new Date(post.createdAt).toLocaleTimeString('ru-RU', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Typography>


                            <Typography variant="body2" sx={{ color: '#666' }}>
                                By: {post.authorName}
                            </Typography>

                        </Paper>
                    ))
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Create Post</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Message"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                        variant="outlined"
                    />
                    <Input
                        type="file"
                        onChange={(e) => setMedia(e.target.files)}
                        fullWidth
                        sx={{
                            mb: 2,
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '8px',
                            backgroundColor: '#f9f9f9',
                            '&:hover': {
                                backgroundColor: '#e6e6e6',
                            },
                            '& input': {
                                padding: '10px',
                                fontSize: '16px',
                            },
                            '& input[type="file"]': {
                                color: '#000',
                                fontSize: '16px',
                            },
                        }}
                        multiple
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSavePost} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openImage} onClose={handleCloseImage} maxWidth="lg">
                <DialogTitle>Image Preview</DialogTitle>
                <DialogContent>
                    <img
                        src={selectedImage}
                        alt="Selected"
                        style={{
                            width: '100%',
                            height: '70vh',
                            objectFit:'cover',
                            borderRadius: '8px',
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseImage} color="secondary" variant="outlined">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {scrolling && (
                <Button
                    onClick={scrollToTop}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        height:'60px',
                        backgroundColor: 'primary.main',
                        borderRadius: '50%',
                        boxShadow: 3,
                        zIndex: 1000,
                        '&:hover': {
                            backgroundColor: '#1976d2',
                        },
                    }}
                >
                    <KeyboardArrowUp sx={{ color: '#fff' }} />
                </Button>
            )}
        </Container>
    );
}

export default PostPage;
