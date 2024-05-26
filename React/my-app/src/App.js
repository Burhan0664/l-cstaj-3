import React, { useState, useEffect } from 'react';
import Api from './components/Api';

const App = () => {
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({
        id:'',
        title: '',
        content: '',
        published: false,
    });

    const fetchPosts = async () => {
        try {
            const response = await Api.get('/posts/');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);
    


    const handleInputChange = (event) => {
        const { name, type, checked, value } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!formData.title || !formData.content) {
            console.error('Validation Error: All fields are required');
            return;
        }

        try {
            const postData = {
                title: formData.title,
                content: formData.content,
                published: formData.published,
            };

            const response = await Api.post('/posts/', postData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Form data successfully submitted:', response.data);
            setFormData({
                title: '',
                content: '',
                published: false,
            });
            fetchPosts();
        } catch (error) {
            console.error('Error submitting form data:', error.response ? error.response.data : error.message);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await Api.delete(`/posts/${postId}`);
            console.log('Post deleted successfully');
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error.response ? error.response.data : error.message);
        }
    };

    const handleUpdatePost = async (postId, updatedData) => {
        try {
            const response = await Api.put(`/posts/${postId}`, updatedData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Post updated successfully:', response.data);
            fetchPosts();
        } catch (error) {
            console.error('Error updating post:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div>
            <nav className="navbar navbar-dark bg-primary">
                <div className="container-fluid">
                    Look And Cash
                </div>
            </nav>
            <div className="container">
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-3 mt-3">
                        <label htmlFor="title" className="form-label">
                            Title
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            onChange={handleInputChange}
                            value={formData.title}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="content" className="form-label">
                            Content
                        </label>
                        <textarea
                            className="form-control"
                            id="content"
                            name="content"
                            onChange={handleInputChange}
                            value={formData.content}
                        />
                    </div>
                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="published"
                            name="published"
                            onChange={handleInputChange}
                            checked={formData.published}
                        />
                        <label className="form-check-label" htmlFor="published">
                            Published
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Actions</th> {/* Added column for actions */}
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td>{post.title}</td>
                                <td>{post.content}</td>
                                <td>
                                    {/* Delete button */}
                                    <button className="btn btn-danger" onClick={() => handleDeletePost(post.id)}>Delete</button>
                                    {/* Update button */}
                                    <button className="btn btn-primary" onClick={() => handleUpdatePost(post.id, {/* Updated data */})}>Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default App;