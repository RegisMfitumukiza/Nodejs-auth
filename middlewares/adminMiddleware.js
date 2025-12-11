
const adminMiddleware = (req, res, next) => {

    if(req.userInfo.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Only Admin allowed'
        })
    }
    next();
}

export default adminMiddleware;