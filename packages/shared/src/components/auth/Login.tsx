import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export type LoginProps = {
  onSuccess?: () => void;
  className?: string;
};

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
