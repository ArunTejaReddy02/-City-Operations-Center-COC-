import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * useWebSocket — Custom hook for managing WebSocket connections.
 * 
 * Handles connection, reconnection, message parsing, and status tracking.
 * Returns connection status and methods to interact with the socket.
 * 
 * For the pilot demo, this hook can operate in "mock" mode generating
 * synthetic events when no real server is available.
 */

const RECONNECT_INTERVALS = [1000, 2000, 4000, 8000, 15000];
const MAX_RECONNECT_ATTEMPTS = 10;

export const VIZAG_LOCATIONS = [
  { lat: 17.7111, lng: 83.3197, name: 'RK Beach Road' },
  { lat: 17.7262, lng: 83.3150, name: 'Siripuram Junction' },
  { lat: 17.7441, lng: 83.3330, name: 'MVP Colony' },
  { lat: 17.6890, lng: 83.2170, name: 'Gajuwaka' },
  { lat: 17.7490, lng: 83.2190, name: 'NAD X Road' },
  { lat: 17.7268, lng: 83.3032, name: 'Dwaraka Nagar' },
  { lat: 17.7121, lng: 83.3025, name: 'Jagadamba Junction' },
  { lat: 17.8286, lng: 83.3855, name: 'Rushikonda' },
  { lat: 17.7345, lng: 83.3218, name: 'Maddilapalem' },
  { lat: 17.7405, lng: 83.3125, name: 'Seethammadhara' }
];

const getRandomVizagLocation = () => {
  const base = VIZAG_LOCATIONS[Math.floor(Math.random() * VIZAG_LOCATIONS.length)];
  return {
    lat: base.lat + (Math.random() - 0.5) * 0.005, // ~250m variance
    lng: base.lng + (Math.random() - 0.5) * 0.005,
    name: base.name
  };
};

export default function useWebSocket(url, { onMessage, mockMode = true } = {}) {
  const [status, setStatus] = useState('connecting'); // connecting | connected | disconnected | error
  const wsRef = useRef(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const mockTimerRef = useRef(null);
  const onMessageRef = useRef(onMessage);
  
  // Track mock team positions so they don't teleport wildly
  const teamPositionsRef = useRef(
    Array.from({ length: 12 }, (_, i) => {
      const loc = getRandomVizagLocation();
      return {
        team_id: `FT-${String(i + 1).padStart(2, '0')}`,
        lat: loc.lat,
        lng: loc.lng,
      };
    })
  );

  // Keep callback ref fresh
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    if (mockMode) {
      // In mock mode, simulate connection and generate events
      setStatus('connecting');
      setTimeout(() => {
        setStatus('connected');
        startMockEvents();
      }, 1500);
      return;
    }

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      setStatus('connecting');

      ws.onopen = () => {
        setStatus('connected');
        reconnectAttemptRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessageRef.current?.(data);
        } catch (err) {
          console.error('[WebSocket] Failed to parse message:', err);
        }
      };

      ws.onerror = () => {
        setStatus('error');
      };

      ws.onclose = () => {
        setStatus('disconnected');
        attemptReconnect();
      };
    } catch (err) {
      setStatus('error');
      attemptReconnect();
    }
  }, [url, mockMode]);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptRef.current >= MAX_RECONNECT_ATTEMPTS) return;

    const delay = RECONNECT_INTERVALS[
      Math.min(reconnectAttemptRef.current, RECONNECT_INTERVALS.length - 1)
    ];

    reconnectTimerRef.current = setTimeout(() => {
      reconnectAttemptRef.current++;
      setStatus('connecting');
      connect();
    }, delay);
  }, [connect]);

  const startMockEvents = useCallback(() => {
    // Generate synthetic events at random intervals
    const generateEvent = () => {
      const eventTypes = ['complaint.new', 'sensor.new', 'team.update', 'assignment.new'];
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      let event = null;
      
      if (type === 'complaint.new') {
        const loc = getRandomVizagLocation();
        event = {
          type: 'complaint.new',
          data: {
            complaint_id: `CMP-${Date.now().toString(36).toUpperCase()}`,
            type: ['pothole', 'road_obstruction', 'waterlogging', 'streetlight'][Math.floor(Math.random() * 4)],
            description: ['Large pothole near bus stop', 'Road obstruction on main road', 'Waterlogging in residential area', 'Streetlight malfunction'][Math.floor(Math.random() * 4)],
            location: {
              lat: loc.lat,
              lng: loc.lng,
            },
            ward_id: 'GVMC-W12',
            status: 'received',
            reported_at: new Date().toISOString(),
          },
        };
      } else if (type === 'sensor.new') {
        const loc = getRandomVizagLocation();
        event = {
          type: 'sensor.new',
          data: {
            event_id: `SEN-${Date.now().toString(36).toUpperCase()}`,
            asset_id: `CCTV-VZG-${Math.floor(Math.random() * 200)}`,
            event_type: 'road_obstruction',
            location: {
              lat: loc.lat,
              lng: loc.lng,
            },
            timestamp: new Date().toISOString(),
            confidence: +(0.6 + Math.random() * 0.35).toFixed(2),
            source: 'COC',
          },
        };
      } else if (type === 'team.update') {
        const team = teamPositionsRef.current[Math.floor(Math.random() * 12)];
        // Move team slightly to simulate driving (approx max ~500 meters)
        team.lat = Math.max(17.65, Math.min(17.85, team.lat + (Math.random() - 0.5) * 0.005));
        team.lng = Math.max(83.15, Math.min(83.35, team.lng + (Math.random() - 0.5) * 0.005));
        
        event = {
          type: 'team.update',
          data: {
            team_id: team.team_id,
            status: ['available', 'en_route', 'on_site', 'done'][Math.floor(Math.random() * 4)],
            location: { lat: team.lat, lng: team.lng },
            updated_at: new Date().toISOString(),
          },
        };
      } else if (type === 'assignment.new') {
        event = {
          type: 'assignment.new',
          data: {
            alert_id: `ALR-${Date.now().toString(36).toUpperCase()}`,
            incident_id: `CMP-${Date.now().toString(36).toUpperCase()}`,
            team_id: `FT-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`,
            priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
            eta_minutes: Math.floor(Math.random() * 20) + 5,
            issued_at: new Date().toISOString(),
          },
        };
      }

      if (event) {
        onMessageRef.current?.(event);
      }

      // Schedule next event (3-8 seconds)
      const nextDelay = 3000 + Math.random() * 5000;
      mockTimerRef.current = setTimeout(generateEvent, nextDelay);
    };

    // Start after a short delay
    mockTimerRef.current = setTimeout(generateEvent, 2000);
  }, []);

  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const disconnect = useCallback(() => {
    clearTimeout(reconnectTimerRef.current);
    clearTimeout(mockTimerRef.current);
    wsRef.current?.close();
    setStatus('disconnected');
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimerRef.current);
      clearTimeout(mockTimerRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { status, send, disconnect, reconnect: connect };
}
