import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import './Home.css'

function Home() {
  
  return (
    <div>
      <Navbar />
      <div className="home-page-container">
        <h1>Welcome to Home</h1>
        <p>This is a sample Home page.In the Top left corner you can able to see your name if you click on it you will 
          redirect to profile page.You can able to update your profile on their.Also in Top right corner you see Logout button 
          by clicking that you will logout and redirected to Login page.</p>
        <div className="cta-container">
        </div>
      </div>
    </div>
  )
}

export default Home
