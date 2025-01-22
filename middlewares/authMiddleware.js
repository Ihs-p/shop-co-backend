const jwt  = require('jsonwebtoken')

 const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Get the Authorization header
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token after 'Bearer'
  // console.log("Generated Token:", token);
  // console.log("Token Received:", req.headers.authorization);
  console.log("requested url",req.url)
  if (!token) {
    console.log("no token")
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token

    const decoded = jwt.verify(token, 'secretkey',{ algorithm: 'HS256' }); // Replace with your secret key
    console.log("decoded token ")
    req.user = decoded; // Attach decoded payload to req (e.g., user ID, email)
    next(); // Proceed to the next middleware or route
  } catch (error) {
    console.log(error)
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {authenticateToken}
