import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';



function WelcomePage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: any) => {
        e.preventDefault();

        console.log('Email:', email);
        console.log('Password:', password);
        router.push('/mainPage')
    };

    const handleSignUp = (e: any) => {
        e.preventDefault();

        router.push('/signUpPage')
    }
    return (
        <div className="welcome-container"> {}
            <div className="welcome-content"> {}
                <h1 className="welcome-title">Learnix</h1>
                <form className="welcome-form">
                    <div className="form-field">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input type="email" id="email" name="email" className="form-input" />
                    </div>
                    <div className="form-field">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input type="password" id="password" name="password" className="form-input" />
                    </div>
                </form>
                <Link href="/mainPage" legacyBehavior>
                    <a type="submit" className="btn-secondary" onClick={handleLogin}>                     
                            Log In
                    </a>
                </Link>
                <p className="welcome-info">——— Don`&apos;`t have an account? ———</p>
                <Link href="/signUpPage" legacyBehavior>
                    <a id="link" className="btn-secondary" onClick={handleSignUp}>
                        Sign Up
                    </a>
                </Link>
            </div>
        </div>
    );
}

export default WelcomePage;
