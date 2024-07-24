import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import './Home.css'

function Home() {
  
  return (
    <div>
      <Navbar />
      <div className="home-page-container">
        <h1>Welcome to User Management</h1>
        <p>This application allows users to register and manage their profiles. 
          Authorized admins can access a powerful panel to view and manage all user
          accounts. The user interface is built with React, a popular JavaScript 
          library known for its efficiency and component-based architecture.
          Under the hood, Django, a high-level Python web framework, provides a robust 
          foundation for handling server-side logic, database interactions, and user 
          authentication.</p>
        <div className="cta-container">
        </div>
      </div>
    </div>
  )
}

export default Home
