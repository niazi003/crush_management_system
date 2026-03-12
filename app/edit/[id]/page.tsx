'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DispatchInsert } from '@/src/types';
import { getDispatch, updateDispatch } from '@/src/lib/dispatches';
import DispatchForm from '@/src/components/DispatchForm';

export default function EditDispatchPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<Partial<DispatchInsert> | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDispatch = async () => {
      try {
        const data = await getDispatch(id);
        if (data) {
          // Extract only the editable fields
          const { id: _id, total_cost: _tc, total_revenue: _tr, net_profit: _np, created_at: _ca, ...editable } = data;
          setInitialData(editable);
        }
      } catch (err) {
        console.error('Error fetching dispatch:', err);
        setError('Failed to load dispatch data');
      } finally {
        setFetching(false);
      }
    };

    fetchDispatch();
  }, [id]);

  const handleSubmit = async (formData: DispatchInsert) => {
    try {
      setLoading(true);
      setError(null);
      await updateDispatch(id, formData);
      router.push('/');
    } catch (err: unknown) {
      console.error('Error updating dispatch:', err);
      setError(err instanceof Error ? err.message : 'Failed to update dispatch');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto', padding: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
        <div style={{ color: 'var(--text-secondary)' }}>Loading dispatch data...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <a href="/" style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          ← Back to Dashboard
        </a>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
          Edit Dispatch
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Update the dispatch record details
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '14px 20px',
            background: 'var(--rose-glow)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--rose)',
            fontSize: '0.9rem',
            marginBottom: 24,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <div className="glass-card-static" style={{ padding: 32 }}>
        {initialData && (
          <DispatchForm
            initialData={initialData}
            onSubmit={handleSubmit}
            submitLabel="Update Dispatch"
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
