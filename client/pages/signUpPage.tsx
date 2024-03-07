'use client'
import React, { useState, Component, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import WelcomePage from './welcomePage';
import axios from 'axios';
import Cookies from 'js-cookie';
import { backendUrl } from './_app';
// React components for the sign-up page.
function SignUpPage() {
    const route = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    // State for form data.
    const [data, setData] = useState({
        username: "",
        email: "",
        password: ""
    });

    // Function to toggle password visibility.
    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Function for handling input changes.
    const handleChange = (e: any) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
    };
    // Function for handling user information and sending the data to backend.
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const userData = {
            username: data.email,
            email: data.email,
            password: data.password
        }; // Post the user data to the backend.
        axios.post(backendUrl + "api/users/register", userData).then((response) => {
            console.log(response.status, response.data.token);
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log("server responded");
            } else if (error.request) {
                console.log("network error");
            } else {
                console.log(error)
            }
        }); // Set cookies.
        Cookies.set('email', data.email);
        Cookies.set('username', data.username);
        Cookies.set('id', data.email);
        Cookies.set('timestamp', Date.now().toString());
        window.location.reload();// Reload the page.
    };

    // Render the sign-up UI.
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
                            value={data.email}
                            onChange={handleChange}
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
                            value={data.password}
                            onChange={handleChange}
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
                        <button type="submit" className="signup-button">
                            Sign Up
                        </button>
                </form>
            </div>
        </div>
    );
};
// Export the SignUpPage component
export default SignUpPage;
