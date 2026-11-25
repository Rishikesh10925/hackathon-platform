// Base URL of the API Gateway stage that fronts the Lambda functions.
// Override per environment with VITE_API_BASE_URL in frontend/.env.local.
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://xe6yu454x0.execute-api.us-east-1.amazonaws.com'
).replace(/\/$/, '');
