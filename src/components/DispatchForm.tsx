'use client';

import { useState, useEffect } from 'react';
import { DispatchInsert } from '../types';

type FareMode = 'fixed' | 'per_quantity';

interface DispatchFormProps {
  initialData?: Partial<DispatchInsert>;
  onSubmit: (data: DispatchInsert) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
}

const emptyForm: DispatchInsert = {
  dispatch_date: new Date().toISOString().split('T')[0],
  buyer_name: '',
  vehicle_type: '',
  license_plate: '',
  vehicle_owner: '',
  driver_name: '',
  driver_contact: '',
  is_owner_driver: false,
  crush_plant: '',
  crush_type: '',
  crush_quality: '',
  quantity: null,
  destination_city: '',
  destination_area: '',
  purchase_rate: null,
  transport_fare: null,
  other_expenses: 0,
  selling_rate: null,
};

export default function DispatchForm({ initialData, onSubmit, submitLabel = 'Save Dispatch', loading = false }: DispatchFormProps) {
  const [form, setForm] = useState<DispatchInsert>({ ...emptyForm, ...initialData });

  // Fare calculation mode: 'fixed' = enter total directly, 'per_quantity' = rate × quantity
  const [fareMode, setFareMode] = useState<FareMode>('fixed');
  // Per-quantity fare rate (UI-only, not stored in DB)
  const [perQuantityRate, setPerQuantityRate] = useState<number | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
      // Try to infer fare mode from existing data when editing
      if (initialData.transport_fare && initialData.quantity && initialData.quantity > 0) {
        const inferredRate = initialData.transport_fare / initialData.quantity;
        // If the rate is a reasonable number (not fractionally weird), assume per_quantity mode
        // But default to fixed since that's the simpler path
      }
    }
  }, [initialData]);

  const set = (field: keyof DispatchInsert, value: string | number | boolean | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // When in per_quantity mode, auto-calculate transport_fare whenever rate or quantity changes
  useEffect(() => {
    if (fareMode === 'per_quantity' && perQuantityRate !== null) {
      const qty = form.quantity || 0;
      const calculatedFare = Math.round(perQuantityRate * qty * 100) / 100; // round to 2 decimals
      setForm((prev) => ({ ...prev, transport_fare: calculatedFare }));
    }
  }, [fareMode, perQuantityRate, form.quantity]);

  const handleFareModeChange = (mode: FareMode) => {
    setFareMode(mode);
    if (mode === 'fixed') {
      // Keep the current transport_fare value, clear per-quantity rate
      setPerQuantityRate(null);
    } else {
      // Switching to per_quantity: try to calculate rate from existing fare
      if (form.transport_fare && form.quantity && form.quantity > 0) {
        setPerQuantityRate(Math.round((form.transport_fare / form.quantity) * 100) / 100);
      } else {
        setPerQuantityRate(null);
        setForm((prev) => ({ ...prev, transport_fare: null }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  // Live calculations
  const qty = form.quantity || 0;
  const purchaseRate = form.purchase_rate || 0;
  const transportFare = form.transport_fare || 0;
  const otherExpenses = form.other_expenses || 0;
  const sellingRate = form.selling_rate || 0;

  const totalCost = qty * purchaseRate + transportFare;
  const totalRevenue = qty * sellingRate;
  const netProfit = totalRevenue - totalCost - otherExpenses;

  const sectionStyle: React.CSSProperties = {
    marginBottom: 32,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 16,
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Dispatch Info */}
      <div style={sectionStyle}>
        <div className="section-title">📋 Dispatch Info</div>
        <div style={gridStyle}>
          <div className="form-group">
            <label className="form-label">Dispatch Date</label>
            <input
              type="date"
              className="form-input"
              value={form.dispatch_date || ''}
              onChange={(e) => set('dispatch_date', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Buyer Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter buyer name"
              value={form.buyer_name || ''}
              onChange={(e) => set('buyer_name', e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div style={sectionStyle}>
        <div className="section-title">🚛 Vehicle Details</div>
        <div style={gridStyle}>
          <div className="form-group">
            <label className="form-label">Vehicle Type</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Truck, Trailer"
              value={form.vehicle_type || ''}
              onChange={(e) => set('vehicle_type', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">License Plate</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. ABC-1234"
              value={form.license_plate || ''}
              onChange={(e) => set('license_plate', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Vehicle Owner</label>
            <input
              type="text"
              className="form-input"
              placeholder="Owner name"
              value={form.vehicle_owner || ''}
              onChange={(e) => set('vehicle_owner', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Driver Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Driver name"
              value={form.driver_name || ''}
              onChange={(e) => set('driver_name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Driver Contact</label>
            <input
              type="text"
              className="form-input"
              placeholder="Phone number"
              value={form.driver_contact || ''}
              onChange={(e) => set('driver_contact', e.target.value)}
            />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 24 }}>
            <div
              className={`toggle-switch ${form.is_owner_driver ? 'active' : ''}`}
              onClick={() => set('is_owner_driver', !form.is_owner_driver)}
            />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Owner is the Driver
            </span>
          </div>
        </div>
      </div>

      {/* Crush Details */}
      <div style={sectionStyle}>
        <div className="section-title">🪨 Crush Details</div>
        <div style={gridStyle}>
          <div className="form-group">
            <label className="form-label">Crush Plant</label>
            <input
              type="text"
              className="form-input"
              placeholder="Plant name"
              value={form.crush_plant || ''}
              onChange={(e) => set('crush_plant', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Crush Type</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Stone, Gravel"
              value={form.crush_type || ''}
              onChange={(e) => set('crush_type', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Crush Quality</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Grade A, B"
              value={form.crush_quality || ''}
              onChange={(e) => set('crush_quality', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              step="any"
              value={form.quantity ?? ''}
              onChange={(e) => set('quantity', e.target.value ? parseFloat(e.target.value) : null)}
              required
            />
          </div>
        </div>
      </div>

      {/* Destination */}
      <div style={sectionStyle}>
        <div className="section-title">📍 Destination</div>
        <div style={gridStyle}>
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-input"
              placeholder="Destination city"
              value={form.destination_city || ''}
              onChange={(e) => set('destination_city', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Area</label>
            <input
              type="text"
              className="form-input"
              placeholder="Destination area"
              value={form.destination_area || ''}
              onChange={(e) => set('destination_area', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Financials */}
      <div style={sectionStyle}>
        <div className="section-title">💰 Financials</div>
        <div style={gridStyle}>
          <div className="form-group">
            <label className="form-label">Purchase Rate (per unit)</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              step="any"
              value={form.purchase_rate ?? ''}
              onChange={(e) => set('purchase_rate', e.target.value ? parseFloat(e.target.value) : null)}
              required
            />
          </div>

          {/* Transport Fare — with mode selector */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Transport Fare</label>
            <div className="fare-mode-selector" style={{ marginBottom: 12 }}>
              <button
                type="button"
                className={`fare-mode-tab ${fareMode === 'fixed' ? 'active' : ''}`}
                onClick={() => handleFareModeChange('fixed')}
              >
                💵 Fixed Total
              </button>
              <button
                type="button"
                className={`fare-mode-tab ${fareMode === 'per_quantity' ? 'active' : ''}`}
                onClick={() => handleFareModeChange('per_quantity')}
              >
                📦 Per Quantity
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: fareMode === 'per_quantity' ? 'repeat(auto-fill, minmax(200px, 1fr))' : '1fr',
              gap: 12,
              alignItems: 'end',
            }}>
              {fareMode === 'fixed' ? (
                /* Fixed total fare input */
                <div>
                  <label className="form-label" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Transport Fare</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Enter total fare"
                    step="any"
                    value={form.transport_fare ?? ''}
                    onChange={(e) => set('transport_fare', e.target.value ? parseFloat(e.target.value) : null)}
                    required
                  />
                </div>
              ) : (
                /* Per-quantity fare inputs */
                <>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Fare per Unit (Rate)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Rate per unit"
                      step="any"
                      value={perQuantityRate ?? ''}
                      onChange={(e) => setPerQuantityRate(e.target.value ? parseFloat(e.target.value) : null)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Quantity</label>
                    <input
                      type="number"
                      className="form-input"
                      value={form.quantity ?? ''}
                      disabled
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Calculated Fare</label>
                    <div
                      className="form-input"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(20, 184, 166, 0.08)',
                        borderColor: 'rgba(20, 184, 166, 0.25)',
                        color: 'var(--teal)',
                        fontWeight: 700,
                        fontSize: '1rem',
                      }}
                    >
                      Rs. {(form.transport_fare || 0).toLocaleString('en-PK')}
                    </div>
                    <div className="fare-calculated-badge">
                      ✨ {perQuantityRate ?? 0} × {qty} = Rs. {(form.transport_fare || 0).toLocaleString('en-PK')}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Other Expenses</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              step="any"
              value={form.other_expenses ?? ''}
              onChange={(e) => set('other_expenses', e.target.value ? parseFloat(e.target.value) : null)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Selling Rate (per unit)</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              step="any"
              value={form.selling_rate ?? ''}
              onChange={(e) => set('selling_rate', e.target.value ? parseFloat(e.target.value) : null)}
              required
            />
          </div>
        </div>
      </div>

      {/* Live Calculation Preview */}
      <div
        className="glass-card-static"
        style={{
          padding: 24,
          marginBottom: 32,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 20,
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Total Cost
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--amber)' }}>
            Rs. {totalCost.toLocaleString('en-PK', { minimumFractionDigits: 0 })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Total Revenue
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--teal)' }}>
            Rs. {totalRevenue.toLocaleString('en-PK', { minimumFractionDigits: 0 })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Net Profit
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: netProfit >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>
            Rs. {netProfit.toLocaleString('en-PK', { minimumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <a href="/" className="btn btn-ghost">Cancel</a>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
