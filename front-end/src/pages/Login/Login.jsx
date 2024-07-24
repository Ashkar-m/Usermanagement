import React, { useEffect } from 'react';
import './Login.css'
import { login } from '../../components/authService/authService';
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux'
import { getProfile } from '../../components/userprofile/getProfile';

const LoginPage = () => {
  const {accessToken} = useSelector(state => state.auth)
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate('/')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (e.target.email.value.trim === "") {
      window.alert('Enter valid emailid')
    }
    
    try {
      const tokenData = await login(e.target.email.value, e.target.password.value)
      await getProfile()

      if (tokenData.is_superuser) {
        navigate('/adminpanel')
      } else {
        navigate('/')
      }
           
    } catch (error) {
        console.log(error)
        window.alert(error)
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required />

        <button type="submit">Login</button>
        <p onClick={() => navigate('/signup')}>Create account</p>
      </form>
    </div>
    )
}

export default LoginPage
