// /**
//  * @license
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Building2, 
//   Hash, 
//   ChevronRight, 
//   Save, 
//   Loader2, 
//   CheckCircle2, 
//   ShieldCheck 
// } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { Navbar } from '../components/Navbar';
// import { Footer } from '../components/Footer';
// import { useAuth } from '../context/AuthContext';

// export const Profile = () => {
//   const { user, isAuthenticated, loading: authLoading, updateProfile } = useAuth();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     city: '',
//     address: '',
//     postalCode: '',
//   });

//   const [isSaving, setIsSaving] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);

//   // Guard route for authenticated users
//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       navigate('/login?redirect=profile');
//     }
//   }, [isAuthenticated, authLoading, navigate]);

//   // Pre-fill user data when user is loaded
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || user.fullName || '',
//         email: user.email || '',
//         phone: user.phone || user.phoneNumber || '',
//         city: user.city || '',
//         address: user.address || '',
//         postalCode: user.postalCode || user.postal_code || user.zipCode || '',
//       });
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (saveSuccess) setSaveSuccess(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);
//     setSaveSuccess(false);

//     try {
//       await updateProfile(formData);
//       setSaveSuccess(true);
//       toast.success('Personal information updated successfully!');
//       setTimeout(() => setSaveSuccess(false), 4000);
//     } catch (error) {
//       toast.error(error.message || 'Failed to save changes. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center">
//         <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
//         <span className="text-sm font-semibold text-gray-500 mt-2">Loading profile details...</span>
//       </div>
//     );
//   }

//   return (
//     <div id="profile_page_wrapper" className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
//       <Navbar />

//       <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
//         {/* Breadcrumb Navigation */}
//         <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-semibold">
//           <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
//           <ChevronRight className="h-3 w-3" />
//           <span className="text-gray-900 dark:text-gray-300 font-bold">My Profile</span>
//         </div>

//         {/* Page Header */}
//         <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
//               <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
//                 <User className="h-6 w-6" />
//               </div>
//               <span>Personal Information</span>
//             </h1>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
//               Manage and update your account identity, contact details, and default delivery address.
//             </p>
//           </div>

//           <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/40 text-xs font-bold">
//             <ShieldCheck className="h-4 w-4" />
//             <span>Account Verified</span>
//           </div>
//         </div>

//         {/* Main Personal Information Card here */}
//         <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-sm p-6 sm:p-8">

//           {saveSuccess && (
//             <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3 animate-fadeIn">
//               <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
//               <div>
//                 <p className="font-bold">Changes saved successfully!</p>
//                 <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">Your personal information has been updated across your profile.</p>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//               {/* Full Name */}
//               <div className="space-y-2">
//                 <label htmlFor="full_name_input" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                   Full Name
//                 </label>
//                 <div className="relative rounded-xl shadow-xs">
//                   <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
//                     <User className="h-4 w-4" />
//                   </div>
//                   <input
//                     type="text"
//                     id="full_name_input"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     placeholder="John Doe"
//                     className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-hidden font-medium"
//                   />
//                 </div>
//               </div>

//               {/* Email Address */}
//               <div className="space-y-2">
//                 <label htmlFor="email_input" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                   Email Address
//                 </label>
//                 <div className="relative rounded-xl shadow-xs">
//                   <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
//                     <Mail className="h-4 w-4" />
//                   </div>
//                   <input
//                     type="email"
//                     id="email_input"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     placeholder="user@example.com"
//                     className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-hidden font-medium"
//                   />
//                 </div>
//               </div>

//               {/* Phone */}
//               <div className="space-y-2">
//                 <label htmlFor="phone_input" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                   Phone Number
//                 </label>
//                 <div className="relative rounded-xl shadow-xs">
//                   <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
//                     <Phone className="h-4 w-4" />
//                   </div>
//                   <input
//                     type="tel"
//                     id="phone_input"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     placeholder="+1 (555) 000-0000"
//                     className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-hidden font-medium"
//                   />
//                 </div>
//               </div>

//               {/* City */}
//               <div className="space-y-2">
//                 <label htmlFor="city_input" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                   City
//                 </label>
//                 <div className="relative rounded-xl shadow-xs">
//                   <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
//                     <Building2 className="h-4 w-4" />
//                   </div>
//                   <input
//                     type="text"
//                     id="city_input"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleChange}
//                     placeholder="New York"
//                     className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-hidden font-medium"
//                   />
//                 </div>
//               </div>

