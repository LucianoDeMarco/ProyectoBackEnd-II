import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.model.js';

export const localStrategy = new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: 'Usuario no encontrado' });
            
            if (user.provider !== 'local') return done(null, false, { message: 'Inicia sesión con tu proveedor original' });

            const isMatch = await user.comparePassword(password);
            if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);