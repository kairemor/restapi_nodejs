const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('user', UserSchema);

module.exports = User;