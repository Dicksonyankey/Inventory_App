const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    console.log(authHeader);

    // Extract the Token from the Bearer || Token

    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'No token provided, please login to continue'
        })
    }

    // Decode the user Token
    try{
        const decodedToken  = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodedToken);

        req.userInfo = decodedToken;

        // Call the next()
        next();

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'No token provided, please login to continue'
        })
    }
}

module.exports = authMiddleware