//               {/* Address */}
//               <div className="space-y-2 md:col-span-2">
//                 <label htmlFor="address_input" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                   Address
//                 </label>
//                 <div className="relative rounded-xl shadow-xs">
//                   <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
//                     <MapPin className="h-4 w-4" />
//                   </div>
//                   <input
//                     type="text"
//                     id="address_input"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     placeholder="123 Main Street, Apt 4B"
//                     className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-hidden font-medium"
//                   />
//                 </div>
//               </div>

//               {/* Postal Code */}
//               <div className="space-y-2">
//                 <label htmlFor="postal_code_input" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                   Postal Code
//                 </label>
//                 <div className="relative rounded-xl shadow-xs">
//                   <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
//                     <Hash className="h-4 w-4" />
//                   </div>
//                   <input
//                     type="text"
//                     id="postal_code_input"
//                     name="postalCode"
//                     value={formData.postalCode}
//                     onChange={handleChange}
//                     placeholder="10001"
//                     className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-hidden font-medium"
//                   />
//                 </div>
//               </div>

//             </div>

//             {/* Bottom Form Actions */}
//             <div className="pt-6 border-t border-gray-150 dark:border-gray-800 flex items-center justify-end">
//               <button
//                 type="submit"
//                 id="save_changes_btn"
//                 disabled={isSaving}
//                 className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-3.5 rounded-xl text-sm font-extrabold shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
//               >
//                 {isSaving ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     <span>Saving...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Save className="h-4 w-4" />
//                     <span>Save Changes</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Profile;












/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Hash,
  ChevronRight,
  Save,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

import { toast } from 'react-toastify';

