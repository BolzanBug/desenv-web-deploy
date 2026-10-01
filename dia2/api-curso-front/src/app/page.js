'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TaskItem from '@/components/TaskItem';
import { api, SessionExpiredError } from '@/lib/api';
import { clearSession, getToken } from '@/lib/auth';
import styles from './page.module.css';

const FILTERS = [
  { id: 'all', label: 'Todas', empty: 'Nenhuma tarefa ainda. Escreva a primeira na linha acima.' },
  { id: 'pending', label: 'Pendentes', empty: 'Nada pendente. Tudo feito!' },
  { id: 'done', label: 'Feitas', empty: 'Nenhuma tarefa concluída ainda.' },
];

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  // Executa uma chamada à API; se o token expirou, volta para o login
  async function call(path, options) {
    try {
      return await api(path, options);
    } catch (err) {
      if (err instanceof SessionExpiredError) router.replace('/login');
      throw err;
    }
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }

    async function load() {
      try {
        const [me, list] = await Promise.all([call('/users/me'), call('/tasks')]);
        if (me.type === 'success') setUser(me.data);
        if (list.type === 'success') setTasks(list.data);
        else setError(list.message);
      } catch {
        // redirecionado para o login
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function replaceTask(updated) {
    setTasks((current) => current.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function handleCreate(event) {
    event.preventDefault();
    const text = title.trim();
    if (!text) return;

    setError('');
    const response = await call('/tasks/persist', { method: 'POST', body: { title: text } });
    if (response.type !== 'success') {
      setError(response.message);
      return;
    }
    setTasks((current) => [...current, response.data]);
    setTitle('');
  }

  async function handleToggle(task) {
    // Atualiza na hora; se a API recusar, desfaz
    replaceTask({ ...task, done: !task.done });
    const response = await call(`/tasks/persist/${task.id}`, {
      method: 'POST',
      body: { done: !task.done },
    });
    if (response.type === 'success') replaceTask(response.data);
    else {
      replaceTask(task);
      setError(response.message);
    }
  }

  async function handleRename(task, newTitle) {
    replaceTask({ ...task, title: newTitle });
    const response = await call(`/tasks/persist/${task.id}`, {
      method: 'POST',
      body: { title: newTitle },
    });
    if (response.type === 'success') replaceTask(response.data);
    else {
      replaceTask(task);
      setError(response.message);
    }
  }

  async function handleDelete(task) {
    const response = await call(`/tasks/${task.id}`, { method: 'DELETE' });
    if (response.type === 'success') {
      setTasks((current) => current.filter((t) => t.id !== task.id));
    } else {
      setError(response.message);
    }
  }

  function handleLogout() {
    clearSession();
    router.replace('/login');
  }

  const counts = {
    all: tasks?.length ?? 0,
    pending: tasks?.filter((t) => !t.done).length ?? 0,
    done: tasks?.filter((t) => t.done).length ?? 0,
  };

  const visible = (tasks ?? []).filter((t) => {
    if (filter === 'pending') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  const activeFilter = FILTERS.find((f) => f.id === filter);

  return (
    <main className="sheet">
      <header className={styles.header}>
        <div className={styles.account}>
          {user && <span>{user.name}</span>}
          <button type="button" className={styles.logout} onClick={handleLogout}>
            Sair
          </button>
        </div>
        <h1 className={`hand ${styles.title}`}>Minhas tarefas</h1>
      </header>

      <form className={styles.newTask} onSubmit={handleCreate}>
        <label htmlFor="new-task" className="visually-hidden">
          Nova tarefa
        </label>
        <input
          id="new-task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Escreva uma tarefa"
          maxLength={200}
          autoComplete="off"
        />
        <button type="submit" disabled={!title.trim()}>
          Adicionar
        </button>
      </form>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <nav className={styles.filters} aria-label="Filtrar tarefas">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            className={styles.filter}
            onClick={() => setFilter(f.id)}
          >
            {f.label} <span className={styles.count}>{counts[f.id]}</span>
          </button>
        ))}
      </nav>

      {tasks === null ? (
        <p className={styles.empty}>Carregando suas tarefas…</p>
      ) : visible.length === 0 ? (
        <p className={styles.empty}>{activeFilter.empty}</p>
      ) : (
        <ul className={styles.list}>
          {visible.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
