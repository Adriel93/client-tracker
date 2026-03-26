import React, { useState } from 'react';
import ActivityFeed from './ActivityFeed';
import PendingList from './PendingList';
import PSAList from './PSAList';

function getColor(id) {
  const colors = ['#7c6df0', '#4ade80', '#f472b6', '#60a5fa', '#fb923c', '#a78bfa', '#34d399'];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function ClientView({
  client, activities, pendingItems, psaItems,
  activeTab, onTabChange,
  onUpdateClient, onDeleteClient,
  onAddActivity, onUpdateActivity, onDeleteActivity,
  onAddPending, onTogglePending, onDeletePending, onUpdatePending,
  onAddPsa, onDeletePsa, onUpdatePsa,
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const color = getColor(client.id);
  const pendingCount = (pendingItems || []).filter(p => !p.done).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '18px 28px 0',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: color + '22', border: `2px solid ${color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 700, color,
            fontFamily: 'var(--font-mono)', letterSpacing: 1, flexShrink: 0,
          }}>
            {client.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
              {client.name}
            </h2>
            {client.company && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginTop: 2 }}>{client.company}</p>
            )}
          </div>
          {client.notes && (
            <div style={{
              maxWidth: 340,
              fontSize: '0.75rem', color: 'var(--text3)', lineHeight: 1.5,
              background: 'var(--bg3)', borderRadius: 'var(--radius-sm)',
              padding: '6px 12px', border: '1px solid var(--border)',
            }}>
              {client.notes}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button onClick={() => setShowEditModal(true)} style={{
              padding: '8px 14px', background: 'var(--accent)', color: '#fff', border: 'none',
              borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              ✎ Editar
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} style={{
              padding: '8px 14px', background: 'var(--warn)', color: '#fff', border: 'none',
              borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {[
            { id: 'activities', label: 'Actividades', count: activities.length },
            { id: 'pending', label: 'Pendientes', count: pendingCount, warn: pendingCount > 0 },
            { id: 'psa', label: 'PSA', count: psaItems.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                padding: '10px 18px', background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? 'var(--accent)' : 'transparent'}`,
                color: activeTab === tab.id ? 'var(--accent2)' : 'var(--text3)',
                fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 7,
                transition: 'color 0.15s', marginBottom: -1,
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  fontSize: '0.7rem', padding: '2px 7px', borderRadius: 10,
                  background: tab.warn ? 'var(--warn-bg)' : 'var(--bg3)',
                  color: tab.warn ? 'var(--warn)' : 'var(--text3)',
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'activities' && (
          <ActivityFeed
            activities={activities}
            onAddActivity={onAddActivity}
            onUpdateActivity={onUpdateActivity}
            onDeleteActivity={onDeleteActivity}
          />
        )}
        {activeTab === 'pending' && (
          <PendingList
            items={pendingItems}
            onAdd={onAddPending}
            onToggle={onTogglePending}
            onDelete={onDeletePending}
            onUpdate={onUpdatePending}
          />
        )}
        {activeTab === 'psa' && (
          <PSAList
            items={psaItems}
            onAdd={onAddPsa}
            onDelete={onDeletePsa}
            onUpdate={onUpdatePsa}
          />
        )}
      </div>

      {showEditModal && (
        <EditClientModal
          client={client}
          onSave={(changes) => {
            onUpdateClient(changes);
            setShowEditModal(false);
          }}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          clientName={client.name}
          onConfirm={() => {
            onDeleteClient();
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

function EditClientModal({ client, onSave, onClose }) {
  const [name, setName] = React.useState(client.name);
  const [company, setCompany] = React.useState(client.company || '');
  const [notes, setNotes] = React.useState(client.notes || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name: name.trim(), company: company.trim(), notes: notes.trim() });
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: 'var(--bg)', borderRadius: 'var(--radius)',
        padding: '28px', minWidth: 400, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
          Editar Cliente
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text3)', marginBottom: 6, display: 'block' }}>
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%', padding: '10px', background: 'var(--bg3)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                color: 'var(--text)', fontSize: '0.95rem', boxSizing: 'border-box',
              }}
              autoFocus
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text3)', marginBottom: 6, display: 'block' }}>
              Empresa
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{
                width: '100%', padding: '10px', background: 'var(--bg3)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                color: 'var(--text)', fontSize: '0.95rem', boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text3)', marginBottom: 6, display: 'block' }}>
              Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%', padding: '10px', background: 'var(--bg3)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                color: 'var(--text)', fontSize: '0.95rem', boxSizing: 'border-box',
                minHeight: 80, fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px', background: 'var(--bg3)', color: 'var(--text2)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.target.style.opacity = '0.8'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px', background: 'var(--accent)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ clientName, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: 'var(--bg)', borderRadius: 'var(--radius)',
        padding: '28px', minWidth: 360, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
          Eliminar Cliente
        </h2>
        <p style={{ color: 'var(--text3)', marginBottom: 24, fontSize: '0.95rem', lineHeight: 1.5 }}>
          ¿Estás seguro de que deseas eliminar a <strong>{clientName}</strong>? Esta acción no se puede deshacer y se eliminarán todas las actividades, tareas pendientes y PSA asociados.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px', background: 'var(--bg3)', color: 'var(--text2)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.8'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px', background: 'var(--warn)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-sm)',
              fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
