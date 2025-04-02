import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import AchievementItem from '../Components/AchievementItem';
import { defaultProfileData, defaultAchievements } from '../lib/profile-data';

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState(defaultProfileData);
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  // Fetch profile data
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['/api/profile'],
    onError: (error) => {
      console.error('Error fetching profile:', error);
    }
  });

  // Initialize form data when profile data is loaded
  useEffect(() => {
    if (profileData?.user) {
      setFormData(profileData.user);
    }
  }, [profileData]);

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (updatedData) => {
      return await apiRequest('PATCH', `/api/profile/${formData.id}`, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      alert('Profile updated successfully');
    },
    onError: (error) => {
      alert('Failed to update profile: ' + (error.message || 'Unknown error'));
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    updateProfile.mutate(formData);
  };

  const handleChangePhoto = () => {
    // In a real app, this would open a file picker
    console.log('Change photo clicked');
    alert('Photo upload functionality would be implemented here');
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // const handleUserTypeChange = (e) => {
  //   setFormData({...formData, userType: e.target.value});
  // };

  // Determine which achievements to show
  const achievements = profileData?.achievements || defaultAchievements;
  const displayedAchievements = showAllAchievements 
    ? achievements 
    : achievements.slice(0, 3);

  return (
    <div className="bg-[#F5F5FC] min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md">

        {/* Main Content */}
        <div className="p-6">
          {/* Profile Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My profile</h1>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <ul className="flex flex-wrap -mb-px">
                <li className="mr-8">
                  <button
                    onClick={() => handleTabClick('personal')}
                    className={`py-3 ${activeTab === 'personal' ? 'border-b-2 border-blue-600 text-gray-900 font-medium' : 'text-gray-500'}`}
                  >
                    Personal data
                  </button>
                </li>
              </ul>
            </div>

            {activeTab === 'personal' && (
              <div className="pt-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Form */}
                  <div className="w-full md:w-7/12">
                    {/* Profile Photo Section */}
                    <div className="mb-6">
                      <label className="block mb-2 text-sm font-medium text-gray-700">Profile photo</label>
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                          <img 
                            src={formData.profilePhoto} 
                            alt="Profile photo" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-2">JPG, GIF or PNG. Maximum file size 1 MB.</div>
                          <button 
                            onClick={handleChangePhoto}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                          >
                            Change photo
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields in 2 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* UID Field */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">UID</label>
                        <input 
                          type="text" 
                          name="uid"
                          value={formData.uid} 
                          className="w-full p-3 bg-[#F7F7F7] rounded-md text-gray-700 text-sm" 
                          disabled 
                        />
                      </div>

                      {/* Nickname Field */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Nickname</label>
                        <input 
                          type="text" 
                          name="nickname"
                          value={formData.nickname} 
                          onChange={handleInputChange}
                          className="w-full p-3 bg-[#F7F7F7] rounded-md text-gray-700 text-sm" 
                        />
                      </div>

                      {/* Phone number Field */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Phone number</label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone} 
                          onChange={handleInputChange}
                          className="w-full p-3 bg-[#F7F7F7] rounded-md text-gray-700 text-sm" 
                        />
                      </div>

                      {/* Email Field */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email} 
                          onChange={handleInputChange}
                          className="w-full p-3 bg-[#F7F7F7] rounded-md text-gray-700 text-sm" 
                        />
                      </div>

                      {/* Name Field */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName} 
                          onChange={handleInputChange}
                          className="w-full p-3 bg-[#F7F7F7] rounded-md text-gray-700 text-sm" 
                        />
                      </div>

                      {/* Surname Field */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Surname</label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={formData.lastName} 
                          onChange={handleInputChange}
                          className="w-full p-3 bg-[#F7F7F7] rounded-md text-gray-700 text-sm" 
                        />
                      </div>

                      {/* Middle name Field */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Middle name</label>
                        <input 
                          type="text" 
                          name="middleName"
                          value={formData.middleName} 
                          onChange={handleInputChange}
                          className="w-full p-3 bg-[#F7F7F7] rounded-md text-gray-700 text-sm" 
                        />
                      </div>

                      {/* Date of Birth Field */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Date of Birth</label>
                        <select
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-[#F7F7F7] rounded-md text-gray-700 text-sm"
                        >
                          <option value="">Select Date of Birth</option>
                          <option value="December 26, 1928">December 26, 1928</option>
                          <option value="January 1, 1970">January 1, 1970</option>
                          <option value="January 1, 1980">January 1, 1980</option>
                          <option value="January 1, 1990">January 1, 1990</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      onClick={handleSaveChanges}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>

                  {/* Achievements Section */}
                  <div className="w-full md:w-5/12 flex justify-center items-center">
                    {/* Achievements Section */}
                    <div className="bg-white border h-[400px] border-gray-200 rounded-lg p-5">
                      <h2 className="text-lg font-semibold mb-4">Achievements</h2>
                      
                      {displayedAchievements.map(achievement => (
                        <AchievementItem key={achievement.id} achievement={achievement} />
                      ))}
                      
                      <button 
                        onClick={() => setShowAllAchievements(!showAllAchievements)}
                        className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
                      >
                        {showAllAchievements ? 'Show less' : 'Show all achievements'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="pt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Payment information tab content would go here.</p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="pt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Notifications tab content would go here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;