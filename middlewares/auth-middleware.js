import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_TOKEN_SECRET;


export const authMiddleware = (req, res, next) => {
    
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "User denied. Please provide a valid token"
        })
    }

    // decode token info
    try {
        const decodedToken = jwt.verify(token, jwtSecret);
        console.log(decodedToken);
        req.userInfo = decodedToken;
        next();
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


