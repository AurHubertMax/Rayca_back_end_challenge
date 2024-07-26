const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
    },
    role: {
        type: String,
        required: [true, 'Please select a role'],
        enum: ['customer', 'support agent', 'admin']
    },
})

// encrypt password before doc saved to db
userSchema.pre('save', async function(next) {
    const saltRounds = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
})

//static method to login user
userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({username});
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('username doesnt exist');
}


const User = mongoose.model('user', userSchema);

module.exports = User;