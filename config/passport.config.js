import passport from 'passport';
import { localStrategy } from '../strategies/local.strategy.js';
import { githubStrategy } from '../strategies/github.strategy.js';

export const initializePassport = () => {
    passport.use('local', localStrategy);
    passport.use('github', githubStrategy);
};