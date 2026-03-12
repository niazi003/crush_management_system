'use client';

import { useState, useEffect } from 'react';
import { DispatchInsert } from '../types';

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

  useEffect(() => {
    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
    }
  }, [initialData]);

  const set = (field: keyof DispatchInsert, value: string | number | boolean | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
          <div className="form-group">
            <label className="form-label">Transport Fare</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              step="any"
              value={form.transport_fare ?? ''}
              onChange={(e) => set('transport_fare', e.target.value ? parseFloat(e.target.value) : null)}
              required
            />
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
