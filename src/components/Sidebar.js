import React from 'react';

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function getColor(id) {
  const colors = ['#7c6df0', '#4ade80', '#f472b6', '#60a5fa', '#fb923c', '#a78bfa', '#34d399'];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function Sidebar({ clients, activities, pendingItems, selectedClientId, onSelectClient, onAddClient, onDeleteClient }) {
  return (
    <aside style={{
      width: 'var(--sidebar)', minWidth: 'var(--sidebar)',
      background: 'var(--bg2)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
    }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
              Client Tracker
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: 2 }}>
              {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}
            </p>
          </div>
          <button
            onClick={onAddClient}
            title="Agregar cliente"
            style={{
              width: 32, height: 32, borderRadius: 'var(--radius-sm)',
              background: 'var(--accent)', border: 'none',
              color: '#fff', fontSize: '1.2rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
        {clients.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '0.8rem', padding: '2rem 1rem' }}>
            Sin clientes aún. Haz clic en + para agregar.
          </div>
        ) : (
          clients.map(client => {
            const actCount = (activities[client.id] || []).length;
            const pendCount = (pendingItems[client.id] || []).filter(p => !p.done).length;
            const color = getColor(client.id);
            const isSelected = selectedClientId === client.id;

            return (
              <div
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', borderRadius: 'var(--radius)',
                  cursor: 'pointer', marginBottom: 2,
                  background: isSelected ? 'var(--accent-bg2)' : 'transparent',
                  border: `1px solid ${isSelected ? 'var(--accent)' : 'transparent'}`,
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: color + '22', border: `1.5px solid ${color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 600, color, flexShrink: 0,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {getInitials(client.name)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {client.name}
                  </p>
                  {client.company && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {client.company}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                  {actCount > 0 && (
                    <span style={{ fontSize: '0.7rem', background: 'var(--bg4)', color: 'var(--text3)', borderRadius: 4, padding: '1px 5px' }}>
                      {actCount}
                    </span>
                  )}
                  {pendCount > 0 && (
                    <span style={{ fontSize: '0.7rem', background: 'var(--warn-bg)', color: 'var(--warn)', borderRadius: 4, padding: '1px 5px' }}>
                      {pendCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
