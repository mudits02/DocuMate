import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState : initialState,
    reducers:{
        setCredentials: (state, action) => {
            const {token, user} = action.payload
            state.token = token
            state.user = user
            state.isAuthenticated = true
            state.error = null
            localStorage.setItem('token', token)
        },
        logout: (state) => {
            state.token = null
            state.user = null
            state.isAuthenticated = false
            localStorage.remove('token')
        },
        setError: (state, action) => {
            state.error = action.payload
            state.loading = false
        }
    }

})

export const {setCredentials, logout, setError} = authSlice.actions;
export default authSlice.reducer
