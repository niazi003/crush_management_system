'use client';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Dispatch',
  message = 'Are you sure you want to delete this dispatch record? This action cannot be undone.',
  loading = false,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-card-static"
        style={{ padding: 32, maxWidth: 420, width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--rose-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            margin: '0 auto 20px',
          }}
        >
          ⚠️
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, textAlign: 'center', marginBottom: 8, color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, marginBottom: 28 }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn btn-ghost"
            style={{ flex: 1 }}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            style={{ flex: 1 }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
