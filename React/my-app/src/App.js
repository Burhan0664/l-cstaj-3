import React, { useState, useEffect } from 'react';
import Api from './components/Api';

const App = () => {
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        published: false,
        created_at: ''
    });

    const fetchTransactions = async () => {
        try {
            const response = await Api.get('/posts/');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
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

        // Basit doğrulama kontrolü
        if (!formData.title || !formData.content || !formData.created_at) {
            console.error('Doğrulama Hatası: Tüm alanlar doldurulmalıdır');
            return;
        }

        try {
            console.log('Form verisi gönderiliyor:', formData); // Göndermeden önce form verisini kaydet
          
            // formData'yı JSON formatına çevir
            const postData = {
                title: formData.title,
                content: formData.content,
                created_at: formData.created_at
            };
          
            // PostgreSQL'nin kabul edebileceği JSON formatına dönüştür
            const postgresData = {
                data: JSON.stringify(postData)
            };
          
            const response = await Api.post('http://localhost:8000/posts/', postgresData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
          
            console.log('Form verisi başarıyla gönderildi:', response.data); // Başarılı cevabı kaydet
            setFormData({
                title: '',
                content: '',
                published: false,
                created_at: ''
            });
            fetchTransactions();  // Gönderimden sonra gönderilen yazıların listesini yenile
        } catch (error) {
            console.error('Form gönderiminde hata:', error);  // Tam hata nesnesini kaydet
        }
    };

    return (
        <div>
            <nav className="navbar navbar-dark bg-primary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        Finance App
                    </a>
                </div>
            </nav>
            <div className='container'>
              <form onSubmit={handleFormSubmit}>
              
                <div className='mb-3 mt-3'>
                  <label htmlFor='title' className='form-label'>
                    Title
                  </label>
                  <input type='text' className='form-control' id='title' name='title' onChange={handleInputChange} value={formData.title}/>
                </div>
                <div className='mb-3'>
                  <label htmlFor='content' className='form-label'>
                    Content
                  </label>
                  <input type='text' className='form-control' id='content' name='content' onChange={handleInputChange} value={formData.content}/>
                </div>
                <div className='mb-3'>
                  <label htmlFor='created_at' className='form-label'>
                    created_at
                  </label>
                  <input type='text' className='form-control' id='created_at' name='created_at' onChange={handleInputChange} value={formData.created_at}/>
                </div>
                <div className='mb-3 mt-3'>
                  <label htmlFor='published' className='form-label'>
                    published
                  </label>
                  <input type='checkbox' id='published' name='published' onChange={handleInputChange} checked={formData.published}/>
                </div>
                <button type='submit' className='btn btn-primary'>
                  Submit
                </button>
              </form>
              <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.title}</td>
                            <td>{item.content}</td>
                            <td>{item.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default App;