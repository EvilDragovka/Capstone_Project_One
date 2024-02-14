import React from 'react';
import Link from 'next/link';

function WelcomePage() {
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
                <Link href="/" legacyBehavior>
                    <div className="welcome-btn">
                        <button type="submit" className="btn-primary">
                            Log In
                        </button>
                    </div>
                </Link>
                <p className="welcome-info">——— Don't have an account? ———</p>
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
