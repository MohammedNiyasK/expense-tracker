import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { isValidEmail } from "../utils";
import { verify } from "jsonwebtoken";

interface Token {
  _id: string;
}

const generateAccessAndRefreshTokens = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError({ message: "user not existed", status: 404 });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError({
      message:
        "something went wrong while generating access and refresh tokens",
      status: 500,
    });
  }
};

const signUp = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError({ message: "All fileds are required", status: 400 });
  }

  if (!isValidEmail(email)) {
    throw new ApiError({ message: "Invalid email format", status: 400 });
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

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User loggedIn Succesfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out succesfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError({ message: "unAuthorized request", status: 401 });
  }

  const decodedToken = verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as Token;

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError({ message: "Invalid refresh token", status: 401 });
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError({
      message: "Refresh token expired or used",
      status: 401,
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user?._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed"
      )
    );
});

export { signUp, signIn, logout, refreshAccessToken };
