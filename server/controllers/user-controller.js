import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from "../models/user-model.js";

/* load .env contents */
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;

/* jwt generator */
async function generateToken(id, username) {
    if (!JWT_SECRET) throw new Error('JWT_SECRET is required');
    const secret = new TextEncoder().encode(JWT_SECRET);
    return new SignJWT({ id: id.toString(), username })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(secret);
}

/* login errors object */
const errors = {
    credentials: {
        message: 'Could not log in. Please check your credentials.',
    },
};

function registrationErrors(err) {
    if (err?.code === 11000) {
        return { email: { message: 'Email is already registered. Please log in.' } };
    }

    if (err?.errors) {
        return Object.fromEntries(
            Object.entries(err.errors).map(([field, fieldError]) => [
                field,
                { message: fieldError.message },
            ])
        );
    }

    return null;
}

async function registerUser(req, res) {
    try {
        const user = await User.create(req.body);
        const userToken = await generateToken(user._id, user.username)
        res.status(201).json({
            token: userToken,
            username: user.username,
            id: user._id,
        });
    }
    catch (err) {
        console.error('User registration failed');
        const fieldErrors = registrationErrors(err);
        if (fieldErrors) {
            return res.status(422).json({ errors: fieldErrors });
        }
        res.status(500).json({ message: 'Registration could not be completed.' });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const identifier = email?.trim();
        const user = await User.findOne({
            $or: [{ email: identifier?.toLowerCase() }, { username: identifier }],
        });

        if(!user) {
            console.log('Email incorrect.');
            return res.status(400).json( { errors });
        }
        const passwordIsCorrect = await bcrypt.compare(password, user.password);

        if(!passwordIsCorrect) {
            console.log('Password incorrect');
            return res.status(400).json( { errors });
        }

        const userToken = await generateToken(user._id, user.username);

        res.status(200).json({
            token: userToken,
            username: user.username,
            id: user._id,
        });
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
}

export { registerUser, loginUser, getAllUsers };
