/**
 * SkeletonLoaders — Structured loading placeholders for dashboard sections.
 * Displays shimmer animations while waiting for initial WebSocket data sync.
 */

export function MapSkeleton() {
  return (
    <div className="map-container" style={{ background: 'var(--bg-secondary)' }}>
      <div className="skeleton" style={{ width: '100%', height: '100%', minHeight: 500, borderRadius: 'var(--radius-lg)' }} />
      {/* Fake map controls */}
      <div className="map-overlay-controls">
        <div className="skeleton" style={{ width: 36, height: 36 }} />
        <div className="skeleton" style={{ width: 36, height: 36 }} />
        <div className="skeleton" style={{ width: 36, height: 36 }} />
      </div>
      <div className="map-legend" style={{ border: 'none', background: 'transparent' }}>
        <div className="skeleton" style={{ width: 180, height: 24 }} />
      </div>
    </div>
  );
}

export function StatsSkeleton({ count = 4 }) {
  return (
    <div className="dashboard-grid-stats">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="stat-card">
          <div className="stat-card-header">
            <div className="skeleton" style={{ width: 100, height: 14 }} />
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)' }} />
          </div>
          <div className="skeleton" style={{ width: 80, height: 32, marginTop: 8 }} />
          <div className="skeleton" style={{ width: 60, height: 12, marginTop: 4 }} />
        </div>
      ))}
    </div>
  );
}

export function IncidentFeedSkeleton({ count = 5 }) {
  return (
    <div className="triage-panel">
      <div className="triage-panel-header">
        <div className="skeleton" style={{ width: 120, height: 16 }} />
        <div className="skeleton" style={{ width: 40, height: 14 }} />
      </div>
      <div className="triage-panel-list">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="incident-card" style={{ opacity: 1 - i * 0.12 }}>
            <div className="incident-card-header">
              <div className="skeleton" style={{ width: 140, height: 12 }} />
              <div className="skeleton" style={{ width: 60, height: 18, borderRadius: 'var(--radius-full)' }} />
            </div>
            <div className="skeleton" style={{ width: '80%', height: 14, marginTop: 8 }} />
            <div className="skeleton" style={{ width: '60%', height: 12, marginTop: 4 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <div className="skeleton" style={{ width: 80, height: 12 }} />
              <div className="skeleton" style={{ width: 60, height: 12 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TeamCardsSkeleton({ count = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
          <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: 100, height: 14, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: 140, height: 12 }} />
          </div>
          <div className="skeleton" style={{ width: 70, height: 26, borderRadius: 'var(--radius-full)' }} />
        </div>
      ))}
    </div>
  );
}
