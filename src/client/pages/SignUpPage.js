import React, { useState } from 'react';
import axios from 'axios';
import AuthPage from './AuthPage';
import UpdatePasswordPage from './UpdatePasswordPage';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3002'
});

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async (values) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await axiosInstance.post('/signup', values);

      if (response.status === 201) {
        // Redirect to home page if sign-up is successful
        window.location.href = '/';
      } else {
        console.error('Sign up failed:', response.data.message);
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setErrorMessage('Internal server error');
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
    {
      label: 'Confirm Password',
      name: 'confirmPassword',
      rules: [
        { required: true, message: 'Please confirm your password' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords do not match'));
          },
        }),
      ],
      type: 'password',
    },
  ];

  return (
    <AuthPage
      type="signup"
      title="Sign Up"
      formFields={formFields}
      onSubmit={handleSignUp}
      buttonText="Sign Up"
      errorMessage={errorMessage}
      secondaryAction={
        <p>
          Already have an account? <a href="/login">Sign in here.</a>
        </p>
      }
      tertiaryAction={
        <p>
          <a href="/update-password" onClick={handleForgotPassword}>Forgot your password?</a>
        </p>
      }
      isLoading={isLoading}
    >
      <UpdatePasswordPage />
    </AuthPage>
  );
};

export default SignUpPage;
