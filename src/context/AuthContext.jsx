// ==========================================================================
// MODERN VILLAGE - AUTHENTICATION CONTEXT
// Role-Based Auth for Villagers and Panchayat Officials
// ==========================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendSmsOtp } from '../services/smsService';

const AuthContext = createContext(null);

// Pre-seeded Villager Profiles
const KNOWN_VILLAGERS = [
  {
    id: "villager-1",
    full_name: "Rameshwar Patel",
    email: "rameshwar@villager.in",
    mobile_number: "9876543210",
    role: "villager",
    village_name: "Kandavara Gram Panchayat",
    ward_number: "Ward 3"
  },
  {
    id: "villager-2",
    full_name: "Sunita Devi",
    email: "sunita@villager.in",
    mobile_number: "9812345678",
    role: "villager",
    village_name: "Kandavara Gram Panchayat",
    ward_number: "Ward 1"
  },
  {
    id: "villager-3",
    full_name: "Anil Yadav",
    email: "anil@villager.in",
    mobile_number: "9823456789",
    role: "villager",
    village_name: "Kandavara Gram Panchayat",
    ward_number: "Ward 2"
  }
];

const DEMO_VILLAGER = KNOWN_VILLAGERS[0];

const OFFICIAL_CREDENTIALS = {
  email: "official@panchayat.gov.in",
  password: "Admin@567"
};

const DEMO_OFFICIAL = {
  id: "official-1",
  full_name: "Satish Sharma",
  email: "official@panchayat.gov.in",
  mobile_number: "9811122233",
  role: "panchayat_official",
  designation: "Panchayat Secretary",
  panchayat_name: "Kandavara Gram Panchayat (Wards 1-12)",
  district: "Varanasi",
  state: "Uttar Pradesh"
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mv_auth_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.village_name && parsed.village_name.includes('Rampur')) {
        parsed.village_name = parsed.village_name.replace(/Rampur/g, 'Kandavara');
      }
      if (parsed.panchayat_name && parsed.panchayat_name.includes('Rampur')) {
        parsed.panchayat_name = parsed.panchayat_name.replace(/Rampur/g, 'Kandavara');
      }
      localStorage.setItem('mv_auth_user', JSON.stringify(parsed));
      return parsed;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mv_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mv_auth_user');
    }
  }, [currentUser]);

  // Send OTP to Villager Mobile Number
  const sendVillagerOtp = async (mobileNumber, fullName = '') => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 450));
      const cleanMobile = mobileNumber.replace(/\D/g, '');
      if (cleanMobile.length !== 10) {
        throw new Error('Please enter a valid 10-digit Indian mobile number');
      }

      // Generate a realistic 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem(`mv_otp_${cleanMobile}`, generatedOtp);

      // Trigger SMS gateway dispatch
      await sendSmsOtp({ mobileNumber: cleanMobile, otp: generatedOtp, fullName });

      return {
        success: true,
        otp: generatedOtp,
        mobileNumber: cleanMobile,
        message: `OTP sent successfully to +91 ${cleanMobile}`
      };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and Authenticate Villager
  const verifyVillagerOtp = async (mobileNumber, otp, fullName = '') => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 450));
      const cleanMobile = mobileNumber.replace(/\D/g, '');
      const cleanOtp = (otp || '').trim();
      const storedOtp = localStorage.getItem(`mv_otp_${cleanMobile}`);

      // Allow generated OTP (or universal test fallback)
      if (cleanOtp !== storedOtp && cleanOtp !== '123456') {
        throw new Error('Invalid OTP. Please enter the correct 6-digit verification code sent to your mobile number.');
      }

      // Clear used OTP
      localStorage.removeItem(`mv_otp_${cleanMobile}`);

      // 1. Check known seeded villagers (Rameshwar, Sunita, Anil)
      const known = KNOWN_VILLAGERS.find(u => u.mobile_number === cleanMobile);
      if (known) {
        setCurrentUser(known);
        return { success: true, user: known };
      }

      // 2. Check registered villagers storage
      const registered = JSON.parse(localStorage.getItem('mv_registered_users') || '[]');
      const existing = registered.find(u => u.mobile_number === cleanMobile);
      if (existing) {
        setCurrentUser(existing);
        return { success: true, user: existing };
      }

      // 3. New Villager Registration
      const newVillager = {
        id: `villager-${Date.now()}`,
        full_name: fullName.trim() || `Villager (${cleanMobile.slice(-4)})`,
        email: `${cleanMobile}@villager.in`,
        mobile_number: cleanMobile,
        role: "villager",
        village_name: "Kandavara Gram Panchayat",
        ward_number: "Ward 1"
      };

      registered.push(newVillager);
      localStorage.setItem('mv_registered_users', JSON.stringify(registered));

      setCurrentUser(newVillager);
      return { success: true, user: newVillager };
    } finally {
      setLoading(false);
    }
  };

  // Legacy Villager Registration
  const registerVillager = async ({ fullName, email, mobileNumber, password }) => {
    return verifyVillagerOtp(mobileNumber, '123456', fullName);
  };

  // Legacy Villager Login
  const loginVillager = async (email, password) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const known = KNOWN_VILLAGERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (known) {
        setCurrentUser(known);
        return { success: true, user: known };
      }

      const registered = JSON.parse(localStorage.getItem('mv_registered_users') || '[]');
      const found = registered.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentUser(found);
        return { success: true, user: found };
      }

      const guest = {
        id: `villager-${Date.now()}`,
        full_name: email.split('@')[0],
        email,
        mobile_number: "9876543210",
        role: "villager",
        village_name: "Kandavara Gram Panchayat"
      };
      setCurrentUser(guest);
      return { success: true, user: guest };
    } finally {
      setLoading(false);
    }
  };

  // Panchayat Official Login - STRICT CHECK: official@panchayat.gov.in & Admin@567
  const loginPanchayat = async (email, password) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const cleanEmail = (email || '').trim().toLowerCase();

      // STRICT VALIDATION
      if (cleanEmail !== OFFICIAL_CREDENTIALS.email || password !== OFFICIAL_CREDENTIALS.password) {
        throw new Error(
          'Incorrect email address or password. Please make corrections and verify your official credentials.'
        );
      }

      setCurrentUser(DEMO_OFFICIAL);
      return { success: true, user: DEMO_OFFICIAL };
    } finally {
      setLoading(false);
    }
  };

  // Quick switch to Demo Villager
  const loginAsDemoVillager = (villagerIndex = 0) => {
    const v = KNOWN_VILLAGERS[villagerIndex] || DEMO_VILLAGER;
    setCurrentUser(v);
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        sendVillagerOtp,
        verifyVillagerOtp,
        registerVillager,
        loginVillager,
        loginPanchayat,
        loginAsDemoVillager,
        logout,
        isVillager: currentUser?.role === 'villager',
        isPanchayat: currentUser?.role === 'panchayat_official'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
