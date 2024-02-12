import React from 'react';
import Link from 'next/link';

function WelcomePage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md flex flex-col items-center">
                <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">Learnix</h1>
                <form className="flex flex-col space-y-4 w-full">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm md:text-base font-semibold text-gray-600">Email:</label>
                        <input type="email" id="email" name="email" className="border px-3 py-2 rounded-md focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm md:text-base font-semibold text-gray-600">Password:</label>
                        <input type="password" id="password" name="password" className="border px-3 py-2 rounded-md focus:outline-none focus:border-blue-500" />
                    </div>
                </form>
                <Link href="/" legacyBehavior>
                <div className="mt-4">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Log In
                    </button>
                </div>
                </Link>
                <p className="text-center mt-4 mb-2">——— Don't have an account? ———</p>
                <Link href="/signUpPage" legacyBehavior>
                    <a id="link" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Sign Up
                    </a>
                </Link>
            </div>
        </div>
    );
}

export default WelcomePage;
