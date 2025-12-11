import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


import User from '../models/User.js';

const jwtSecret = process.env.JWT_TOKEN_SECRET;


export const registerUser = async (req, res) => {
    try {

        const { username, email, password, role } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username or password exists. please try again!'
            });
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        })

        await newUser.save();

        if (newUser) {
            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: newUser
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Unable to register user'
            });
        }

    } catch (error) {
        console.log('Error Registering user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}


export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;
        //find current user if exist
        const currentUser = await User.findOne({ email });

        if (!currentUser) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }
        // check if passwordMatch
        const isPasswordMatch = await bcrypt.compare(password, currentUser.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const payload = {
            userId: currentUser._id,
            username: currentUser.username,
            email: currentUser.email,
            role: currentUser.role,
        }

        const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: '15m' })

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: 'User Unable to log in successfully',
            });
        } else {
            return res.status(200).json({
                message: 'User logged in successfully',
                token: accessToken
            });
        }

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const changePassword = async (req, res) => {

    try {

        const userId = req.userInfo.userId;

        // current user exist
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: `The user doesn't exist`
            })
        }

        // old password and new Password
        const { oldPassword, newPassword } = req.body;

        const isOldPasswordExist = await bcrypt.compare(oldPassword, user.password);

        if (!isOldPasswordExist) {
            return res.status(400).json({
                success: false,
                message: `The Old password doesn't match`
            })
        }

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = newHashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        })

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }

}
