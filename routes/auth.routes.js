import { Router } from 'express';
import passport from 'passport';
import { register, login, githubCallback, logout } from '../controllers/auth.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// --- Auth Endpoints ---
router.post('/register', register);

// Login Local delegando la validación inicial a Passport
router.post('/login', passport.authenticate('local', { session: false }), login);

// Login OAuth GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login' }), githubCallback);

// Logout
router.post('/logout', logout);

// --- Endpoints Protegidos ---

// Protegida solo por JWT (Cualquier usuario logueado)
router.get('/profile', verifyToken, (req, res) => {
    res.json({ message: 'Bienvenido a tu perfil', user: req.user });
});

// Protegida por Rol (Solo administradores)
router.get('/admin', verifyToken, requireRole('admin'), (req, res) => {
    res.json({ message: 'Panel de administrador', adminData: req.user });
});

// Endpoint para verificar la sesión en DB
router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ message: 'Sesión activa', session: req.session });
    } else {
        res.status(401).json({ error: 'No hay sesión activa' });
    }
});

export default router;