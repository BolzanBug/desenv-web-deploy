'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/auth';
import styles from './AuthForm.module.css';

// mode: 'login' | 'cadastro'
export default function AuthForm({ mode }) {
  const router = useRouter();
  const isSignup = mode === 'cadastro';
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = {
      email: form.get('email'),
      password: form.get('password'),
    };
    if (isSignup) body.name = form.get('name');

    setSending(true);
    setError('');
    const response = await api(isSignup ? '/users/persist' : '/users/login', {
      method: 'POST',
      body,
    });
    setSending(false);

    if (response.type !== 'success') {
      setError(response.message);
      return;
    }

    saveSession(response.token, response.data);
    router.replace('/');
  }

  return (
    <main className="sheet">
      <h1 className={`hand ${styles.title}`}>{isSignup ? 'Criar conta' : 'Entrar'}</h1>
      <p className={styles.lead}>
        {isSignup
          ? 'Crie sua conta para guardar suas tarefas.'
          : 'Entre para ver suas tarefas.'}
      </p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate={false}>
        {isSignup && (
          <label className={styles.field}>
            <span>Nome</span>
            <input name="name" type="text" autoComplete="name" required maxLength={100} />
          </label>
        )}
        <label className={styles.field}>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={255} />
        </label>
        <label className={styles.field}>
          <span>Senha</span>
          <input
            name="password"
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            required
            minLength={isSignup ? 6 : undefined}
          />
          {isSignup && <small>Pelo menos 6 caracteres.</small>}
        </label>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button className={styles.submit} type="submit" disabled={sending}>
          {sending ? 'Aguarde…' : isSignup ? 'Criar conta' : 'Entrar'}
        </button>
      </form>

      <p className={styles.switch}>
        {isSignup ? (
          <>
            Já tem conta? <Link href="/login">Entrar</Link>
          </>
        ) : (
          <>
            Ainda não tem conta? <Link href="/cadastro">Criar conta</Link>
          </>
        )}
      </p>
    </main>
  );
}
