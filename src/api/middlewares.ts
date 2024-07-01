import { authenticate } from "@medusajs/medusa";
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  MiddlewaresConfig,
  User,
  UserService,
} from "@medusajs/medusa";
import cors from "cors";
import { adminCors } from "../util/cors";

const registerLoggedInUser = async (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  let loggedInUser: User | null = null;

  if (req.user && req.user.userId) {
    const userService = req.scope.resolve("userService") as UserService;
    loggedInUser = await userService.retrieve(req.user.userId);
  }

  req.scope.register({
    loggedInUser: {
      resolve: () => loggedInUser,
    },
  });

  next();
};

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher:
        /^\/admin\/(?!auth|analytics-config|users\/reset-password|users\/password-token|invites\/accept).*/, //TODO: check if we need these exceptions
      middlewares: [cors(adminCors), authenticate(), registerLoggedInUser],
    },
  ],
};
