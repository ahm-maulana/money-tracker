import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginInput, RegisterInput } from "../validation/auth.validation";
import { ResponseUtil } from "../utils/response.util";
import { config } from "../config/config";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const registerData = req.body as RegisterInput;
    const user = await this.authService.register(registerData);
    ResponseUtil.success(res, user, "User create successfully.", 201);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const loginData = req.body as LoginInput;

    const authenticatedUser = await this.authService.login(loginData);

    // Set refresh token as httpOnly cookie
    res.cookie("jwt", authenticatedUser.token.refreshToken, {
      httpOnly: true,
      maxAge: config.jwt.refresh.expiresIn * 1000,
    });

    ResponseUtil.success(
      res,
      {
        user: authenticatedUser.user,
        token: authenticatedUser.token.accessToken,
      },
      "Login successfully."
    );
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const cookies = req.cookies as { jwt: string };

    if (!cookies.jwt) {
      ResponseUtil.error(res, "Refresh token is required", 401);
    }

    const token = await this.authService.refresh(cookies.jwt);

    // Set refresh token as httpOnly cookie
    res.cookie("jwt", token.refreshToken, {
      httpOnly: true,
      maxAge: config.jwt.refresh.expiresIn * 1000,
    });

    ResponseUtil.success(res, {
      token: token.accessToken,
    });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const cookies = req.cookies as { jwt: string };

    if (cookies.jwt) {
      await this.authService.logout(cookies.jwt);
    }

    // Clear httpOnly cookie
    res.clearCookie("jwt", {
      httpOnly: true,
    });

    ResponseUtil.success(res, null, "Logged out successfully.");
  };
}
