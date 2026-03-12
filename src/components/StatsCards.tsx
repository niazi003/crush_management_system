'use client';

interface StatData {
  label: string;
  value: string | number;
  subValue?: string;
  colorClass: 'violet' | 'teal' | 'emerald' | 'amber';
  icon: string;
}

interface StatsCardsProps {
  stats: StatData[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div
      className="stagger-children"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 28,
      }}
    >
      {stats.map((stat, i) => (
        <div key={i} className={`glass-card stat-card ${stat.colorClass}`}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
              {stat.subValue && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  {stat.subValue}
                </div>
              )}
            </div>
            <div style={{ fontSize: 28, opacity: 0.7 }}>{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
