const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: '/images/default.png',
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const salt = randomBytes(16).toString('hex'); // Use hex encoding
  const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');

  user.salt = salt;
  user.password = hashedPassword;
  next();
});

// Static method to match password
userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error('User Not Found!');

  const userProvidedHash = createHmac('sha256', user.salt)
    .update(password)
    .digest('hex');
  
  if (user.password !== userProvidedHash) throw new Error('Incorrect Password');

  // return user;
  const token= createTokenForUser(user)
  return token
});

const User = model('User', userSchema);
module.exports = User;
