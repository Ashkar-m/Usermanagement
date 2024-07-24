import React, { useEffect, useState } from 'react'
import './Signup.css'
import { signUp } from '../../components/authService/authService'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  const {accessToken} = useSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (accessToken) {
      navigate('/')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (email.trim === '') {
      window.alert('Enter valid email')
      return
    }
    if (password1 !== password2) {
      window.alert('Password do not match')
      return
    }
    
    try {
      const response=await signUp(email, username, fullname, password1, password2)
      console.log('Signed succesfully',response)
      navigate('/login')
    } 
    catch (error) {
        console.log('Error while signup', error.message)
    }
  }

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required onChange={(e) => setEmail(e.target.value)} />
        <div className="form-row">
            <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label htmlFor="fullname">Full Name</label>
                <input type="text" id="fullname" name="fullname" onChange={(e) => setFullname(e.target.value)} />
            </div>
        </div>
        <div className="form-row">
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required onChange={(e) => setPassword1(e.target.value)} />
            </div>
            <div>
                <label className='p-0' htmlFor="repeatPassword">Repeat Password</label>
                <input className='p-0' type="password" id="repeatPassword" name="repeatPassword" required onChange={(e) => setPassword2(e.target.value)} />
            </div>
        </div>
        <button type="submit">Sign Up</button>
        <p onClick={() => navigate('/login')}>Login</p>
      </form>
    </div>
  )
}

export default Signup
