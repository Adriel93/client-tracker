import React from 'react';
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
  onAddActivity, onUpdateActivity, onDeleteActivity,
  onAddPending, onTogglePending, onDeletePending, onUpdatePending,
  onAddPsa, onDeletePsa, onUpdatePsa,
}) {
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
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
              {client.name}
            </h2>
            {client.company && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginTop: 2 }}>{client.company}</p>
            )}
          </div>
          {client.notes && (
            <div style={{
              marginLeft: 'auto', maxWidth: 340,
              fontSize: '0.75rem', color: 'var(--text3)', lineHeight: 1.5,
              background: 'var(--bg3)', borderRadius: 'var(--radius-sm)',
              padding: '6px 12px', border: '1px solid var(--border)',
            }}>
              {client.notes}
            </div>
          )}
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
    </div>
  );
}
