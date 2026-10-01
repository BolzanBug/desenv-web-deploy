import AuthForm from '@/components/AuthForm';

export const metadata = { title: 'Entrar | Minhas tarefas' };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
