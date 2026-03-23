import React, { useState, useEffect, useRef } from 'react';

export default function AddClientModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), company: company.trim(), notes: notes.trim() });
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 28, width: 400,
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Nuevo cliente</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--text3)',
            fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1,
          }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Nombre *">
            <input
              ref={inputRef}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Nombre del contacto"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </Field>
          <Field label="Empresa">
            <input
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Nombre de la empresa"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </Field>
          <Field label="Notas iniciales">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Descripción, sector, contexto..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </Field>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px', borderRadius: 'var(--radius)',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            color: 'var(--text2)', fontSize: '0.95rem', cursor: 'pointer',
          }}>Cancelar</button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            style={{
              flex: 1, padding: '10px', borderRadius: 'var(--radius)',
              background: name.trim() ? 'var(--accent)' : 'var(--bg4)',
              border: 'none', color: name.trim() ? '#fff' : 'var(--text3)',
              fontSize: '0.95rem', fontWeight: 500, cursor: name.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
            }}
          >
            Agregar cliente
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 6, fontWeight: 500 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '9px 12px',
  background: 'var(--bg3)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', color: 'var(--text)',
  fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.15s',
};
