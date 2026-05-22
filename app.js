import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { initializePassport } from './config/passport.config.js';

dotenv.config();

const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error conectando a Mongo', err));

// Configuración de Sesiones con connect-mongo
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 3600 // ttl (time to live) --> duracion de 1 hora
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Inicializar Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use('/api/v1/auth', authRoutes);
// Alias para las rutas protegidas requeridas en la consigna
app.use('/api/v1', authRoutes); 

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});