'use client';

import { useState } from 'react';
import styles from './TaskItem.module.css';

const doneAtFormat = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export default function TaskItem({ task, onToggle, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  function startEditing() {
    setDraft(task.title);
    setEditing(true);
  }

  async function finishEditing() {
    setEditing(false);
    const title = draft.trim();
    if (title && title !== task.title) await onRename(task, title);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') event.currentTarget.blur();
    if (event.key === 'Escape') {
      setDraft(task.title);
      setEditing(false);
    }
  }

  const checkboxId = `task-${task.id}`;

  return (
    <li className={`${styles.item} ${task.done ? styles.done : ''}`}>
      <input
        id={checkboxId}
        className={styles.check}
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task)}
        aria-label={task.done ? `Marcar "${task.title}" como pendente` : `Concluir "${task.title}"`}
      />

      <div className={styles.body}>
        {editing ? (
          <input
            className={styles.editInput}
            value={draft}
            maxLength={200}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            aria-label="Editar tarefa"
            autoFocus
          />
        ) : (
          <button
            type="button"
            className={styles.title}
            onClick={startEditing}
            title="Clique para editar"
          >
            <span className={styles.titleText}>{task.title}</span>
          </button>
        )}
        {task.done && task.done_at && (
          <span className={styles.doneAt}>
            feita em {doneAtFormat.format(new Date(task.done_at))}
          </span>
        )}
      </div>

      <button type="button" className={styles.delete} onClick={() => onDelete(task)}>
        Apagar<span className="visually-hidden"> &quot;{task.title}&quot;</span>
      </button>
    </li>
  );
}
