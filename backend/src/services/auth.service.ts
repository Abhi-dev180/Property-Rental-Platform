import { v4 as uuidv4 } from "uuid";
import { supabaseAdmin } from "../config/supabase";
import { hashPassword, comparePassword } from "../utils/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} from "../utils/jwt";
import { env } from "../config/env";
import { PublicUser, User, UserRole } from "../types";

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    profile_image_url: user.profile_image_url,
    is_verified: user.is_verified,
  };
}



function refreshExpiryDate(): Date {
  const days = parseInt(env.jwtRefreshExpiresIn) || 7;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export async function registerUser(params: {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}) {
  const { fullName, email, password, role, phone } = params;

  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (existing) {
    throw Object.assign(new Error("An account with this email already exists."), {
      statusCode: 409,
    });
  }

  const passwordHash = await hashPassword(password);

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .insert({
      full_name: fullName,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      role,
      phone: phone ?? null,
    })
    .select()
    .single();

  if (error || !user) {
    throw Object.assign(new Error(error?.message ?? "Failed to create user."), {
      statusCode: 500,
    });
  }

  return issueSession(user as User);
}

export async function loginUser(email: string, password: string) {
  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error || !user) {
    throw Object.assign(new Error("Invalid email or password."), { statusCode: 401 });
  }

  if (user.is_suspended) {
    throw Object.assign(new Error("This account has been suspended."), {
      statusCode: 403,
    });
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    throw Object.assign(new Error("Invalid email or password."), { statusCode: 401 });
  }

  return issueSession(user as User);
}

async function issueSession(user: User) {
  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refreshToken = signRefreshToken(user.id);

  await supabaseAdmin.from("refresh_tokens").insert({
    id: uuidv4(),
    user_id: user.id,
    token_hash: hashToken(refreshToken),
    expires_at: refreshExpiryDate().toISOString(),
  });

  return { user: toPublicUser(user), accessToken, refreshToken };
}

export async function rotateRefreshToken(oldRefreshToken: string) {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(oldRefreshToken);
  } catch {
    throw Object.assign(new Error("Invalid or expired refresh token."), { statusCode: 401 });
  }

  const oldHash = hashToken(oldRefreshToken);
  const { data: stored } = await supabaseAdmin
    .from("refresh_tokens")
    .select("*")
    .eq("token_hash", oldHash)
    .eq("revoked", false)
    .maybeSingle();

  if (!stored) {
    throw Object.assign(new Error("Refresh token not recognized or already used."), {
      statusCode: 401,
    });
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", payload.sub)
    .maybeSingle();

  if (!user || user.is_suspended) {
    throw Object.assign(new Error("Account not available."), { statusCode: 403 });
  }

  await supabaseAdmin.from("refresh_tokens").update({ revoked: true }).eq("id", stored.id);

  return issueSession(user as User);
}

export async function logoutUser(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);
  await supabaseAdmin
    .from("refresh_tokens")
    .update({ revoked: true })
    .eq("token_hash", tokenHash);
}

export async function requestPasswordReset(email: string) {
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user) return; // don't reveal whether the email exists

  const resetToken = uuidv4();
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);

  await supabaseAdmin.from("password_reset_tokens").insert({
    id: uuidv4(),
    user_id: user.id,
    token_hash: hashToken(resetToken),
    expires_at: expires.toISOString(),
  });

  // We'll wire this to real email sending in Part 11. For now, log it so you can test.
  console.log(`Password reset token for ${email}: ${resetToken}`);
  return resetToken;
}

export async function resetPassword(token: string, newPassword: string) {
  const tokenHash = hashToken(token);
  const { data: record } = await supabaseAdmin
    .from("password_reset_tokens")
    .select("*")
    .eq("token_hash", tokenHash)
    .eq("used", false)
    .maybeSingle();

  if (!record || new Date(record.expires_at) < new Date()) {
    throw Object.assign(new Error("Reset link is invalid or has expired."), {
      statusCode: 400,
    });
  }

  const passwordHash = await hashPassword(newPassword);
  await supabaseAdmin
    .from("users")
    .update({ password_hash: passwordHash })
    .eq("id", record.user_id);

  await supabaseAdmin
    .from("password_reset_tokens")
    .update({ used: true })
    .eq("id", record.id);

  await supabaseAdmin
    .from("refresh_tokens")
    .update({ revoked: true })
    .eq("user_id", record.user_id);
}