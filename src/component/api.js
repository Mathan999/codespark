// api.js - API service for React app with improved error handling
const API_URL = window.location.hostname === 'app.leadssync.com'
  ? 'https://app.leadssync.com/api'
  : '/api'; // For production, use relative path if API and frontend are on same domain

// Helper function to handle fetch errors
const handleFetchResponse = async (response) => {
  // Check if the response is JSON before parsing
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  if (!response.ok) {
    // Try to get error details if it's JSON
    if (isJson) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // If parsing JSON fails, throw the response status
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    } else {
      // For non-JSON responses
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
  }
  
  // Return parsed JSON if it's JSON, otherwise return the response
  return isJson ? response.json() : response.text();
};

// Add timeout to fetch requests
const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout. Server might be down.')), timeout)
    )
  ]);
};

export const api = {
  // Uses name and phone to match the backend schema
  async login(name, phone) {
    try {
      // Add some retry logic (3 attempts max)
      let attempts = 0;
      const maxAttempts = 3;
      let lastError;
      
      while (attempts < maxAttempts) {
        try {
          console.log(`Attempting login with: ${name}, ${phone}`);
          
          const response = await fetchWithTimeout(
            `${API_URL}/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                name,  // name field
                phone, // phone field
                // Add a deviceId or similar to help with debugging
                clientInfo: {
                  platform: navigator.platform,
                  userAgent: navigator.userAgent
                }
              }),
              // Prevent caching issues
              cache: 'no-cache',
              // CORS fix for development
              credentials: window.location.hostname === 'app.leadssync.com' ? 'omit' : 'same-origin'
            }
          );
          
          // Process the response
          const data = await handleFetchResponse(response);
          return {
            success: true,
            userId: data.userId,
            ...data
          };
        } catch (error) {
          lastError = error;
          attempts++;
          console.log(`Login attempt ${attempts} failed: ${error.message}`);
          
          // Only retry on network errors or 5xx server errors
          if (!error.message.includes('Network') && 
              !error.message.includes('timeout') && 
              !error.message.includes('5')) {
            break;
          }
          
          // Add a small delay between retries
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.error('Login error after retries:', lastError);
      throw lastError;
    } catch (error) {
      console.error('Login error:', error);
      
      // Return structured error for better UX
      return {
        success: false,
        message: error.message || 'Login failed. Please try again.'
      };
    }
  },
  
  async getUserProfile(userId) {
    try {
      const response = await fetchWithTimeout(`${API_URL}/users/${userId}`, {
        credentials: window.location.hostname === 'app.leadssync.com' ? 'omit' : 'same-origin'
      });
      
      return await handleFetchResponse(response);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
  
  async updateProfile(userId, profileData) {
    try {
      const response = await fetchWithTimeout(
        `${API_URL}/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
          credentials: window.location.hostname === 'app.leadssync.com' ? 'omit' : 'same-origin'
        }
      );
      
      return await handleFetchResponse(response);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  async deleteAccount(userId) {
    try {
      const response = await fetchWithTimeout(
        `${API_URL}/users/${userId}`,
        {
          method: 'DELETE',
          credentials: window.location.hostname === 'app.leadssync.com' ? 'omit' : 'same-origin'
        }
      );
      
      return await handleFetchResponse(response);
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }
};