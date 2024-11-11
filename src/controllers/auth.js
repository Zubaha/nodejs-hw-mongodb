import { registerUser, sendResetEmailService, resetPasswordService } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { refreshSessionService } from '../services/auth.js';
import { logoutService } from '../services/auth.js';

export const register = async (req, res, next) => {
    const { name, email, password } = req.body;
        const newUser = await registerUser({ name, email, password });

        res.status(201).json({
            status: 201,
            message: "Successfully registered a user!",
            data: {
                name: newUser.name,
                email: newUser.email,
            },  
        });
    
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const userSession = await loginUser({ email, password });

    res.cookie('refreshToken', userSession.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.status(200).json({
        status: 200,
        message: "Successfully logged in an user!",
        data: {
            accessToken: userSession.accessToken,
        },
    });
};

export const refreshSession = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;


    const userSession = await refreshSessionService(refreshToken);

    res.cookie('refreshToken', userSession.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.status(200).json({
        status: 200,
        message: "Successfully refreshed a session!",
        data: {
            accessToken: userSession.accessToken,
        },
    });
};

export const logout = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    await logoutService(refreshToken);

    res.clearCookie('refreshToken');
    res.status(204).send();
}; 

export const sendResetEmailController = async (req, res) => {
    const { email } = req.body;
    await sendResetEmailService(email);
    res.status(200).json({
        status: 200,
        message: "Reset password email has been successfully sent.",
        data: {}
    });
};

export const resetPasswordController = async (req, res) => {
    const { token, password } = req.body;
    await resetPasswordService(token, password);
    res.status(200).json({
        status: 200,
        message: "Password has been successfully reset.",
        data: {}
    });
};