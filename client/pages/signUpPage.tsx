'use client'
import React, { useState, Component, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import WelcomePage from './welcomePage';
import axios from 'axios';
import Cookies from 'js-cookie';
import { backendUrl } from './_app';
import { App } from '@capacitor/app';

// Checks if the password is strong enough.
function isStrongPassword(password: string) {
    // Check for at least 8 characters, one uppercase letter, one digit, and one special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;
    return regex.test(password);
}

// React components for the sign-up page.
function SignUpPage() {
    const route = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Support for the Android back button
    //  When the back button is pressed, go back to the welcome page.
    App.addListener('backButton', () => {
        route.push('/');
    });

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
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const userData = {
            username: data.email,
            email: data.email,
            password: data.password
        }; 

        console.log(userData);
        // Pop up an error message if any of the fields are not filled in.
        if (data.email === "" || data.password === "") { 
            setErrorMessage("Please fill in all fields.");
            return; 
        }
        if (!isStrongPassword(data.password)) {
            setErrorMessage("Password is not strong enough!");
            return;
        }
        if (data.email.length > 25) {
            setErrorMessage("Email is too long!");
            return;
        }
        

        // Post the user data to the backend.
        axios.post(backendUrl + "api/users/register", userData).then((response) => {
            console.log(response.status, response.data.token);
        
            // Set cookies.
            Cookies.set('email', data.email);
            Cookies.set('username', data.username);
            Cookies.set('id', data.email);
            Cookies.set('timestamp', Date.now().toString());
            route.push('/');            // I forgor to add this
            // window.location.reload();   // Reload the page.
            setErrorMessage("");
        })
        .catch((error) => {
            // Catch and log any errors.
            if (error.response) {
                if (error.response == 401) {
                    setErrorMessage("Invalid credentials");
                } else {
                    setErrorMessage(error.response);
                }
                console.log(error.response);
                console.log("server responded");
            } else if (error.request) {
                console.log("network error");
                setErrorMessage(error.request);
            } else {
                console.log(error)
                setErrorMessage(error);
            }
        }); 
    };

    // Render the sign-up UI.
    return (
        <div className="signup-container">
            <div className="signup-form-container">
                <h1 className="signup-heading">Sign Up</h1>
                <p>{errorMessage}</p>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="signup-form-group">
                        <label htmlFor="email" className="signup-label">
                            Email:
                        </label>
                        <div className="signup-input">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="signup-form-group relative">
                        <label htmlFor="password" className="signup-label">
                            Password:
                        </label>
                        <div className='signup-input'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={handlePasswordVisibility}
                                className="password-toggle-button"
                            >
                                {showPassword ? <i className="fi fi-rs-crossed-eye"></i> : <i className="fi fi-rr-eye"></i>}
                            </button>
                        </div>
                    </div>
                    <p className="password-requirements">Password must contain at least eight characters, an upper-case letter, one digit, and a special character </p>
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
