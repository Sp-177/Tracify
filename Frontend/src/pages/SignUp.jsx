import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
function SignUp() {
  const { isLoggedIn , storeTokenInLS}  = useAuth();
  if(isLoggedIn){
    return <Navigate to={"/"} />
  }
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
    role: '',
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.role) newErrors.role = 'Please select a role';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms & policy';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:3001/api/v1/users/register', formData);
        storeTokenInLS(response.data.data.accessToken);
      } catch (error) {
        console.error('Error submitting form:', error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Form */}
      <div className="w-1/2 flex items-center justify-center bg-white p-10 mt-4">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-semibold mb-6">Get Started Now</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Name</label>
              <input type="text" name="name" className="w-full p-2 border rounded-lg" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email address</label>
              <input type="email" name="email" className="w-full p-2 border rounded-lg" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Age</label>
              <input type="number" name="age" className="w-full p-2 border rounded-lg" placeholder="Enter your age" value={formData.age} onChange={handleChange} />
              {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Password</label>
              <input type="password" name="password" className="w-full p-2 border rounded-lg" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            
            <div className="mb-4 flex items-center">
              <input type="checkbox" name="termsAccepted" className="mr-2" checked={formData.termsAccepted} onChange={handleChange} />
              <span className="text-sm text-gray-600">I agree to the <a href="#" className="text-blue-600">terms & policy</a></span>
            </div>
            {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Sign up as</label>
              <select name="role" className="w-full p-2 border rounded-lg" value={formData.role} onChange={handleChange}>
                <option value="">Select an option</option>
                <option value="family head">Family Head</option>
                <option value="family member">Family Member</option>
                <option value="individual">Individual</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>
            
            <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800">Signup</button>
          </form>
        </div>
      </div>
      
      {/* Right Side - Image */}
      <div className="w-1/2 bg-cover bg-center fixed right-0 top-0 h-full" 
        style={{ backgroundImage: "url('https://tracki.com/cdn/shop/articles/important-information-regarding-missing-persons-884435_dfc22d65-f353-43cd-8a78-ae270ed35d88.jpg?v=1737454248')" }}>
      </div>
    </div>
  );
}

export default SignUp;
