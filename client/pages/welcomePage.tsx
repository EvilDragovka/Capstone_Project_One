import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

async function loginUser(credentials: {email: string, password: string} ) {
    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
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
    }
}

function WelcomePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
      });
    
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmitClick = async (event: any) =>  {
        event.preventDefault();
        if (await loginUser(formData)) {
            Cookies.set('email', formData.email);
            Cookies.set('timestamp', Date.now().toString());
            window.location.reload();
        }
    }

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1 className="welcome-title">Learnix</h1>
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
