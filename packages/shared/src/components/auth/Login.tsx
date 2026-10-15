import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

/** Props accepted by {@link Login}. */
export type LoginProps = {
  /** Called after the credentials are accepted and the session has been refreshed. */
  onSuccess?: () => void;
  /** Extra class names applied to the root `<form>` element. */
  className?: string;
};

/**
 * Renders a minimal email/password sign-in form backed by {@link useAuth}.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * // Drop-in sign-in form, as used by the storefront/admin auth demos.
 * <Login className="max-w-sm" onSuccess={() => alert("Login success")} />
 * ```
 */
export function Login({ onSuccess, className }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      console.error('[shared/Login] login error', err);
      // keep minimal UI feedback; consuming app should provide nicer toast
      alert('Login failed. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <label>
        Email
        <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Log in'}</button>
    </form>
  );
}

export default Login;
