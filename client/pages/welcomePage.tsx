import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { backendUrl } from './_app';

async function loginUser(credentials: {email: string, password: string} ) {
    const response = await fetch(backendUrl + 'api/users/login', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(credentials),
    });
    if (response.status === 401) {
        console.log('Invalid credentials');
        return response.status;
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
    const [title, setTitle] = useState('Welcome!');
    const [inactive, setInactive] = useState(false);

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmitClick = async (event: any) =>  {
        event.preventDefault();
        if (formData.email === '' || formData.password === '') {
            setErrorMessage('Please fill in all fields');
            return;
        }

        setTitle('Logging in...');
        setErrorMessage('');
        setInactive(true);
        let response = await loginUser(formData);
        console.log(response);
        if (response == 200) {
            router.push('/');
            window.location.reload();
        } else if (response == 401) {
            setErrorMessage('Invalid credentials');
        } else {
            setErrorMessage(response.toString());
        }
        setTitle('Welcome!');
        setInactive(false);
    }

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1 className="welcome-title">{title}</h1>
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
                        <button disabled={inactive} type="submit" className="btn-primary">
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
