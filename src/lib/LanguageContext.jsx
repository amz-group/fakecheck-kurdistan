import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Preserve the context instance across HMR so editing this file
// doesn't detach mounted consumers from their provider.
let LanguageContext;
if (import.meta.hot && import.meta.hot.data.LanguageContext) {
  LanguageContext = import.meta.hot.data.LanguageContext;
} else {
  LanguageContext = createContext();
}
if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    data.LanguageContext = LanguageContext;
  });
}

export const languages = {
  en: { label: 'English', dir: 'ltr', flag: '🇬🇧' },
};

const translations = {
  en: {
    nav_home: 'Home',
    nav_scan: 'Scan',
    nav_trending: 'Trending Scams',
    nav_community: 'Community',
    nav_learn: 'Learn',
    nav_dashboard: 'Dashboard',
    nav_login: 'Login',
    nav_profile: 'Profile',
    nav_logout: 'Logout',
    nav_admin: 'Admin',
    brand_name: 'FakeCheck KRD GROUP',
    tagline: 'Check Before You Click',
    hero_title: 'FakeCheck Kurdistan',
    hero_subtitle: 'Check Before You Click',
    hero_desc: 'Protect yourself from suspicious links, scam messages, phishing attempts, fake content, and online fraud.',
    hero_cta: 'Scan Now',
    tools_title: 'Scanning Tools',
    tool_link: 'Link Scanner',
    tool_link_desc: 'Analyze suspicious URLs for phishing and scam indicators.',
    tool_screenshot: 'Screenshot Scanner',
    tool_screenshot_desc: 'Upload a screenshot to detect scam content.',
    tool_message: 'Message Scanner',
    tool_message_desc: 'Scan SMS, WhatsApp, Telegram, and email messages.',
    tool_news: 'News Checker',
    tool_news_desc: 'Check news and articles for misinformation signals.',
    open_scanner: 'Open Scanner',
    stats_total_scans: 'Total Scans',
    stats_dangerous: 'Dangerous Content',
    stats_suspicious: 'Suspicious Content',
    stats_reports: 'Community Reports',
    latest_alerts: 'Latest Scam Alerts',
    view_all: 'View All',
    paste_url: 'Paste URL',
    paste_message: 'Paste message',
    analyze_link: 'Analyze Link',
    analyze_message: 'Analyze Message',
    analyze_screenshot: 'Analyze Screenshot',
    analyze_news: 'Analyze News',
    analyzing: 'Analyzing...',
    upload_image: 'Upload Image',
    upload_hint: 'PNG, JPG, JPEG, WEBP - up to 5MB',
    article_url: 'Article URL',
    news_headline: 'News Headline',
    article_text: 'Article Text',
    risk_score: 'Risk Score',
    risk_level_low: 'Low Risk',
    risk_level_suspicious: 'Suspicious',
    risk_level_high: 'High Risk',
    risk_summary: 'Risk Summary',
    detected_warnings: 'Detected Warning Signs',
    recommended_action: 'Recommended Action',
    share_result: 'Share Result',
    save_scan: 'Save Scan',
    report_scam: 'Report Scam',
    scan_another: 'Scan Another',
    warning_signs: 'Warning Signs',
    disclaimer: 'This is an automated risk assessment. Please verify important information independently.',
    external_unavailable: 'External verification unavailable.',
    progress_uploading: 'Uploading',
    progress_reading: 'Reading Content',
    progress_analyzing: 'Analyzing Security Signals',
    progress_calculating: 'Calculating Risk',
    progress_preparing: 'Preparing Result',
    community_title: 'Community Reports',
    community_desc: 'Report scams and suspicious content to help the community.',
    report_scam_title: 'Report a Scam',
    field_title: 'Title',
    field_scam_type: 'Scam Type',
    field_description: 'Description',
    field_url: 'Suspicious URL',
    field_phone: 'Phone Number',
    field_screenshot: 'Screenshot',
    field_region: 'Country / Region',
    field_platform: 'Platform',
    submit_report: 'Submit Report',
    status_pending: 'Pending',
    status_approved: 'Approved',
    status_rejected: 'Rejected',
    trending_title: 'Trending Scams',
    trending_desc: 'The latest scams spreading in the community.',
    status_verified: 'Verified Scam',
    status_suspicious_t: 'Suspicious',
    status_investigating: 'Under Investigation',
    trending_badge: 'Trending',
    report_count: 'Reports',
    first_reported: 'First Reported',
    latest_report: 'Latest Report',
    learn_title: 'Learn',
    learn_desc: 'Learn how to protect yourself from online scams and threats.',
    dashboard_title: 'Dashboard',
    recent_scans: 'Recent Scans',
    saved_results: 'Saved Results',
    submitted_reports: 'Submitted Reports',
    security_tips: 'Security Tips',
    login: 'Login',
    register: 'Register',
    footer_tagline: 'Check Before You Click',
    privacy_policy: 'Privacy Policy',
    terms: 'Terms',
    contact: 'Contact',
    footer_tips: 'Security Tips',
    loading: 'Loading...',
    no_data: 'No data available',
    back_home: 'Back to Home',
    search: 'Search',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    approve: 'Approve',
    reject: 'Reject',
    view: 'View',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('fck_lang') || 'en');

  useEffect(() => {
    const config = languages[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = config.dir;
    localStorage.setItem('fck_lang', lang);
  }, [lang]);

  const t = useCallback((key) => {
    return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir: languages[lang].dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}