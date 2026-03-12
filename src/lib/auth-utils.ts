import { auth } from "../../auth";
import { ROLES } from "./constants";

/**
 * Ensures the current session belongs to an ADMIN.
 * Throws an error if unauthorized.
 * Use this at the top level of any admin-only Server Action.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== ROLES.ADMIN) {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}
