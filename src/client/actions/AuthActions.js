import axios from 'axios';

// Action types
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';
export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS';
export const SIGNIN_FAILURE = 'SIGNIN_FAILURE';
export const UPDATE_PASSWORD_SUCCESS = 'UPDATE_PASSWORD_SUCCESS';
export const UPDATE_PASSWORD_FAILURE = 'UPDATE_PASSWORD_FAILURE';

// Action creator functions
export const signUp = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post('/signup', { email, password });
    dispatch({ type: SIGNUP_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: SIGNUP_FAILURE, payload: error.response.data });
  }
};

export const signIn = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post('/signin', { email, password });
    dispatch({ type: SIGNIN_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: SIGNIN_FAILURE, payload: error.response.data });
  }
};

export const updatePassword = (email, oldPassword, newPassword) => async (dispatch) => {
  try {
    const response = await axios.put('/update-password', { email, oldPassword, newPassword });
    dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: UPDATE_PASSWORD_FAILURE, payload: error.response.data });
  }
};
