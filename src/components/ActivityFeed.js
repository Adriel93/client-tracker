import React, { useState, useRef, useEffect } from 'react';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function formatDateForInput(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function groupByDate(activities) {
  const groups = {};
  activities.forEach(a => {
    const key = new Date(a.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(a);
  });
  return groups;
}

export default function ActivityFeed({ activities, onAddActivity, onUpdateActivity, onDeleteActivity }) {
  const [text, setText] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const bottomRef = useRef();
  const textareaRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activities.length]);

  const handleSend = () => {
    if (!text.trim()) return;
    const date = useCustomDate && customDate ? new Date(customDate).toISOString() : new Date().toISOString();
    onAddActivity(text.trim(), date);
    setText('');
    setCustomDate('');
    setUseCustomDate(false);
  };

  const startEdit = (activity) => {
    setEditingId(activity.id);
    setEditText(activity.text);
    setEditDate(formatDateForInput(activity.date));
  };

  const saveEdit = (id) => {
    const changes = { text: editText };
    if (editDate) changes.date = new Date(editDate).toISOString();
    onUpdateActivity(id, changes);
    setEditingId(null);
  };

  const groups = groupByDate(activities);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
        {activities.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '0.85rem', marginTop: 60 }}>
            <p>Sin actividades registradas.</p>
            <p style={{ marginTop: 4, fontSize: '0.78rem' }}>Escribe abajo para agregar la primera.</p>
          </div>
        )}

        {Object.entries(groups).map(([date, items]) => (
          <div key={date}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 16px' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text3)', whiteSpace: 'nowrap', fontWeight: 500 }}>{date}</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {items.map(activity => (
              <div
                key={activity.id}
                onMouseEnter={() => setHoveredId(activity.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}
              >
                {editingId === activity.id ? (
                  <div style={{ flex: 1, background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--accent)', padding: 14 }}>
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%', background: 'transparent', border: 'none',
                        color: 'var(--text)', fontSize: '0.875rem', resize: 'vertical',
                        outline: 'none', lineHeight: 1.6, fontFamily: 'var(--font)',
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Fecha:</label>
                      <input
                        type="datetime-local"
                        value={editDate}
                        onChange={e => setEditDate(e.target.value)}
                        style={{
                          background: 'var(--bg4)', border: '1px solid var(--border)',
                          borderRadius: 4, color: 'var(--text)', fontSize: '0.8rem', padding: '3px 8px', outline: 'none',
                        }}
                      />
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                        <button onClick={() => setEditingId(null)} style={btnStyleSecondary}>Cancelar</button>
                        <button onClick={() => saveEdit(activity.id)} style={btnStylePrimary}>Guardar</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        background: 'var(--bg3)', borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)', padding: '12px 14px',
                        transition: 'border-color 0.15s',
                        borderColor: hoveredId === activity.id ? 'var(--border2)' : 'var(--border)',
                      }}>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                          {activity.text}
                        </p>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 5, paddingLeft: 4 }}>
                        {formatDate(activity.date)}
                      </p>
                    </div>

                    {hoveredId === activity.id && (
                      <div style={{ display: 'flex', gap: 4, paddingTop: 10, flexShrink: 0 }}>
                        <IconBtn title="Editar" onClick={() => startEdit(activity)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </IconBtn>
                        <IconBtn title="Eliminar" onClick={() => onDeleteActivity(activity.id)} danger>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6" /><path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                          </svg>
                        </IconBtn>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ padding: '12px 28px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        {useCustomDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Fecha personalizada:</label>
            <input
              type="datetime-local"
              value={customDate}
              onChange={e => setCustomDate(e.target.value)}
              style={{
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 4, color: 'var(--text)', fontSize: '0.8rem',
                padding: '4px 8px', outline: 'none',
              }}
            />
            <button onClick={() => { setUseCustomDate(false); setCustomDate(''); }} style={{ ...btnStyleSecondary, fontSize: '0.75rem' }}>
              Usar ahora
            </button>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            placeholder="Escribe una actividad... (Enter para enviar, Shift+Enter nueva línea)"
            rows={2}
            style={{
              flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: '0.95rem',
              padding: '10px 14px', resize: 'none', outline: 'none',
              lineHeight: 1.55, fontFamily: 'var(--font)', transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => setUseCustomDate(!useCustomDate)}
              title="Establecer fecha personalizada"
              style={{
                width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                background: useCustomDate ? 'var(--accent-bg)' : 'var(--bg3)',
                border: `1px solid ${useCustomDate ? 'var(--accent)' : 'var(--border)'}`,
                color: useCustomDate ? 'var(--accent2)' : 'var(--text3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </button>
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              style={{
                width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                background: text.trim() ? 'var(--accent)' : 'var(--bg3)',
                border: 'none', color: text.trim() ? '#fff' : 'var(--text3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: text.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.15s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
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
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg4)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {children}
    </button>
  );
}

const btnStylePrimary = {
  padding: '5px 12px', borderRadius: 6, border: 'none',
  background: 'var(--accent)', color: '#fff', fontSize: '0.82rem', cursor: 'pointer',
};
const btnStyleSecondary = {
  padding: '5px 12px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg4)', color: 'var(--text2)', fontSize: '0.82rem', cursor: 'pointer',
};
