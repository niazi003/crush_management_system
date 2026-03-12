'use client';

import { useEffect, useState } from 'react';
import { Dispatch } from '@/src/types';
import { getDispatches, deleteDispatch } from '@/src/lib/dispatches';
import StatsCards from '@/src/components/StatsCards';
import DeleteModal from '@/src/components/DeleteModal';

export default function Dashboard() {
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getDispatches();
      setDispatches(data);
    } catch (err) {
      console.error('Failed to fetch dispatches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteDispatch(deleteId);
      setDispatches((prev) => prev.filter((d) => d.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  // Filter
  const filtered = dispatches.filter((d) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (d.buyer_name || '').toLowerCase().includes(s) ||
      (d.crush_type || '').toLowerCase().includes(s) ||
      (d.destination_city || '').toLowerCase().includes(s) ||
      (d.driver_name || '').toLowerCase().includes(s) ||
      (d.license_plate || '').toLowerCase().includes(s) ||
      (d.crush_plant || '').toLowerCase().includes(s)
    );
  });

  // Stats
  const totalDispatches = dispatches.length;
  const totalRevenue = dispatches.reduce((sum, d) => sum + (d.total_revenue || 0), 0);
  const totalProfit = dispatches.reduce((sum, d) => sum + (d.net_profit || 0), 0);
  const totalQuantity = dispatches.reduce((sum, d) => sum + (d.quantity || 0), 0);

  const stats = [
    { label: 'Total Dispatches', value: totalDispatches, icon: '📦', colorClass: 'violet' as const },
    { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString('en-PK')}`, icon: '💰', colorClass: 'teal' as const },
    { label: 'Net Profit', value: `Rs. ${totalProfit.toLocaleString('en-PK')}`, subValue: totalProfit >= 0 ? 'Profitable' : 'At Loss', icon: totalProfit >= 0 ? '📈' : '📉', colorClass: 'emerald' as const },
    { label: 'Total Quantity', value: totalQuantity.toLocaleString('en-PK'), icon: '🪨', colorClass: 'amber' as const },
  ];

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (val: number | null) => {
    if (val === null || val === undefined) return '—';
    return `Rs. ${val.toLocaleString('en-PK')}`;
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Overview of all crush dispatch records
        </p>
      </div>

      {/* Stats */}
      {!loading && <StatsCards stats={stats} />}

      {/* Search & Actions */}
      <div
        className="glass-card-static"
        style={{
          padding: 16,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--text-muted)' }}>🔍</span>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 40 }}
            placeholder="Search by buyer, type, city, driver, plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="glass-card-static" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Loading dispatches...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card-static" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>
            {search ? 'No results found' : 'No dispatches yet'}
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
            {search ? 'Try adjusting your search terms' : 'Add your first crush dispatch to get started'}
          </p>
          {!search && (
            <a href="/add" className="btn btn-primary">
              ＋ Add First Dispatch
            </a>
          )}
        </div>
      ) : (
        <div className="glass-card-static" style={{ overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Buyer</th>
                <th>Crush Type</th>
                <th>Qty</th>
                <th>Destination</th>
                <th className="hide-mobile">Vehicle</th>
                <th>Revenue</th>
                <th>Profit</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{formatDate(d.dispatch_date)}</td>
                  <td style={{ fontWeight: 600 }}>{d.buyer_name || '—'}</td>
                  <td>
                    <span className="badge badge-neutral">{d.crush_type || '—'}</span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{d.quantity ?? '—'}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{d.destination_city || '—'}</div>
                    {d.destination_area && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{d.destination_area}</div>}
                  </td>
                  <td className="hide-mobile">
                    <div style={{ fontSize: '0.85rem' }}>{d.license_plate || '—'}</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--teal)' }}>{formatCurrency(d.total_revenue)}</td>
                  <td>
                    <span
                      className={`badge ${(d.net_profit || 0) >= 0 ? 'badge-profit' : 'badge-loss'}`}
                    >
                      {formatCurrency(d.net_profit)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <a href={`/dispatch/${d.id}`} className="btn btn-ghost btn-icon" title="View Details" style={{ fontSize: 16 }}>👁️</a>
                      <a href={`/edit/${d.id}`} className="btn btn-ghost btn-icon" title="Edit" style={{ fontSize: 16 }}>✏️</a>
                      <button
                        className="btn btn-ghost btn-icon"
                        title="Delete"
                        style={{ fontSize: 16, color: 'var(--rose)' }}
                        onClick={() => setDeleteId(d.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
