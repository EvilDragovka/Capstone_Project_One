import React, { useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { backendUrl } from './_app';

// Function for sending the login credentials to the backend.
async function loginUser(credentials: {email: string, password: string} ) {
    const response = await fetch(backendUrl + 'api/users/login', {
        method: 'POST', // Send a POST request to the backend with the login credentials.
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(credentials),
    }); 

    // If the response status is 401 (Unauthorized), log an error message.
    if (response.status === 401) {
        console.log('Invalid credentials');
        return response.status;
    }

    // If the response is not ok, log an error message.
    if (!response.ok) {
        console.log('Server error');
        return response.status;
    }
    const data = await response.json();     // Parse the response data as JSON
    console.log(data); 

    // Set cookies with the user's email, username, id, and the current timestamp.
    //  So the user can be recognized and logged in.
    Cookies.set('email', data.user.email);
    Cookies.set('username', data.user.username);
    Cookies.set('id', data.user.id);
    Cookies.set('timestamp', Date.now().toString());
    return response.status; 
}

// React components for the login page.
function WelcomePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [title, setTitle] = useState('Welcome!');
    const [inactive, setInactive] = useState(false);

    // Function for handling from input changes.
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Function for submitting the login credentials.
    const onSubmitClick = async (event: any) =>  {
        event.preventDefault();
        // Checks if the email and the password is provided
        if (formData.email === '' || formData.password === '') {
            setErrorMessage('Please fill in all fields');
            return;
        }

        setTitle('Logging in...');
        setErrorMessage('');
        setInactive(true);

        // Calls the loginUser function to attempt login.
        let response = await loginUser(formData);
        console.log(response);

        // If the login is successful, redirect to the home page and reload the page.
        //  Or just show an error message.
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

    //Render the login UI.
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
// Export the WelcomePage component.
export default WelcomePage;
