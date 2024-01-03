import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";

const signUp = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError({ message: "All fileds are required", status: 400 });
  }

  const isExist = await User.findOne({ email });

  if (isExist) {
    throw new ApiError({ message: "user already existed", status: 400 });
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError({
      message: "something went wrong while registering the user",
      status: 500,
    });
  }

  res
    .status(200)
    .json(new ApiResponse(200, createdUser, "user registered succesfully"));
});

const signIn = asyncHandler(async (req, res) => {
  const { email, password }: { email: string; password: string } = req.body;

  if (!email) {
    throw new ApiError({ message: "email is required", status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError({ message: "user does not exist", status: 404 });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError({ message: "Invalid user credentials", status: 401 });
  }
});

export { signUp };
