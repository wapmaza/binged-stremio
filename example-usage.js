// Example of how to use ipAddress function in your Stremio addon
import { ipAddress } from '@vercel/functions';

// Example function that uses ipAddress
async function logClientIP(request) {
  try {
    // Get the client's IP address
    const clientIP = ipAddress(request);
    
    console.log('Client IP Address:', clientIP);
    
    // You can now use this IP for logging, rate limiting, geo-location, etc.
    return clientIP;
  } catch (error) {
    console.error('Error getting IP address:', error);
    return null;
  }
}

// Example usage in a request handler
export async function handler(request, response) {
  // Log the client's IP address
  const clientIP = await logClientIP(request);
  
  // Your existing Stremio addon logic here
  response.json({
    message: 'Stremio addon is working!',
    clientIP: clientIP
  });
}

console.log('Example usage file created. The ipAddress function is ready to use!');