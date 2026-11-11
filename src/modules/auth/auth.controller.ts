import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../users/user.model';

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, role, branchId } = req.body;

        // 1. Check if the user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists with this email' });
            return;
        }

        // 2. Create the new user
        // Note: We pass 'password' to 'passwordHash'. The pre-save hook in user.model will hash it!
        const newUser = new User({
            firstName,
            lastName,
            email,
            passwordHash: password,
            role,
            branchId: branchId || null
        });

        await newUser.save();

        // 3. Generate a JWT Token for the user
        // Fallback secret just in case it's missing in .env
        const jwtSecret = process.env.JWT_SECRET || 'aventra_super_secret_key_2026';
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            jwtSecret,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // 4. Send success response back to the frontend
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error during registration' });
    }
};