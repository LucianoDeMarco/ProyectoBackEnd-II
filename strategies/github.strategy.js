import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.model.js';
import dotenv from 'dotenv';
dotenv.config();

export const githubStrategy = new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Busco el usuario (si existe)
        let user = await User.findOne({ email: profile._json.email || profile.emails[0].value });
        
        if (!user) {
            // Si no existe, lo creo
            user = await User.create({
                firstName: profile.displayName || profile.username,
                email: profile._json.email || profile.emails[0].value,
                provider: 'github',
                password: '' // No tiene password local
            });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});