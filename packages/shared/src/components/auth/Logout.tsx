import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

/** Props accepted by {@link Logout}. */
export type LogoutProps = {
  /** Called after the backend session has been ended. */
  onLogout?: () => void;
  /** Extra class names applied to the root `<button>` element. */
  className?: string;
};

/**
 * Renders a button that ends the session through {@link useAuth}.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * // Sign-out control for an account menu.
 * <Logout className="text-sm" onLogout={() => router.push("/")} />
 * ```
 */
export function Logout({ onLogout, className }: LogoutProps) {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      onLogout?.();
    } catch (err) {
      console.error('[shared/Logout] logout error', err);
      alert('Logout failed. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className={className} onClick={handleLogout} disabled={loading}>
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}

export default Logout;
