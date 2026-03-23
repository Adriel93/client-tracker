import React, { useState } from 'react';

export default function PSAList({ items, onAdd, onDelete, onUpdate }) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Add new PSA task */}
      <div style={{ padding: '14px 28px 0' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Agregar tarea PSA..."
            style={{
              flex: 1, padding: '8px 12px', borderRadius: 'var(--radius)',
              background: 'var(--bg3)', border: '1px solid var(--border)',
              color: 'var(--text)', fontSize: '0.95rem', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            onClick={handleAdd}
            disabled={!text.trim()}
            style={{
              padding: '8px 16px', borderRadius: 'var(--radius)',
              background: text.trim() ? 'var(--accent)' : 'var(--bg4)',
              color: text.trim() ? '#fff' : 'var(--text3)',
              border: 'none', fontSize: '0.95rem', fontWeight: 500,
              cursor: text.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Agregar
          </button>
        </div>
      </div>

      {/* PSA tasks list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 28px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '3rem 1rem', fontSize: '0.9rem' }}>
            No hay tareas PSA aún
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '12px 16px', borderRadius: 'var(--radius)',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                }}
              >
                <p style={{ fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}