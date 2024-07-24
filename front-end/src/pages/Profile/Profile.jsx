import React, { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import {  useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import './Profile.css';
import { editProfile } from '../../components/userprofile/getProfile';

function Profile() {
  const dispatch = useDispatch();
  // const { username, fullname, email, image, bio } = useSelector(state => state.profile);
  const profile = JSON.parse(localStorage.getItem('profile'))
  
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(profile.username);
  const [newFullname, setNewFullname] = useState(profile.fullname);
  const [newEmail, setNewEmail] = useState(profile.email);
  const [newImage, setNewImage] = useState(null);
  const [newBio, setNewBio] = useState(profile.bio);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
};


  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await editProfile(newEmail, newUsername, newFullname, newBio, newImage, profile.uid);
  } catch (error) {
      if (error.response && error.response.data) {
          const errorData = error.response.data;
          if (errorData.email) {
              setError('Email already exists');
          } else if (errorData.username) {
              setError('Username already exists');
          } else if (errorData.image) {
              setError('Invalid image file');
          } else {
              setError('Error updating profile');
          }
      } else {
          
          window.alert(error);
      }
  }
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="profile-wrapper">
        <Navbar />
        <div className="profile-info">
          <img src={profile.image} alt="Profile Picture" className="profile-image" />
          <h1>{profile.fullname}</h1>
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
          <p className="bio">{profile.bio}</p>
          <p className="edit-profile-link" onClick={() => setIsEditing(true)}>
            <FontAwesomeIcon icon={faPencil} className="edit-profile-icon" />
            Edit Profile
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="profile-wrapper">
        <Navbar />
        <div className="profile-info">
          <div className="profile-edit">
            <form  onSubmit={(e) => handleSave(e)}>
              <label>
                Full Name:
                <input
                  type="text"
                  value={newFullname}
                  onChange={(e) => setNewFullname(e.target.value)}
                />
              </label>
              <label>
                Username:
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </label>
              <label>
                Bio:
                <textarea
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                />
              </label>
              <label>
                Profile Picture:
                <input
                  type="file"
                  accept='image/*'
                  onChange={handleImageChange}
                />
              </label>
              <div className="profile-edit-buttons">
                <button type='submit'>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
              {error && <p className="error">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
