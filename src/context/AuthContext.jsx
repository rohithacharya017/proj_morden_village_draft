// ==========================================================================
// MODERN VILLAGE - AUTHENTICATION CONTEXT
// Role-Based Auth for Villagers and Panchayat Officials
// ==========================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_VILLAGER = {
  id: "villager-1",
  full_name: "Rameshwar Patel",
  email: "rameshwar@villager.in",
  mobile_number: "9876543210",
  role: "villager",
  village_name: "Rampur Gram Panchayat",
  ward_number: "Ward 3"
};

const DEMO_OFFICIAL = {
  id: "official-1",
  full_name: "Satish Sharma",
  email: "official@panchayat.gov.in",
  mobile_number: "9811122233",
  role: "panchayat_official",
  designation: "Panchayat Secretary",
  panchayat_name: "Rampur Gram Panchayat (Wards 1-12)",
  district: "Varanasi",
  state: "Uttar Pradesh"
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mv_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mv_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mv_auth_user');
    }
  }, [currentUser]);

  // Villager Registration
  const registerVillager = async ({ fullName, email, mobileNumber, password }) => {
    setLoading(true);
    try {
      // Simulate network
      await new Promise(r => setTimeout(r, 400));
      const newUser = {
        id: `villager-${Date.now()}`,
        full_name: fullName,
        email,
        mobile_number: mobileNumber,
        role: "villager",
        village_name: "Rampur Gram Panchayat",
        ward_number: "Ward 1"
      };

      // Save user to registered list
      const registered = JSON.parse(localStorage.getItem('mv_registered_users') || '[]');
      if (registered.some(u => u.email === email)) {
        throw new Error('An account with this email address already exists. Please log in.');
      }
      registered.push(newUser);
      localStorage.setItem('mv_registered_users', JSON.stringify(registered));

      setCurrentUser(newUser);
      return { success: true, user: newUser };
    } finally {
      setLoading(false);
    }
  };

  // Villager Login
  const loginVillager = async (email, password) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      if (email === DEMO_VILLAGER.email || email === 'rameshwar@villager.in') {
        setCurrentUser(DEMO_VILLAGER);
        return { success: true, user: DEMO_VILLAGER };
      }

      const registered = JSON.parse(localStorage.getItem('mv_registered_users') || '[]');
      const found = registered.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentUser(found);
        return { success: true, user: found };
      }

      // If user logs in with new email, let them sign in for testing
      const guest = {
        id: `villager-${Date.now()}`,
        full_name: email.split('@')[0],
        email,
        mobile_number: "9876543210",
        role: "villager",
        village_name: "Rampur Gram Panchayat"
      };
      setCurrentUser(guest);
      return { success: true, user: guest };
    } finally {
      setLoading(false);
    }
  };

  // Panchayat Official Login
  const loginPanchayat = async (email, password) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      // Authenticate against official demo credentials
      if (email.toLowerCase().includes('panchayat') || email === DEMO_OFFICIAL.email) {
        setCurrentUser(DEMO_OFFICIAL);
        return { success: true, user: DEMO_OFFICIAL };
      }

      // Default authorized official session
      const customOfficial = {
        ...DEMO_OFFICIAL,
        email,
        full_name: email.split('@')[0].toUpperCase() + " (Official)"
      };
      setCurrentUser(customOfficial);
      return { success: true, user: customOfficial };
    } finally {
      setLoading(false);
    }
  };

  // Quick switch to Demo Villager
  const loginAsDemoVillager = () => {
    setCurrentUser(DEMO_VILLAGER);
  };

  // Quick switch to Demo Panchayat Official
  const loginAsDemoPanchayat = () => {
    setCurrentUser(DEMO_OFFICIAL);
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
        registerVillager,
        loginVillager,
        loginPanchayat,
        loginAsDemoVillager,
        loginAsDemoPanchayat,
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
