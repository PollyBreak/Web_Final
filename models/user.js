const mongoose = require('mongoose');

const AutoIncrement = require('mongoose-sequence')(mongoose);
const validator = require('validator')

const userSchema = new mongoose.Schema({
        username:{
            required:true,
            type:String,
            unique: true
        },
        firstName:{
            required:true,
            type:String
        },
        country: {
            required: true,
            type: String
        },
        password: {
            required: true,
            type: String
        },
        _id: Number,
        roles: [{type: String, ref: 'Role'}],
        email: {
            type:String,
            required:true,
            unique: true,
            validate: [validator.isEmail, 'User must have email']
        },
    }, { versionKey: false }
)

userSchema.plugin(AutoIncrement);

module.exports = mongoose.model('User', userSchema)