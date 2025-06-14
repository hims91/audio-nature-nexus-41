
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// TODO: Replace with your actual Google Analytics tracking ID
export const GA_TRACKING_ID = process.env.NODE_ENV === 'production' ? 'G-XXXXXXXXXX' : '';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_TRACKING_ID) {
    console.log('📊 Google Analytics not initialized - missing tracking ID or running in SSR');
    return;
  }

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
    anonymize_ip: true,
    send_page_view: false // We'll send manually
  });

  console.log('📊 Google Analytics initialized with ID:', GA_TRACKING_ID);
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag || !GA_TRACKING_ID) {
    console.log('📊 Page view not tracked - GA not initialized');
    return;
  }

  window.gtag('config', GA_TRACKING_ID, {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href
  });

  console.log('📊 Page view tracked:', path);
};

// Track events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag || !GA_TRACKING_ID) {
    console.log('📊 Event not tracked - GA not initialized');
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });

  console.log('📊 Event tracked:', { action, category, label, value });
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
