import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

async function loginUser(credentials: {email: string, password: string} ) {
<<<<<<< HEAD
    try {
        const url = "http://localhost:5000/api/users/login";
        // const url = "";
        const response = await fetch(url, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('User logged in:', data);
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
=======
    const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(credentials),
    });
    if (response.status === 401) {
        console.log('Invalid credentials');
        return response.status;
>>>>>>> b34841bd7661fdb84a9cbb575cee3c0bbbece541
    }
    if (!response.ok) {
        console.log('Server error');
        return response.status;
    }
    const data = await response.json();
    console.log(data);
    Cookies.set('email', data.user.email);
    Cookies.set('username', data.user.username);
    Cookies.set('id', data.user.id);
    Cookies.set('timestamp', Date.now().toString());
    return response.status;
}

function WelcomePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmitClick = async (event: any) =>  {
        event.preventDefault();
<<<<<<< HEAD
        if (await loginUser(formData)) {
            Cookies.set('email', formData.email);
            Cookies.set('timestamp', Date.now().toString());
            //window.location.reload();
            router.push('/mainPage')
=======
        if (formData.email === '' || formData.password === '') {
            setErrorMessage('Please fill in all fields');
            return;
        }

        let response = await loginUser(formData);
        console.log(response);
        if (response == 200) {
            window.location.reload();
        } else if (response == 401) {
            setErrorMessage('Invalid credentials');
        } else {
            setErrorMessage(response.toString());
>>>>>>> b34841bd7661fdb84a9cbb575cee3c0bbbece541
        }
    }

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1 className="welcome-title">Welcome!</h1>
                <p>{errorMessage}</p>
                <form className="welcome-form" onSubmit={onSubmitClick}>
                    <div className="form-field">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input type="email" id="email" name="email" className="form-input" value={formData.email} onChange={handleChange}/>
                    </div>
                    <div className="form-field">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input type="password" id="password" name="password" className="form-input"  value={formData.password} onChange={handleChange}/>
                    </div>
                    <div className="welcome-btn">
                        <button type="submit" className="btn-primary">
                            Log In
                        </button>
                    </div>
                </form>
                <p className="welcome-info">——— Don&apos;t have an account? ———</p>
                <Link href="/signUpPage" legacyBehavior>
                    <a id="link" className="btn-secondary">
                        Sign Up
                    </a>
                </Link>
            </div>
        </div>
    );
}

export default WelcomePage;
