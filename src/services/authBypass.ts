// Development bypass for testing - removes auth requirement
// Use this to test the app without Supabase auth working

export const BYPASS_AUTH = true; // Set to true to skip auth

export const getBypassUser = () => {
  if (!BYPASS_AUTH) return null;
  
  // Return a mock user that bypasses auth
  return {
    id: 'bypass-user-123',
    email: 'test@pawmatch.com',
    full_name: 'Test User',
    role: 'buyer', // Change to 'breeder_independent', 'buyer', 'shelter', 'vet', etc.
    country: 'Malta',
  };
};
