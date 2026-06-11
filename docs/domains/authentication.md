# Authentication Domain

Status: Approved

Version: 1.0

## Purpose

Authentication verifies the identity of platform users.

Authentication is responsible for:

* Login
* Logout
* Access Token issuance
* Refresh Token issuance
* Password verification
* Session continuity

Authentication is not responsible for authorization.

Authorization belongs to the Identity Domain.

---

# Domain Invariants

The following invariants must always be true:

* Only Active users may authenticate.
* Inactive users cannot authenticate.
* Suspended users cannot authenticate.
* Passwords must never be stored in plain text.
* Access Tokens must be short-lived.
* Refresh Tokens must be revocable.
* Refresh Tokens must never be stored in plain text.
* Authentication events must be auditable.

---

# Authentication Flow

1. User submits email and password.
2. System verifies user status.
3. System verifies password hash.
4. System issues Access Token.
5. System issues Refresh Token.
6. Authentication events are published.

---

# Access Token

Purpose:

Provide short-lived authentication proof.

Properties:

* UserId
* Email
* Roles
* Branch Access Summary
* IssuedAt
* ExpiresAt

Rules:

* JWT format.
* Lifetime should be short.
* Must not contain sensitive data.
* Must not contain password hashes.
* Must be cryptographically signed.

Initial Lifetime:

15 minutes

---

# Refresh Token

Purpose:

Allow session continuation without requiring login.

Properties:

* TokenId
* UserId
* IssuedAt
* ExpiresAt
* RevokedAt

Rules:

* Must be securely stored.
* Must support revocation.
* Must support rotation.
* Must be auditable.

Initial Lifetime:

30 days

---

# Password Verification

Authentication must verify:

* Email
* PasswordHash

Rules:

* Argon2 verification.
* Constant-time verification.
* Passwords must never be logged.
* Failed authentication attempts must be auditable.

---

# Logout

Logout must:

* Revoke active refresh token.
* Emit audit event.

Access tokens naturally expire.

---

# Domain Events

Authentication publishes:

* LoginSucceeded
* LoginFailed
* LogoutSucceeded
* RefreshTokenIssued
* RefreshTokenRotated
* RefreshTokenRevoked

---

# Security Rules

* JWT secret must never be committed.
* Secrets must come from environment configuration.
* Refresh Tokens must be stored hashed.
* Tokens must use secure random generation.
* Authentication failures must not leak user existence.
* Error messages must be generic.

---

# Future Requirements

* MFA
* Google OAuth
* Microsoft OAuth
* SSO
* API Keys
* Machine Authentication
* Service Accounts
* AI Agent Authentication
