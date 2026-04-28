import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export type LogoutProps = {
  onLogout?: () => void;
  className?: string;
};

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
