import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { AlertCircle, Bell, BellRing, Info, X } from 'lucide-react';

/**
 * NotificationCenter — Priority-differentiated notification system.
 * 
 * High: pulse + glow | Medium: slide in | Low: fade in
 * 
 * @param {Array} notifications - Array of { id, title, message, priority, time }
 * @param {Function} onDismiss - Callback to dismiss a notification.
 */
export default function NotificationCenter({ notifications = [], onDismiss }) {
  const containerRef = useRef(null);
  const animatedIdsRef = useRef(new Set());

  const animateIn = useCallback((el, priority) => {
    if (!el) return;

    switch (priority) {
      case 'high':
        // Pulse + glow
        gsap.fromTo(el,
          { x: 60, opacity: 0, scale: 0.95 },
          { x: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }
        );
        gsap.fromTo(el,
          { boxShadow: '0 0 0 0 rgba(188, 108, 37, 0.4)' },
          {
            boxShadow: '0 0 20px 4px rgba(188, 108, 37, 0.2)',
            duration: 0.6,
            repeat: 2,
            yoyo: true,
            ease: 'power1.inOut',
          }
        );
        break;

      case 'medium':
        // Slide in from right
        gsap.fromTo(el,
          { x: 80, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
        );
        break;

      case 'low':
      default:
        // Gentle fade in
        gsap.fromTo(el,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
        break;
    }
  }, []);

  const handleDismiss = useCallback((id, el) => {
    gsap.to(el, {
      x: 80,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        animatedIdsRef.current.delete(id);
        onDismiss?.(id);
      },
    });
  }, [onDismiss]);

  const getIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle size={18} color="var(--status-danger)" />;
      case 'medium': return <BellRing size={18} color="var(--status-warning)" />;
      case 'low': return <Info size={18} color="var(--status-info)" />;
      default: return <Bell size={18} color="var(--text-secondary)" />;
    }
  };

  return (
    <div className="notification-area" ref={containerRef}>
      {notifications.map((notif) => (
        <NotificationToast
          key={notif.id}
          notification={notif}
          icon={getIcon(notif.priority)}
          onMount={(el) => {
            if (!animatedIdsRef.current.has(notif.id)) {
              animatedIdsRef.current.add(notif.id);
              animateIn(el, notif.priority);
            }
          }}
          onDismiss={(el) => handleDismiss(notif.id, el)}
        />
      ))}
    </div>
  );
}

function NotificationToast({ notification, icon, onMount, onDismiss }) {
  const toastRef = useRef(null);

  useEffect(() => {
    onMount?.(toastRef.current);
  }, []);

  return (
    <div
      className={`notification-toast ${notification.priority}`}
      ref={toastRef}
      style={{ opacity: 0 }}
    >
      <span className="notification-toast-icon">{icon}</span>
      <div className="notification-toast-content">
        <div className="notification-toast-title">{notification.title}</div>
        <div className="notification-toast-message">{notification.message}</div>
      </div>
      <span className="notification-toast-time">{notification.time}</span>
      <button
        className="btn btn-ghost"
        onClick={() => onDismiss?.(toastRef.current)}
        aria-label="Dismiss notification"
        style={{ padding: 4 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
