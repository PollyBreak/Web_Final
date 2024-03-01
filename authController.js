require("dotenv").config();

const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const {secret} = require("./config")
const nodemailer = require('nodemailer');

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"} )
}

const transporter = nodemailer.createTransport({
    // SMTP server details
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, //use TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: true // rejects unauthorized connections
    }
});

class authController {

    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const errorDetails = errors.array();
                return res.status(400).json({message: "Register error", errors: errorDetails})
            }
            const {username, password, country, email, firstName} = req.body;
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: "User with such username already exists"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, roles: [userRole.value], firstName, email, country})
            await user.save()
            sendEmail(email, "Registration", "Thanks you for registration")
            return res.json({message: "The user was successfully registered"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error', type: e._message, errors:e.errors })
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `User ${username} is not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Wrong password`})
            }
            const token = generateAccessToken(user._id, user.roles)
            sendEmail(user.email, "Log in", "Somebody has already logged in your account")
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }
}

function sendEmail(email, subject, text) {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        text: text,
    };
    return new Promise((resolve, reject) => {  // returns promise for handling asynchronous func
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error:', error);
                reject(error); // reject promise with error
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info.response);  // resolve promise
            }
        });
    });
}


module.exports = new authController()