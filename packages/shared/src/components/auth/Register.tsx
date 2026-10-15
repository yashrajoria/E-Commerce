import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

/** Props accepted by {@link Register}. */
export type RegisterProps = {
  /** Called after the account is created and the session has been refreshed. */
  onSuccess?: () => void;
  /** Extra class names applied to the root `<form>` element. */
  className?: string;
};

/**
 * Renders a minimal email/password registration form backed by {@link useAuth}.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * // Drop-in registration form; the confirm-password field is validated client-side.
 * <Register className="max-w-sm" onSuccess={() => alert("Register success")} />
 * ```
 */
export function Register({ onSuccess, className }: RegisterProps) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      onSuccess?.();
    } catch (err) {
      console.error('[shared/Register] register error', err);
      alert('Registration failed. See console for details.');
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
      <label>
        Confirm password
        <input name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </label>
      <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
    </form>
  );
}

export default Register;
