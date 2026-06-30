const jwt = require('jsonwebtoken');

const authMiddleware = {};

authMiddleware.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Acceso denegado. Token no propocionado.',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.usuarioLogged = decoded;

        next();
    } catch (error) {
        return res.status(403).json({
            mensaje: 'Token inválido o expirado.',
            error: error.message,
        });
    }
};

authMiddleware.authorize = (rolesPermitidos = []) => {
    return (req, res, next) => {
        if (!req.usuarioLogged || !rolesPermitidos.includes(req.usuarioLogged.rol)) {
            return res.status(403).json({ 
                error: 'Acceso denegado: No cuenta con los permisos necesarios.' 
            });
        }
        next();
    };
};

module.exports = authMiddleware;
