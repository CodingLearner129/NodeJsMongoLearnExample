import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { user as userModel } from "./../models/userModel.js";
import cathAsync from "./../utils/catchAsync.js";
import AppError from "../utils/appErrors.js";
// import * as Email from "../utils/email.js"; //old setup
// import dotenv from "dotenv";
// import dotenvExpand from "dotenv-expand";
// dotenvExpand.expand(dotenv.config({ path: "./../../.env" }));
import Email from "./../utils/email.js";

const time = 10; // means 10 minutes

const signToken = async (id) => {
  // return jwt.sign({id: id}, process.env.JWT_SECRET_KEY || 'secret', {
  //     expiresIn: process.env.JWT_EXPIRATION || "10d"
  // });
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY || "secret", {
    expiresIn: process.env.JWT_EXPIRATION || "10d",
  });
};

const createSendToken = async (model, statusCode, res) => {
  const token = await signToken(model._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV.trim() === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  if (statusCode == 200) {
    res.status(statusCode).json({
      status: "success",
      data: {
        token,
      },
    });
  } else {
    // Remove password from output
    model.password = undefined;

    res.status(statusCode).json({
      status: "success",
      data: {
        user: model,
        token,
      },
    });
  }
};

export const signup = cathAsync(async (req, res, next) => {
  const model = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role,
  });

  const url = `${req.headers.host}/api/v1/users/update-profile`;

  await new Email(model, url).sendWelcome();

  // const token = jwt.sign({id: model._id}, process.env.JWT_SECRET_KEY || 'secret', {
  //     expiresIn: process.env.JWT_EXPIRATION || "10d"
  // });

  // const token = await signToken(model._id);

  // const response = {
  //   status: "success",
  //   data: {
  //     user: model,
  //     token,
  //   },
  // };
  // res.status(201).send(response);

  await createSendToken(model, 201, res);
});

export const login = cathAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if password is already exists
  if (!email || !password) {
    return next(new AppError("Please Provide email and password!", 400));
  }

  // 2) check if user is exists && password is correct
  // const model = await userModel.aggregate([
  //     {
  //         $match: { email: email},
  //     },
  //     // {
  //     //     $project: {_id: 1, password: 1}
  //     // }
  // ]);
  const model = await userModel.findOne({ email }).select("+password");
  // console.log(model);
  // if (!model || !(await model[0].correctPassword(password, model[0].password))) {
  if (!model || !(await model.correctPassword(password, model.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  // const token = await signToken(model[0]._id);

  // const token = await signToken(model._id);

  // const response = {
  //   status: "success",
  //   data: {
  //     token,
  //   },
  // };
  // res.status(200).send(response);
  await createSendToken(model, 200, res);
});

export const logout = cathAsync(async (req, res, next) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
});

export const protect = cathAsync(async (req, res, next) => {
  let token;

  // 1) Getting token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  // console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await userModel.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exists.",
        401
      )
    );
  }

  //4) Check if user changed password after the token(JWT) was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please login again.", 401)
    );
  }

  //grant access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// only for rendered pages, no errors!
export const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET_KEY
      );

      // 2) Check if user still exists
      const currentUser = await userModel.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      //3) Check if user changed password after the token(JWT) was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
          new AppError(
            "User recently changed password! Please login again.",
            401
          )
        );
      }

      //THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (error) {}
    return next();
  }
  next();
};

export const forgotPassword = cathAsync(async (req, res, next) => {
  // 1) Get user based on posted email
  const model = await userModel.findOne({ email: req.body.email });
  if (!model) {
    return next(new AppError("There is no user with email address", 404));
  }
  // 2) Generate the random reset token
  const resetToken = model.createPasswordResetToken(time);
  await model.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset-password/${resetToken}`;

    // const message = `Forgot your password? submit a PATCH request with your new password and confirm password to:\n ${resetUrl}.\nIf you have'nt request then ignore this email`;
    // await Email.sendEmail({
    //   email: model.email,
    //   subject: `Your reset password (Valid till ${time} minute)`,
    //   message: message,
    // });

    new Email(model, resetUrl).sendPasswordReset();

    const response = {
      status: "success",
      message: "Token sent to email!",
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    model.passwordResetToken = "undefined";
    model.passwordResetExpires = "undefined";
    await model.save({ validateBeforeSave: false });
    return next(
      new AppError("Something went wrong! Please try again later", 500)
    );
  }
});

export const resetPassword = cathAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const model = await userModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If user has not expired, and there is user, set new password
  if (!model) {
    return next(new AppError("Token has been expired", 400));
  }
  model.password = req.body.password;
  model.confirmPassword = req.body.confirmPassword;
  model.passwordResetToken = undefined;
  model.passwordResetExpires = undefined;
  await model.save();

  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in, send JWT
  const token = await signToken(model._id);

  const response = {
    status: "success",
    data: {
      token,
    },
  };
  res.status(200).send(response);
});

export const updatePassword = cathAsync(async (req, res, next) => {
  // 1) Get user from collection
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const model = await userModel.findById(req.user.id).select("+password");

  // 2) Check if posted current password is correct
  if (
    !model ||
    !(await model.correctPassword(currentPassword, model.password))
  ) {
    return next(new AppError("Please enter valid current password!", 401));
  }

  // 3) If so, update password
  model.password = newPassword;
  model.confirmPassword = confirmPassword;
  await model.save();
  //userModel.findByIdAndUpdate will not work as intended!

  // 4) Log the user in, send JWT

  // const token = await signToken(model._id);

  // const response = {
  //   status: "success",
  //   data: {
  //     token,
  //   },
  // };
  // res.status(200).send(response);
  await createSendToken(model, 200, res);
});
