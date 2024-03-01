const {Schema, model} = require('mongoose')
const mongoose = require("mongoose");

const AutoIncrement = require('mongoose-sequence')(mongoose);

const projectSchema = new mongoose.Schema({
    name_en: {
        type: String,
        required: true,
    },
    name_ru: {
        type: String,
        required: true,
    },
    stack: {
        type: [String],
        required: true,
    },
    description_en: {
        type: String,
        required: true,
    },
    description_ru: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
        validate: {
            validator: function(images) {
                return images.length === 3;
            },
            message: 'Images array must have exactly 3 elements.',
        },
    },
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    deleted: {
        type: Boolean,
        default: false
    },
    _id: Number
}, { versionKey: false })

projectSchema.plugin(AutoIncrement, {id: 'project_inc'});

module.exports = mongoose.model('Project', projectSchema)