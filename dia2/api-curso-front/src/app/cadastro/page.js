import AuthForm from '@/components/AuthForm';

export const metadata = { title: 'Criar conta | Minhas tarefas' };

export default function CadastroPage() {
  return <AuthForm mode="cadastro" />;
}
