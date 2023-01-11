import { Organization } from "@app/types/organization.type";
import { logout } from "mock-server/loginHandler";

export type Credentials = PasswordCredentials | TokenCredentials;

export interface PasswordCredentials {
  username: string;
  password: string;
}

export interface TokenCredentials {
  token: string;
  type: CredentialsType;
}

export type CredentialsType = "Bearer" | "Refresh";

export interface AuthResponse {
  type: CredentialsType;
  token: string;
  refreshToken: string;
  customClaims: Record<string, { name: string; url: string }[]>;
  links: {
    logout: string;
  };
}

export interface TokenResponse {
  exp: number;
  links: {
    logout: string;
  };
  token: string;
  type: string;
  customClaims: Record<string, { name: string; url: string }[]>;

}

export interface JWT {
  claims: Record<string, string>;
  organizations: Organization[];
  canChangePassword: boolean;
  logoutUrl?: string | undefined;
}
export interface BypassLoginCredentials {
  token: string;
  customClaims: object;
}

export interface ErrorResponse {
  status: number;
  data: AuthError;
}

// Looks like the `AuthError` is actually the union of two different types, but
// creating the correct type definitions requires some digging in different
// authentication flows.
export interface AuthError {
  code: ErrorCode;
  message?: string;
  errors?: [ErrorMessage];
}

export type ErrorCode =
  | "BAD_CREDENTIALS"
  | "BAD_MFA_CREDENTIALS"
  | "ACCOUNT_LOCKED"
  | "USER_INACTIVE"
  | "PASSWORD_EXPIRED"
  | "PINCODE_REQUIRED"
  | "UNKNOWN";

export interface ErrorMessage {
  error: string;
  field: string;
  resource: string;
}
