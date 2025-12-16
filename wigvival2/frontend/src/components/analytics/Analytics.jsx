import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Env: VITE_GA_ID
 * - set VITE_GA_ID=G-XXXX in .env to enable gtag config
 */

const sendBeacon = (url, payload) => {
  try {
    const body = JSON.stringify(payload);
    if (navigator && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      return;
    }
    // fallback to fetch but keep it fire-and-forget
    fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(()=>{});
  } catch (e) { /* noop */ }
};

const trackCustom = (location) => {
  const analyticsData = {
    page: location.pathname + location.search,
    ts: new Date().toISOString(),
    ua: navigator.userAgent,
    screen: { w: window.screen.width, h: window.screen.height },
  };
  // replace with your backend endpoint if any
  // sendBeacon('/api/analytics', analyticsData);
  console.log('Analytics Event', analyticsData);
};

const throttle = (fn, wait = 500) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last > wait) {
      last = now;
      fn(...args);
    }
  };
};

const Analytics = () => {
  const location = useLocation();
  const gaId = import.meta.env.VITE_GA_ID || null;
  const trackRef = useRef(throttle((loc) => {
    // GA pageview
    if (gaId && window.gtag) {
      try {
        window.gtag('event', 'page_view', { page_path: loc.pathname + loc.search });
      } catch (e) { /* noop */ }
    }
    trackCustom(loc);
  }, 300));

  useEffect(() => {
    trackRef.current(location);
  }, [location]);

  // Performance + errors
  useEffect(() => {
    const onLoad = () => {
      try {
        // modern performance entries
        const paints = performance.getEntriesByType?.('paint') || [];
        paints.forEach(p => console.log('paint', p.name, p.startTime));
        // LCP/FID handled by PerformanceMonitor or web-vitals lib
      } catch (e) { /* noop */ }
    };
    const onError = (e) => {
      console.error('App error', { message: e.message, filename: e.filename, lineno: e.lineno, colno: e.colno });
      // optionally sendBeacon('/api/errors', {...});
    };
    window.addEventListener('load', onLoad);
    window.addEventListener('error', onError);
    return () => {
      window.removeEventListener('load', onLoad);
      window.removeEventListener('error', onError);
    };
  }, []);

  return null;
};

export const PerformanceMonitor = () => {
  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP', Math.round(entry.startTime));
        }
        if (entry.entryType === 'first-input') {
          console.log('FID', Math.round(entry.processingStart - entry.startTime));
        }
      }
    });
    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      observer.observe({ type: 'first-input', buffered: true });
    } catch (e) { /* some browsers restrict entry types */ }
    return () => observer.disconnect();
  }, []);
  return null;
};

export default Analytics;
