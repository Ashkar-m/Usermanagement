import React, { useEffect, useState } from 'react';
import './Adminpanel.css';
import Navbar from '../../components/navbar/Navbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { faRemove, faPencil, faAdd, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signUp } from '../../components/authService/authService';

const Adminpanel = () => {
  const { accessToken } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState({}); 
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [isAddUser, setIsAddUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const token = JSON.parse(atob(accessToken.split('.')[1]));

  const deleteProfile = async (e, profileId) => {
    e.preventDefault();

    const confirmation = window.confirm('Are you sure you want to delete this profile?');
    if (!confirmation) {
      return;
    }

    try {
      const response = await api.delete(`/api/profiles/${profileId}/`);
      if (response.status === 204) {
        setUsers(users.filter(user => user.uid !== profileId));
        console.log('Profile and user deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting profile and user:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/profiles/');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!token.is_superuser) {
      navigate('/');
    } else {
      fetchUsers();
    }
  }, [accessToken, token.is_superuser, navigate]);

  const handleEditClick = (user) => {
    setIsEditing({ ...isEditing, [user.email]: !isEditing[user.email] });
    setFormData({
      ...formData,
      [user.email]: {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        bio: user.bio
      },
    });
  };

  const handleInputChange = (e, userEmail) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [userEmail]: {
        ...formData[userEmail],
        [name]: value,
      },
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleFormSubmit = async (e, user) => {
    e.preventDefault();
    const { fullname, username, email, bio } = formData[user.email];
    const formDataToSend = new FormData();
    formDataToSend.append('fullname', fullname);
    formDataToSend.append('username', username);
    formDataToSend.append('email', email);
    formDataToSend.append('bio', bio);
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      const response = await api.patch(`/api/profiles/${user.uid}/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setUsers(users.map(u => u.uid === user.uid ? response.data : u));
        setIsEditing({ ...isEditing, [user.email]: false });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const { fullname, username, email, bio, password1, password2 } = formData['newUser'];

    if (password1 !== password2) {
      console.log('Passwords are not matching!');
      window.alert('Passwords are not matching!');
      return;
    }

    try {
      await signUp(email, username, fullname, password1, password2);
      console.log('User created successfully');
      setIsAddUser(false);
      fetchUsers(); // Re-fetch users after adding a new user
    } catch (error) {
      console.error('Error creating user:', error);
      window.alert(error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-panel-container">
      <Navbar />
      <div className='search-add-user-container'>
        <div className='add-user-container'>
          <p className="add-user-link" onClick={() => setIsAddUser(!isAddUser)}>
            <FontAwesomeIcon icon={faAdd} className="add-user-icon" />
            {isAddUser ? 'Close' : 'Add user'}
          </p>
        </div>
        <div className='search-container'>
          <p><FontAwesomeIcon icon={faSearch} className="add-user-icon" /></p>
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery} 
            onChange={handleSearchInputChange}
            className="search-input"
          />
        </div>
      </div>
      
      {isAddUser ? (
        <div className="add-user-form">
          <form className='form-add' onSubmit={handleAddUser}>
            <div className="edit-form-group">
              <label htmlFor="fullname-new-user" className="edit-form-label">Full Name</label>
              <input
                type="text"
                name="fullname"
                onChange={(e) => handleInputChange(e, 'newUser')}
                placeholder="Full Name"
                className="edit-form-input"
                id="fullname-new-user"
              />
            </div>
            <div className="edit-form-group">
              <label htmlFor="username-new-user" className="edit-form-label">Username</label>
              <input
                type="text"
                name="username"
                onChange={(e) => handleInputChange(e, 'newUser')}
                placeholder="Username"
                className="edit-form-input"
                id="username-new-user"
              />
            </div>
            <div className="edit-form-group">
              <label htmlFor="email-new-user" className="edit-form-label">Email</label>
              <input
                type="email"
                name="email"
                onChange={(e) => handleInputChange(e, 'newUser')}
                placeholder="Email"
                className="edit-form-input"
                id="email-new-user"
              />
            </div>
            <div className="edit-form-group">
              <label htmlFor="password1-new-user" className="edit-form-label">Password</label>
              <input
                type="password"
                name="password1"
                onChange={(e) => handleInputChange(e, 'newUser')}
                placeholder="Enter password"
                className="edit-form-input"
                id="password1-new-user"
              />
            </div>
            <div className="edit-form-group">
              <label htmlFor="password2-new-user" className="edit-form-label">Repeat password</label>
              <input
                type="password"
                name="password2"
                onChange={(e) => handleInputChange(e, 'newUser')}
                placeholder="Enter password"
                className="edit-form-input"
                id="password2-new-user"
              />
            </div>
            <div className="edit-form-buttons">
              <button type="submit" className="edit-form-button">Create User</button>
              <button type="button" onClick={() => setIsAddUser(false)} className="edit-form-button">Cancel</button>
            </div>
          </form>
        </div>
      ) : null }

      <div className="users-container">
        {filteredUsers.map((user) => {
          if (!user.is_superuser) {
            return (
              <div key={user.email} className="user-details">
                {user.image && (
                  <div className="user-photo">
                    <img src={user.image} alt="Profile" />
                  </div>
                )}
                <div className='user-detail-container'>
                  <div className="user-detail">
                    <span className="user-detail-label">Full Name:</span>
                    <span className="user-detail-value">{user.fullname || 'N/A'}</span>
                  </div>
                  <div className="user-detail">
                    <span className="user-detail-label">Username:</span>
                    <span className="user-detail-value">{user.username}</span>
                  </div>
                  <div className="user-detail">
                    <span className="user-detail-label">Email:</span>
                    <span className="user-detail-value">{user.email}</span>
                  </div>
                  <div className="user-detail">
                    <span className="user-detail-label">Bio:</span>
                    <span className="user-detail-value">{user.bio}</span>
                  </div>
                </div>
                <div className='edit-delete'>
                  <p className="delete-profile-link" onClick={(e) => deleteProfile(e, user.uid)}>
                    <FontAwesomeIcon icon={faRemove} className="delete-profile-icon" />
                    Delete Profile
                  </p>
                  <p className="edit-profile-link" onClick={() => handleEditClick(user)}>
                    <FontAwesomeIcon icon={faPencil} className="edit-profile-icon" />
                    {isEditing[user.email] ? 'Close Edit' : 'Edit Profile'}
                  </p>
                </div>
                {isEditing[user.email] && (
                  <form onSubmit={(e) => handleFormSubmit(e, user)} className="edit-form">
                    <div className="edit-form-group">
                      <label htmlFor={`fullname-${user.email}`} className="edit-form-label">Full Name</label>
                      <input
                        type="text"
                        name="fullname"
                        value={formData[user.email].fullname}
                        onChange={(e) => handleInputChange(e, user.email)}
                        placeholder="Full Name"
                        className="edit-form-input"
                        id={`fullname-${user.email}`}
                      />
                    </div>
                    <div className="edit-form-group">
                      <label htmlFor={`username-${user.email}`} className="edit-form-label">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData[user.email].username}
                        onChange={(e) => handleInputChange(e, user.email)}
                        placeholder="Username"
                        className="edit-form-input"
                        id={`username-${user.email}`}
                      />
                    </div>
                    <div className="edit-form-group">
                      <label htmlFor={`email-${user.email}`} className="edit-form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData[user.email].email}
                        onChange={(e) => handleInputChange(e, user.email)}
                        placeholder="Email"
                        className="edit-form-input"
                        id={`email-${user.email}`}
                      />
                    </div>
                    <div className="edit-form-group">
                      <label htmlFor={`bio-${user.email}`} className="edit-form-label">Bio</label>
                      <input
                        type="text"
                        name="bio"
                        value={formData[user.email].bio}
                        onChange={(e) => handleInputChange(e, user.email)}
                        placeholder="Bio"
                        className="edit-form-input"
                        id={`bio-${user.email}`}
                      />
                    </div>
                    <div className="edit-form-group">
                      <label htmlFor={`image-${user.email}`} className="edit-form-label">Profile Picture</label>
                      <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="edit-form-input"
                        id={`image-${user.email}`}
                      />
                    </div>
                    <div className="edit-form-buttons">
                      <button type="submit" className="edit-form-button">Save</button>
                      <button type="button" onClick={() => setIsEditing({ ...isEditing, [user.email]: false })} className="edit-form-button">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Adminpanel;
