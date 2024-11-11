import User from '../models/user.js';

import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import Session from '../models/session.js';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

import { sendMail } from '../utils/sendMail.js';



export const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser !== null) {
        throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return newUser;
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw createHttpError(401, 'Invalid email or password');
    }

    await Session.deleteOne({ userId: user._id });

    const accessToken = crypto.randomBytes(30).toString('base64');
    const refreshToken = crypto.randomBytes(30).toString('base64');

    const newSession = new Session({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
        refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });
    await newSession.save();

    return { accessToken, refreshToken };
};

export const refreshSessionService = async (refreshToken) => {
    const session = await Session.findOne({ refreshToken });

    if (session === null) {
        throw createHttpError(401, 'Session not found');
      }
    
      if (session.refreshToken !== refreshToken) {
        throw createHttpError(401, 'Session not found');
      }
    
      if (new Date() > session.refreshTokenValidUntil) {
        throw createHttpError(401, 'Refresh token is expired');
      }

    const accessToken = crypto.randomBytes(30).toString('base64');
    const newRefreshToken = crypto.randomBytes(30).toString('base64');

    await Session.deleteOne({ userId: session.userId });

    const newSession = new Session({
        userId: session.userId,
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
        refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });
    await newSession.save();

    return { accessToken, refreshToken: newRefreshToken };
};

export const logoutService = async (refreshToken) => {
    const session = await Session.findOne({ refreshToken });

    if (!session) {
        throw createHttpError(401, 'Invalid refresh token');
    }

    await Session.deleteOne({ refreshToken });
}; 

export const sendResetEmailService = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    const resetToken = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

  
        await sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Reset your password',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        });

};

export const resetPasswordService = async (token, password) => {
  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.sub, email: decoded.email });
        if (!user) {
            throw createHttpError(404, 'User not found!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
        await Session.deleteOne({ userId: user._id });
};