
const isAdminUser = (req, res, next) => {

    if ((req.userInfo.role !== 'admin') && (req.userInfo.role !== 'manager')) {
        return res.status(400).json({
            success: false,
            status: 'error',
            message: `You are not authorized to access this page`,
        })
    }

    next()
}

module.exports = isAdminUser;