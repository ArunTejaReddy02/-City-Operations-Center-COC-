import { AlertTriangle, Wifi, WifiOff, Inbox, Users, Radio } from 'lucide-react';

/**
 * EmptyState — Reusable empty/error state component.
 */
function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={28} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {children}
    </div>
  );
}

export function NoComplaints() {
  return (
    <EmptyState
      icon={Inbox}
      title="No Active Complaints"
      description="No new complaints have been received in this ward. The system is monitoring incoming feeds."
    />
  );
}

export function NoSensorMatches() {
  return (
    <EmptyState
      icon={Radio}
      title="No Sensor Matches"
      description="No sensor events correlate with current complaints within the configured radius and time window."
    />
  );
}

export function NoAvailableTeams() {
  return (
    <EmptyState
      icon={Users}
      title="No Available Teams"
      description="All field teams are currently assigned or offline. Incoming incidents will be queued for the next available team."
    />
  );
}

export function OfflineMode() {
  return (
    <EmptyState
      icon={WifiOff}
      title="Offline Mode"
      description="The dashboard is operating in offline mode. Data shown may be stale. Reconnection will be attempted automatically."
    />
  );
}

export function DisconnectedWebSocket() {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Connection Lost"
      description="WebSocket connection to the server has been interrupted. Attempting to reconnect..."
    >
      <div style={{ marginTop: 'var(--space-4)' }}>
        <div className="skeleton" style={{ width: 200, height: 4, borderRadius: 2 }} />
      </div>
    </EmptyState>
  );
}

export default EmptyState;
