import React, { useState } from 'react';

export default function PendingList({ items, onAdd, onToggle, onDelete, onUpdate }) {
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) onUpdate(id, editText.trim());
    setEditingId(null);
  };

  const pending = items.filter(i => !i.done);
  const done = items.filter(i => i.done);

  const filtered = filter === 'all' ? items : filter === 'pending' ? pending : done;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Stats bar */}
      <div style={{ padding: '14px 28px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
        {[
          { id: 'all', label: `Todos (${items.length})` },
          { id: 'pending', label: `Pendientes (${pending.length})`, warn: pending.length > 0 },
          { id: 'done', label: `Completados (${done.length})` },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '5px 12px', borderRadius: 20, border: '1px solid',
              borderColor: filter === f.id ? (f.warn ? 'var(--warn)' : 'var(--accent)') : 'var(--border)',
              background: filter === f.id ? (f.warn ? 'var(--warn-bg)' : 'var(--accent-bg)') : 'transparent',
              color: filter === f.id ? (f.warn ? 'var(--warn)' : 'var(--accent2)') : 'var(--text3)',
              fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s', fontWeight: 500,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 28px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '0.9rem', marginTop: 60 }}>
            {filter === 'all' ? 'Sin pendientes. ¡Todo está en orden!' :
             filter === 'pending' ? 'Sin elementos pendientes.' : 'Sin completados aún.'}
          </div>
        )}

        {filtered.map(item => (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '10px 12px', borderRadius: 'var(--radius)',
              border: '1px solid transparent', marginBottom: 4,
              borderColor: hoveredId === item.id ? 'var(--border)' : 'transparent',
              background: hoveredId === item.id ? 'var(--bg3)' : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            {/* Checkbox */}
            <button
              onClick={() => onToggle(item.id)}
              style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 2,
                border: `2px solid ${item.done ? 'var(--success)' : 'var(--border2)'}`,
                background: item.done ? 'var(--success-bg)' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              {item.done && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>

            {/* Content */}
            {editingId === item.id ? (
              <div style={{ flex: 1 }}>
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(item.id); } if (e.key === 'Escape') setEditingId(null); }}
                  rows={2}
                  autoFocus
                  style={{
                    width: '100%', background: 'var(--bg4)', border: '1px solid var(--accent)',
                    borderRadius: 6, color: 'var(--text)', fontSize: '0.95rem',
                    padding: '6px 10px', resize: 'none', outline: 'none',
                    fontFamily: 'var(--font)', lineHeight: 1.5,
                  }}
                />
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <button onClick={() => setEditingId(null)} style={btnSecondary}>Cancelar</button>
                  <button onClick={() => saveEdit(item.id)} style={btnPrimary}>Guardar</button>
                </div>
              </div>
            ) : (
              <p style={{
                flex: 1, fontSize: '0.95rem', lineHeight: 1.6,
                color: item.done ? 'var(--text3)' : 'var(--text)',
                textDecoration: item.done ? 'line-through' : 'none',
                whiteSpace: 'pre-wrap',
              }}>
                {item.text}
              </p>
            )}

            {/* Actions */}
            {hoveredId === item.id && editingId !== item.id && (
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <IconBtn onClick={() => startEdit(item)} title="Editar">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </IconBtn>
                <IconBtn onClick={() => onDelete(item.id)} title="Eliminar" danger>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6" /><path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                </IconBtn>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add input */}
      <div style={{ padding: '12px 28px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Agregar punto pendiente..."
            style={{
              flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: '0.95rem',
              padding: '10px 14px', outline: 'none', transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            onClick={handleAdd}
            disabled={!text.trim()}
            style={{
              padding: '10px 16px', borderRadius: 'var(--radius)',
              background: text.trim() ? 'var(--accent)' : 'var(--bg3)',
              border: 'none', color: text.trim() ? '#fff' : 'var(--text3)',
              fontSize: '0.9rem', fontWeight: 500,
              cursor: text.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            + Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border)',
        background: 'var(--bg3)', color: danger ? 'var(--danger)' : 'var(--text3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

const btnPrimary = {
  padding: '4px 10px', borderRadius: 5, border: 'none',
  background: 'var(--accent)', color: '#fff', fontSize: '0.8rem', cursor: 'pointer',
};
const btnSecondary = {
  padding: '4px 10px', borderRadius: 5, border: '1px solid var(--border)',
  background: 'var(--bg4)', color: 'var(--text2)', fontSize: '0.8rem', cursor: 'pointer',
};
