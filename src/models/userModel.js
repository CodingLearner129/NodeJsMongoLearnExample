import mongoose from "mongoose";
import slugify from "slugify";
import crypto from "crypto";
import validator from "validator";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
dotenvExpand.expand(dotenv.config({ path: "./../../.env" }));

// create schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the user name"],
    trim: true,
    minlength: [3, "The user must have at least 3 characters"],
    maxlength: [50, "The user must have less or equal then 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter the email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
    minlength: [5, "The email must have at least 5 characters"],
    maxlength: [50, "The email must have less or equal then 50 characters"],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minlength: [8, "The email must have at least 8 characters"],
    maxlength: [50, "The email must have less or equal then 50 characters"],
    select: false // to hide the createdAt from the response like passwords
  },
  confirmPassword: {
    type: String,
    required: [true, "Please enter the confirm password"],
    select: false, // to hide the createdAt from the response like passwords
    // this only works on create and save
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "The confirm password and password must be the same"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false // to hide the createdAt from the response like passwords
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  secretuser: {
    type: Boolean,
    default: false,
    select: false
  }
});

// only run this function if the password was actually modified 
userSchema.pre('save', async function (next) {
  // isModified('password') check at password field is modified or not
  if (!this.isModified('password')) return next();

  // has the password with cost of 12
  this.password = await bcrypt.hash(this.password, Number(process.env.BCRYPT_SALT_ROUND) || 10);

  // delete the password confirm field
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function(next){
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

userSchema.pre(/^find/, function(next){
  this.find({ active: { $ne: false} });
  this.updateOne({active: true});
  next();
});

// instance method
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // date time to unix

    return JWTTimestamp < changedTimeStamp; // 100 < 200 = true means password changed if false then not changed
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function (time) {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + time * 60 * 1000;

  return resetToken;
}

// create model
const user = mongoose.model("user", userSchema);

export { user };
