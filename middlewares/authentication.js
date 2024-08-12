const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      // If no token is found, proceed to the next middleware or route
      return next();
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload; // Attach the user payload to the request object
      next(); // Proceed to the next middleware or route
    } catch (error) {
      console.error('Invalid token:', error);
      // Handle invalid token (e.g., by redirecting or setting error status)
      return next(); // Proceed to the next middleware or route
    }
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
