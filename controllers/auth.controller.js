import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

// Generador de Token
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );
};

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        
        // Validación de duplicados
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: 'El email ya está registrado' });

        const newUser = await User.create({ firstName, lastName, email, password, role });
        res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const login = (req, res) => {
    // Si llega a este punto, Passport Local ya autenticó al usuario
    const user = req.user;
    
    // Generación del JWT
    const token = generateToken(user);

    // Guardar información en la sesión (Sistema de sesiones híbrido)
    req.session.user = { id: user._id, email: user.email, role: user.role };

    // Envío del token en Cookie y Body
    res.cookie('authToken', token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000 // 1 hora
    }).json({
        message: 'Login exitoso',
        token, // Enviado en el body según consigna
        user: { id: user._id, role: user.role }
    });
};

export const githubCallback = (req, res) => {
    const user = req.user;
    const token = generateToken(user);
    req.session.user = { id: user._id, email: user.email, role: user.role };

    res.cookie('authToken', token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    }).redirect('/api/v1/profile'); // Redirección tras login exitoso
};

export const logout = (req, res) => {
    // 1. Limpieza de cookie
    res.clearCookie('authToken');
    
    // 2. Destrucción de sesión
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
        res.status(200).json({ message: 'Logout exitoso. Recuerda eliminar el token en el cliente si lo guardaste en memoria.' });
    });
};