'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Dispatch } from '@/src/types';
import { getDispatch, deleteDispatch } from '@/src/lib/dispatches';
import DeleteModal from '@/src/components/DeleteModal';

export default function DispatchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [dispatch, setDispatch] = useState<Dispatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDispatch(id);
        setDispatch(data);
      } catch (err) {
        console.error('Error fetching dispatch:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteDispatch(id);
      router.push('/');
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-PK', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatCurrency = (val: number | null) => {
    if (val === null || val === undefined) return '—';
    return `Rs. ${val.toLocaleString('en-PK')}`;
  };

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto', padding: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
        <div style={{ color: 'var(--text-secondary)' }}>Loading dispatch details...</div>
      </div>
    );
  }

  if (!dispatch) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto', padding: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😶</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>Dispatch Not Found</div>
        <a href="/" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Dashboard</a>
      </div>
    );
  }

  const d = dispatch;

  const DetailItem = ({ label, value, color }: { label: string; value: string | number | null; color?: string }) => (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: '1rem', fontWeight: 500, color: color || 'var(--text-primary)' }}>
        {value ?? '—'}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <a href="/" style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            ← Back to Dashboard
          </a>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
            Dispatch Details
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            {formatDate(d.dispatch_date)} · {d.buyer_name || 'Unknown Buyer'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href={`/edit/${d.id}`} className="btn btn-primary btn-sm">✏️ Edit</a>
          <button className="btn btn-danger btn-sm" onClick={() => setShowDelete(true)}>🗑️ Delete</button>
        </div>
      </div>

      {/* Financial Summary Bar */}
      <div
        className="glass-card-static stagger-children"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 0,
          marginBottom: 24,
          overflow: 'hidden',
        }}
      >
        {[
          { label: 'Total Cost', value: formatCurrency(d.total_cost), color: 'var(--amber)' },
          { label: 'Total Revenue', value: formatCurrency(d.total_revenue), color: 'var(--teal)' },
          { label: 'Net Profit', value: formatCurrency(d.net_profit), color: (d.net_profit || 0) >= 0 ? 'var(--emerald)' : 'var(--rose)' },
        ].map((item, i) => (
          <div key={i} style={{ padding: '20px 24px', borderRight: i < 2 ? '1px solid var(--border-color)' : 'none' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Detail Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Dispatch Info */}
        <div className="glass-card-static" style={{ padding: 24 }}>
          <div className="section-title">📋 Dispatch Info</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <DetailItem label="Dispatch Date" value={formatDate(d.dispatch_date)} />
            <DetailItem label="Buyer Name" value={d.buyer_name} />
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="glass-card-static" style={{ padding: 24 }}>
          <div className="section-title">🚛 Vehicle Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <DetailItem label="Vehicle Type" value={d.vehicle_type} />
            <DetailItem label="License Plate" value={d.license_plate} />
            <DetailItem label="Vehicle Owner" value={d.vehicle_owner} />
            <DetailItem label="Driver Name" value={d.driver_name} />
            <DetailItem label="Driver Contact" value={d.driver_contact} />
            <DetailItem label="Owner is Driver" value={d.is_owner_driver ? 'Yes' : 'No'} />
          </div>
        </div>

        {/* Crush Details */}
        <div className="glass-card-static" style={{ padding: 24 }}>
          <div className="section-title">🪨 Crush Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <DetailItem label="Crush Plant" value={d.crush_plant} />
            <DetailItem label="Crush Type" value={d.crush_type} />
            <DetailItem label="Crush Quality" value={d.crush_quality} />
            <DetailItem label="Quantity" value={d.quantity} />
          </div>
        </div>

        {/* Destination */}
        <div className="glass-card-static" style={{ padding: 24 }}>
          <div className="section-title">📍 Destination</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <DetailItem label="City" value={d.destination_city} />
            <DetailItem label="Area" value={d.destination_area} />
          </div>
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="glass-card-static" style={{ padding: 24, marginBottom: 24 }}>
        <div className="section-title">💰 Financial Breakdown</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 18 }}>
          <DetailItem label="Purchase Rate" value={formatCurrency(d.purchase_rate)} />
          <DetailItem label="Transport Fare" value={formatCurrency(d.transport_fare)} />
          <DetailItem label="Other Expenses" value={formatCurrency(d.other_expenses)} />
          <DetailItem label="Selling Rate" value={formatCurrency(d.selling_rate)} />
        </div>
      </div>

      <DeleteModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
