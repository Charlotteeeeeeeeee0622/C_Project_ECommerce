import React, { useState } from 'react';
import axios from 'axios';
import AuthPage from './AuthPage';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:3002'
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (values) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/signin', values);

      if (response.status === 200) {
        // Redirect to home page if login is successful
        window.location.href = '/products';
      } else {
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/signup', values);

      if (response.status === 201) {
        // Redirect to home page if sign-up is successful
        window.location.href = '/';
      } else {
        console.error('Sign up failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error signing up:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    window.location.href = '/update-password';
  };

  const formFields = [
    {
      label: 'Email',
      name: 'email',
      rules: [{ required: true, type: 'email', message: 'Please enter a valid email address' }],
    },
    {
      label: 'Password',
      name: 'password',
      rules: [{ required: true, message: 'Please enter your password' }],
      type: 'password',
    },
  ];

  return (
    <AuthPage
      type="signin"
      title="Sign In"
      formFields={formFields}
      buttonText="Submit"
      onSubmit={handleSignIn}
      secondaryAction={
        <p>
          Don't have an account yet? <a href="/signup" onClick={handleSignUp}>Sign up here.</a>
        </p>
      }
      tertiaryAction={
        <p>
          <a href="/update-password" onClick={handleForgotPassword}>Forgot your password?</a>
        </p>
      }
      isLoading={isLoading}
    />
  );
};

export default LoginPage;
