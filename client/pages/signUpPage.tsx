import React, { useState } from 'react';
import Link from 'next/link';

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className="signup-container">
            <div className="signup-form-container">
                <h1 className="signup-heading">Sign Up</h1>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="signup-form-group">
                        <label htmlFor="email" className="signup-label">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="signup-input"
                        />
                    </div>
                    <div className="signup-form-group relative">
                        <label htmlFor="password" className="signup-label">
                            Password:
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="signup-input"
                        />
                        <button
                            type="button"
                            onClick={handlePasswordVisibility}
                            className="password-toggle-button"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <Link href="/" legacyBehavior>
                        <button type="submit" className="signup-button">
                            Sign Up
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    );
};


export default SignUpPage;
