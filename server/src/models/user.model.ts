import { Schema, model, Document } from "mongoose";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  refreshToken?: string | null | undefined;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: function (value: string) {
          return /^(?=.*[A-Z])(?=.*[!@#$%^&*])(.{8,})$/.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid password. It should have at least 8 characters with 1 uppercase letter and 1 special character.`,
      },
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await hash(this.password, 10);
  next();
});

userSchema.pre("save", function (next) {
  this.email = this.email.toLowerCase();
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = model("User", userSchema);
