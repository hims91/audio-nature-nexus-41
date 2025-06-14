
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with actual GA4 tracking ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;

  // Load GA script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag = window.gtag || function() {
    (window.gtag as any).q = (window.gtag as any).q || [];
    (window.gtag as any).q.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
    anonymize_ip: true
  });
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href
  });
};

// Track events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
};

// Track audio plays
export const trackAudioPlay = (title: string, category: string) => {
  trackEvent('play', 'audio', `${category} - ${title}`);
};

// Track contact form submissions
export const trackContactForm = (formType: string) => {
  trackEvent('submit', 'contact', formType);
};

// Track portfolio item views
export const trackPortfolioView = (itemTitle: string, category: string) => {
  trackEvent('view', 'portfolio', `${category} - ${itemTitle}`);
};
