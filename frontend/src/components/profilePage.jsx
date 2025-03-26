import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';  // Import the Navbar component

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    addresses: [],
  });

  const [editingAddressIndex, setEditingAddressIndex] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          avatar: parsedUser.avatar?.url || '',
          addresses: parsedUser.addresses || [],
        });
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (index, value) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index] = value;
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const handleAddAddress = () => {
    setEditingAddressIndex(formData.addresses.length);
    setFormData({ ...formData, addresses: [...formData.addresses, ''] });
  };

  const handleSaveAddress = async () => {
    try {
      const response = await axios.put('http://localhost:8000/user/update-profile', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatar: formData.avatar,
        addresses: formData.addresses, // Send updated addresses
      });
      setUser(response.data); // Store the updated user data
      localStorage.setItem('user', JSON.stringify(response.data)); // Update localStorage with the new data
      alert('Addresses successfully updated');
    } catch (error) {
      console.error('Error updating addresses:', error);
    }
  };
  


  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post('http://localhost:8000/user/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData({ ...formData, avatar: response.data.url });
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('http://localhost:8000/user/update-profile', formData);
      setUser(response.data);
      setIsEditing(false); // Exit editing mode
      localStorage.setItem('user', JSON.stringify(response.data)); // Update localStorage
      alert('Profile successfully updated');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-12 px-4">
      <Navbar />
      {user ? (
        <div className="w-full max-w-4xl">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg mb-6">
            <h2 className="text-3xl font-semibold text-center text-gray-100 mb-6">Profile</h2>
            <div className="flex flex-col items-center justify-center">
              <img
                src={formData.avatar || 'default-avatar.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-indigo-500"
              />
              {isEditing ? (
                <>
                  <input
                    type="file"
                    name="avatar"
                    onChange={handleAvatarChange}
                    className="w-full mb-4 p-2 bg-gray-700 text-white border border-gray-600 rounded"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-3 bg-gray-700 text-white border border-gray-600 rounded"
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-3 bg-gray-700 text-white border border-gray-600 rounded"
                    placeholder="Email Address"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-3 bg-gray-700 text-white border border-gray-600 rounded"
                    placeholder="Phone Number"
                  />
                  <button
                    onClick={handleSave}
                    className="mt-4 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-100">{user.name}</h3>
                  <p className="text-lg text-gray-400">{user.email}</p>
                  <p className="text-lg text-gray-400">{user.phone}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-100 mb-4">Addresses</h2>
            {formData.addresses.length > 0 ? (
              formData.addresses.map((address, index) => (
                <div key={index} className="mb-4">
                  {editingAddressIndex === index ? (
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => handleAddressChange(index, e.target.value)}
                      className="w-full mb-4 p-3 bg-gray-700 text-white border border-gray-600 rounded"
                      placeholder={`Address #${index + 1}`}
                    />
                  ) : (
                    <div>
                      <p className="text-lg text-gray-400">{address}</p>
                      <button
                        onClick={() => setEditingAddressIndex(index)}
                        className="mt-2 text-blue-500 hover:text-blue-600 transition"
                      >
                        Edit Address
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No address found</p>
            )}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleAddAddress}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Add Address
              </button>
              {editingAddressIndex !== null && (
                <button
                  onClick={handleSaveAddress}
                  className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
                >
                  Save Addresses
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white">Loading...</p>
      )}

      <footer className="w-full bg-gray-800 text-center text-gray-400 py-4 mt-8">
        <p>Made by sonali</p>
      </footer>
    </div>
  );
};

export default Profile;