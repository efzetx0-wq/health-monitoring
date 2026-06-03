import React from 'react'
import 'react-toastify/dist/ReactToastify.css';
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter
} from 'react-router-dom'

import App from './App'
import './index.css'

import {
  AuthProvider
} from './context/AuthContext'
import {
  ToastContainer
} from "react-toastify";

ReactDOM.createRoot(
  document.getElementById('root')
).render(



  <BrowserRouter>

    <AuthProvider>

      <App />
      <ToastContainer
        position="top-right"
        autoClose={5000}
      />

    </AuthProvider>

  </BrowserRouter>
)