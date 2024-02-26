import React, { useState, Component, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import WelcomePage from './welcomePage';
import axios from 'axios';

function SignUpPage() {
    const route = useRouter()
    const [showPassword, setShowPassword] = useState(false);

    const [data, setData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const handleChange = (e: any) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
    };
    
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const userData = {
            username: data.email,
            email: data.email,
            password: data.password
        };
        axios.post("http://127.0.0.1:5000/api/users/register", userData).then((response) => {
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
        });
        route.push('/welcomePage')
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


export default SignUpPage;