import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const Profile = () => {
  const navigate = useNavigate();

  
  // Profile Form State
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    postalCode: '',
  });

  
  // Loading States
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  
  // Get User ID from localStorage
  
  const getLoggedInUser = () => {
    try {
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Invalid user data in localStorage');
      return null;
    }
  };

  
  // Fetch Latest Profile Data
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = getLoggedInUser();

        // User not logged in
        if (!storedUser?.id) {
          navigate('/login');
          return;
        }

        // Get latest data from backend
        const response = await axios.get(
          `http://localhost:5000/singleuser/${storedUser.id}`
        );

        const userData = response.data.userData;

        if (!userData) {
          toast.error('Profile data not found');
          return;
        }

        // Set latest backend data into form
        setFormData({
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          city: userData.city || '',
          address: userData.address || '',
          postalCode: userData.postalCode || '',
        });

        // Update localStorage with latest user data
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...storedUser,
            ...userData,
            id: userData._id || storedUser.id,
          })
        );

        // Notify Navbar
        window.dispatchEvent(new Event('auth-change'));

      } catch (error) {
        console.error('Profile fetch error:', error);

        toast.error(
          error.response?.data?.message ||
          'Failed to load profile data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  
  // Handle Input Change
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };

  
  // Update Profile
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const storedUser = getLoggedInUser();

      if (!storedUser?.id) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      // Send updated data to backend
      const response = await axios.post(
        `http://localhost:5000/update/${storedUser.id}`,
        {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
        }
      );

      if (response.data) {
        
        // Fetch latest data again
        
        const latestResponse = await axios.get(
          `http://localhost:5000/singleuser/${storedUser.id}`
        );

        const latestUser = latestResponse.data.userData;

        // Update form with latest backend data
        setFormData({
          fullName: latestUser.fullName || '',
          email: latestUser.email || '',
          phone: latestUser.phone || '',
          city: latestUser.city || '',
          address: latestUser.address || '',
          postalCode: latestUser.postalCode || '',
        });

        
        // Update localStorage
        
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...storedUser,
            ...latestUser,
            id: latestUser._id || storedUser.id,
          })
        );

        
        // Notify Navbar
        
        window.dispatchEvent(new Event('auth-change'));

        setSaveSuccess(true);

        toast.success('Profile updated successfully!');

        // Hide success message after 4 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 4000);
      }

    } catch (error) {
      console.error('Profile update error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to update profile'
      );
    } finally {
      setIsSaving(false);
    }
  };

  
  // Loading Screen
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />

        <span className="text-sm font-semibold text-gray-500 mt-2">
          Loading profile details...
        </span>
      </div>
    );
  }

  
  // Profile Page
  
  return (
    <div
      id="profile_page_wrapper"
      className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200"
    >

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">

        {/* ==============================
            Breadcrumb
        ============================== */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-semibold">

          <Link
            to="/"
            className="hover:text-indigo-600 transition-colors"
          >
            Home
          </Link>

          <ChevronRight className="h-3 w-3" />

          <span className="text-gray-900 dark:text-gray-300 font-bold">
            My Profile
          </span>

        </div>


        {/* ==============================
            Page Header
        ============================== */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">

              <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>

              <span>Personal Information</span>

            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Manage and update your account information and delivery details.
            </p>

          </div>


          {/* Verified Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/40 text-xs font-bold">

            <ShieldCheck className="h-4 w-4" />

            <span>Account Verified</span>

          </div>

        </div>


        {/* ==============================
            Main Profile Card
        ============================== */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-sm p-6 sm:p-8">

          {/* ==============================
              Success Message
          ============================== */}
          {saveSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3">

              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />

              <div>

                <p className="font-bold">
                  Changes saved successfully!
                </p>

                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Your profile information has been updated.
                </p>

              </div>

            </div>
          )}


          {/* ==============================
              Profile Form
          ============================== */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              {/* ==============================
                  Full Name
              ============================== */}
              <div className="space-y-2">

                <label
                  htmlFor="full_name_input"
                  className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Full Name
                </label>

                <div className="relative rounded-xl shadow-xs">

                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="h-4 w-4" />
                  </div>

                  <input
                    type="text"
                    id="full_name_input"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-hidden font-medium"
                  />

                </div>

              </div>


              {/* ==============================
                  Email
              ============================== */}
              <div className="space-y-2">

                <label
                  htmlFor="email_input"
                  className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Email Address
                </label>

                <div className="relative rounded-xl shadow-xs">

                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>

                  <input
                    type="email"
                    id="email_input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="user@example.com"
                    className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-hidden font-medium"
                  />

                </div>

              </div>


              {/* ==============================
                  Phone
              ============================== */}
              <div className="space-y-2">

                <label
                  htmlFor="phone_input"
                  className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Phone Number
                </label>

                <div className="relative rounded-xl shadow-xs">

                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="h-4 w-4" />
                  </div>

                  <input
                    type="tel"
                    id="phone_input"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-hidden font-medium"
                  />

                </div>

              </div>


              {/* ==============================
                  City
              ============================== */}
              <div className="space-y-2">

                <label
                  htmlFor="city_input"
                  className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  City
                </label>

                <div className="relative rounded-xl shadow-xs">

                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Building2 className="h-4 w-4" />
                  </div>

                  <input
                    type="text"
                    id="city_input"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Dhaka"
                    className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-hidden font-medium"
                  />

                </div>

              </div>


              {/* ==============================
                  Address
              ============================== */}
              <div className="space-y-2 md:col-span-2">

                <label
                  htmlFor="address_input"
                  className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Address
                </label>

                <div className="relative rounded-xl shadow-xs">

                  <div className="absolute top-3.5 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <input
                    type="text"
                    id="address_input"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your address"
                    className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-hidden font-medium"
                  />

                </div>

              </div>


              {/* ==============================
                  Postal Code
              ============================== */}
              <div className="space-y-2">

                <label
                  htmlFor="postal_code_input"
                  className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Postal Code
                </label>

                <div className="relative rounded-xl shadow-xs">

                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Hash className="h-4 w-4" />
                  </div>

                  <input
                    type="text"
                    id="postal_code_input"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="1200"
                    className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-hidden font-medium"
                  />

                </div>

              </div>

            </div>


            {/* ==============================
                Save Button
            ============================== */}
            <div className="pt-6 border-t border-gray-150 dark:border-gray-800 flex items-center justify-end">

              <button
                type="submit"
                id="save_changes_btn"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl text-sm font-extrabold shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
              >

                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}

              </button>

            </div>

          </form>

        </div>

      </main>

      <Footer />

    </div>
  );
};

export default Profile;
