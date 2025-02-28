const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

exports.adminOnly = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    console.log("decodder",decoded)
    if (decoded.user.role !== "admin") {
      console.log("hello worrd")
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
  
  next();}


  exports.authenticateToken = (req, res, next) => {
      const authHeader = req.headers?.authorization;
  
      if (!authHeader) {
          console.log("No Authorization header found - Redirecting to login");
          return res.redirect("/"); 
      }
  
      if (!authHeader.startsWith("Bearer ")) {
          console.log("Invalid Authorization format - Redirecting to login");
          return res.redirect("/");
      }
  
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
              console.log("JWT Verification Error:", err);
              return res.redirect("/"); 
          }
  
          req.user = decoded;
          console.log("Middleware Passed - User:", req.user);
          next();
      });
  };
  
