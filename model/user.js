const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

var userSchema = new mongoose.Schema({
    first_name: {type: String, required:true},
    last_name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

// password comparison function
userSchema.methods.verifyPassword = function (password, callback) {
    console.log(this.password)
    bcrypt.compare(password, this.password, (err, valid) => {
        if (password === this.password){
            valid = true;
        }
        callback(err, valid)
    })
    
}

const SALT_FACTOR = 10

// hash password before saving
userSchema.pre('save', function save(next) {
    const user = this// go to next if password field has not been modified
    if (!user.isModified('password')) {
        return next()
    }

    // auto-generate salt/hash
    bcrypt.hash(user.password, SALT_FACTOR, (err, hash) => {
        if (err) {
            return next(err)
        }
        //replace password with hash
        user.password = hash
        next()
    })
})

const User = mongoose.model('user', userSchema)
  
module.exports = User