import { Router } from "express";
import {
  signUp,
  signIn,
  logout,
  refreshAccessToken,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/signUp").post(signUp);
router.route("/signIn").post(signIn);
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
