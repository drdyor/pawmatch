import axios from 'axios'

// Set up base URL only - remove interceptors that cause issues in production
axios.defaults.baseURL = '/'

// Interceptors disabled for demo mode - they cause "c.global is undefined" error in Vercel
// When backend is ready, we can re-enable with proper null checks

export default axios
