import React, { useState } from 'react';
import Link from 'next/link';
function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md flex flex-col items-center">
                <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">Sign Up</h1>
                <form className="flex flex-col space-y-4 w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm md:text-base font-semibold text-gray-600">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex flex-col relative">
                        <label htmlFor="password" className="text-sm md:text-base font-semibold text-gray-600">
                            Password:
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handlePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <Link href="/mainPage" legacyBehavior>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Sign Up
                    </button>
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;
