'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DispatchInsert } from '@/src/types';
import { createDispatch } from '@/src/lib/dispatches';
import DispatchForm from '@/src/components/DispatchForm';

export default function AddDispatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: DispatchInsert) => {
    try {
      setLoading(true);
      setError(null);
      await createDispatch(data);
      router.push('/');
    } catch (err: unknown) {
      console.error('Error creating dispatch:', err);
      setError(err instanceof Error ? err.message : 'Failed to create dispatch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <a href="/" style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          ← Back to Dashboard
        </a>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
          Add New Dispatch
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Fill in the details to record a new crush dispatch
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
        <DispatchForm onSubmit={handleSubmit} submitLabel="Create Dispatch" loading={loading} />
      </div>
    </div>
  );
}
