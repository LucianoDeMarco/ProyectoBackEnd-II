import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;
    
    if (!token) {
        return res.status(401).json({ error: 'No autenticado. Token no provisto.' }); // 401
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ error: 'No autenticado. Token inválido o expirado.' }); 
    }
};

// Verifica si el usuario tiene el rol requerido
export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: 'No autorizado. Permisos insuficientes.' });
        }
        next();
    };
};