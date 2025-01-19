import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Box,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Avatar,
    CircularProgress,
    Fab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ArrowUpward } from '@mui/icons-material';

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [newContent, setNewContent] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [message, setMessage] = useState('');
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            alert('Please log in to view your posts');
            navigate('/login');
        } else {
            setLoading(true);
            axios
                .get('https://for-work-7e4bde187a7b.herokuapp.com/api/posts/my', {
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
        }

        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [token, navigate]);

    const handleSavePost = () => {
        if (!token) {
            alert('Please log in to continue.');
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append('content', currentPost ? newContent : message);

        if (newImage) {
            formData.append('media', newImage);
        } else if (currentPost && currentPost.media.length > 0) {
            // Если пост имеет медиа, но пользователь удалил изображение
            formData.append('deleteMedia', true);
        }

        const url = currentPost
            ? `https://for-work-7e4bde187a7b.herokuapp.com/api/posts/${currentPost._id}`
            : 'https://for-work-7e4bde187a7b.herokuapp.com/api/posts';

        const method = currentPost ? 'put' : 'post';

        setLoading(true);
        axios
            .request({
                method,
                url,
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                const newPost = response.data;
                if (currentPost) {
                    setPosts((prevPosts) =>
                        prevPosts.map((post) =>
                            post._id === currentPost._id
                                ? { ...post, content: newContent, media: newPost.media }
                                : post
                        )
                    );
                } else {
                    setPosts((prevPosts) => [newPost, ...prevPosts]);
                }
                setMessage('');
                setNewContent('');
                setNewImage(null);
                setLoading(false);
                handleClose();
            })
            .catch((error) => {
                console.error('Error saving post:', error.response?.data || error.message);
                setLoading(false);
            });
    };


    const handleDeletePost = (postId) => {
        setLoading(true);
        axios
            .delete(`https://for-work-7e4bde187a7b.herokuapp.com/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error deleting post:', error.response?.data || error.message);
                alert(`Error deleting post: ${error.response?.data?.message || error.message}`);
                setLoading(false);
            });
    };

    const handleEditPost = (postId) => {
        const post = posts.find((post) => post._id === postId);
        setCurrentPost(post);
        setNewContent(post.content);
        setNewImage(null);
        setOpen(true);
    };


    const handleClose = () => {
        setOpen(false);
        setCurrentPost(null);
        setMessage('');
        setNewContent('');
        setMedia(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
        }
    };

    const handleDeleteImage = () => {
        if (currentPost) {
            setCurrentPost((prevPost) => ({
                ...prevPost,
                media: []
            }));
        }
        setNewImage(null);
    };


    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setOpenImageDialog(true);
    };

    const handleCloseImageDialog = () => {
        setOpenImageDialog(false);
        setSelectedImage(null);
    };

    return (
        <Container sx={{ maxWidth: 'lg', pt: 5 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                My Posts
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {posts.map((post) => (
                        <Grid item xs={12} sm={6} md={4} key={post._id}>
                            <Card sx={{ borderRadius: '10px', boxShadow: 3, overflow: 'hidden' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {post.content}
                                    </Typography>
                                    {post.media && post.media.length > 0 && (
                                        <Box mt={2}>
                                            {post.media.map((mediaItem, idx) => (
                                                <Box key={idx} mb={1}>
                                                    {mediaItem.type && mediaItem.type.startsWith('image') ? (
                                                        <CardMedia
                                                            component="img"
                                                            image={`https://for-work-7e4bde187a7b.herokuapp.com${mediaItem.fileUrl}`}
                                                            alt="media"
                                                            sx={{
                                                                width: '100%',
                                                                height: 'auto',
                                                                maxWidth: '300px', // Устанавливаем стандартный размер
                                                                cursor: 'pointer',
                                                                borderRadius: '8px',
                                                            }}
                                                            onClick={() => handleImageClick(`https://for-work-7e4bde187a7b.herokuapp.com${mediaItem.fileUrl}`)}
                                                        />
                                                    ) : mediaItem.type && mediaItem.type.startsWith('video') ? (
                                                        <video width="100%" controls>
                                                            <source src={mediaItem.fileUrl} type="video/mp4" />
                                                        </video>
                                                    ) : null}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                    <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                                        <Avatar>{post.authorName[0]}</Avatar>
                                        <Box>
                                            <Typography variant="body2" color="textSecondary">
                                                {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </Typography>
                                            <Box mt={1}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleEditPost(post._id)}
                                                    sx={{ fontSize: '14px', textTransform: 'none', marginRight: 1 }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleDeletePost(post._id)}
                                                    sx={{ fontSize: '14px', textTransform: 'none' }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                    Delete
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {showScrollButton && (
                <Fab
                    color="primary"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        zIndex: 10,
                    }}
                    onClick={scrollToTop}
                >
                    <ArrowUpward />
                </Fab>
            )}

            <Dialog open={openImageDialog} onClose={handleCloseImageDialog}>
                <DialogTitle>Image Preview</DialogTitle>
                <DialogContent>
                    <Box sx={{ textAlign: 'center' }}>
                        <img src={selectedImage} alt="preview" style={{ maxWidth: '100%', height: 'auto' }} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseImageDialog} color="primary" sx={{ fontWeight: 'bold' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentPost ? 'Edit Post' : 'Create Post'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Content"
                        fullWidth
                        multiline
                        value={currentPost ? newContent : message}
                        onChange={(e) => (currentPost ? setNewContent(e.target.value) : setMessage(e.target.value))}
                        rows={4}
                        sx={{ mb: 2 }}
                    />

                    {currentPost && currentPost.media && currentPost.media.length > 0 && currentPost.media[0].type.startsWith('image') && (
                        <Box mt={2} display="flex" alignItems="center">
                            <img
                                src={`https://for-work-7e4bde187a7b.herokuapp.com${currentPost.media[0].fileUrl}`}
                                alt="current post"
                                width="100px"
                                height="100px"
                                style={{ marginRight: 10 }}
                            />
                            <IconButton onClick={handleDeleteImage} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    )}

                    {/* Если пост не имеет изображения */}
                    {(!currentPost || !currentPost.media || currentPost.media.length === 0) && !newImage && (
                        <Box mt={2}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="upload-image"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="upload-image">
                                <Button variant="contained" color="primary" component="span" sx={{ textTransform: 'none' }}>
                                    Add Image
                                </Button>
                            </label>
                        </Box>
                    )}

                    {newImage && (
                        <Box mt={2} display="flex" alignItems="center">
                            <img
                                src={URL.createObjectURL(newImage)}
                                alt="preview"
                                width="100px"
                                height="100px"
                                style={{ marginRight: 10 }}
                            />
                            <IconButton onClick={handleDeleteImage} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" sx={{ fontWeight: 'bold' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSavePost} color="primary" sx={{ fontWeight: 'bold' }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>


        </Container>
    );
};

export default MyPosts;
