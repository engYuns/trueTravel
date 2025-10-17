"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ku';

interface Translations {
  [key: string]: {
    en: string;
    ku: string;
  };
}

const translations: Translations = {
  // Header
  'header.login': {
    en: 'Log-in',
    ku: 'چوونە ژوورەوە'
  },
  'header.application': {
    en: 'Application',
    ku: 'داواکاری'
  },
  'header.tagline': {
    en: 'Marketplace of Travel',
    ku: 'بازاڕی گەشتیاری'
  },
  
  // Hero Section
  'hero.title.marketplace': {
    en: 'Marketplace of',
    ku: 'بازاڕی'
  },
  'hero.title.travel': {
    en: 'Travel',
    ku: 'گەشتیاری'
  },
  'hero.title.ever': {
    en: 'ever',
    ku: 'هەمیشە'
  },
  'hero.approved.title': {
    en: 'Approved by 5000+ agencies',
    ku: 'پەسەندکراوە لەلایەن ٥٠٠٠+ ئاژانس'
  },
  'hero.approved.subtitle': {
    en: 'since 2016',
    ku: 'لە ساڵی ٢٠١٦ەوە'
  },

  // Trust Section
  'trust.title': {
    en: "We're not the only ones happy about Travel...",
    ku: 'ئێمە تەنها ئەوانە نین کە دڵخۆش بین بە گەشتیاری...'
  },
  'trust.subtitle': {
    en: 'More than 5000 agencies, with over 7000 users are using truetravel.com',
    ku: 'زیاتر لە ٥٠٠٠ ئاژانس، لەگەڵ زیاتر لە ٧٠٠٠ بەکارهێنەر truetravel.com بەکاردەهێنن'
  },
  'trust.description': {
    en: 'We wish to see you with us.',
    ku: 'هیوادارین تۆش لەگەڵ ئێمە بیت.'
  },

  // Company Info
  'company.about': {
    en: 'True Travel company is a travel company that incorporates a Travel Agency and a Corporate Travel operation. This includes planning a business trip, organizing a corporate event, or any other task required of the corporate traveler.',
    ku: 'کۆمپانیای تروو تراڤێل کۆمپانیایەکی گەشتیارییە کە ئاژانسی گەشتیاری و کارەکانی گەشتیاری کۆرپۆڕێت لەخۆدەگرێت. ئەمەش بریتییە لە پلاندانانی گەشتی بازرگانی، ڕێکخستنی ڕووداوی کۆرپۆڕێت، یان هەر ئەرکێکی دیکەی پێویست بۆ گەشتیاری کۆرپۆڕێت.'
  },

  // Contact Info
  'contact.phone1': {
    en: '+964 750 328 2768',
    ku: '+964 750 328 2768'
  },
  'contact.phone2': {
    en: '+964 750 30 10010',
    ku: '+964 750 30 10010'
  },
  'contact.email': {
    en: 'sales@truetraveliq.com',
    ku: 'sales@truetraveliq.com'
  },
  'contact.address': {
    en: 'Gulan St Near Nazdar Bamarny Hospital Erbil, 44002, Iraq',
    ku: 'شەقامی گوڵان نزیک نەخۆشخانەی نەزدار بامەرنی هەولێر، ٤٤٠٠٢، عێراق'
  },

  // Services
  'services.flight.title': {
    en: 'Flight Ticket',
    ku: 'بلیتی فڕۆکە'
  },
  'services.flight.description': {
    en: 'The opportunity to issue ticket very easily and quickly with extensive sales features through 400+ airlines and in thousands of destinations.',
    ku: 'دەرفەتی دەرکردنی بلیت بە ئاسانی و خێرایی لەگەڵ تایبەتمەندی فرۆشتنی بەرفراوان لە ڕێگەی ٤٠٠+ هێڵی فڕۆکەوە و لە هەزاران شوێندا.'
  },
  'services.hotel.title': {
    en: 'Hotel',
    ku: 'ئۆتێل'
  },
  'services.hotel.description': {
    en: 'The opportunity to make reservation in 2.5M+ hotels all over the world in safest way quickly with extensive sales features with the best prices.',
    ku: 'دەرفەتی حجزکردن لە ٢.٥ ملیۆن+ ئۆتێل لە سەرانسەری جیهاندا بە بەدەستراوترین ڕێگا و بە خێرایی لەگەڵ باشترین نرخەکان.'
  },
  'services.transfer.title': {
    en: 'Transfer',
    ku: 'گواستنەوە'
  },
  'services.transfer.description': {
    en: 'Airport - Hotel Transfers all over the world in safest way.',
    ku: 'گواستنەوەی فڕۆکەخانە - ئۆتێل لە سەرانسەری جیهاندا بە بەدەستراوترین ڕێگا.'
  },
  'services.car.title': {
    en: 'Rent a Car',
    ku: 'کرێکردنی ئۆتۆمبێل'
  },
  'services.car.description': {
    en: 'The opportunity to rent a car domestic and abroad through the well-known companies of the world with special deals.',
    ku: 'دەرفەتی کرێکردنی ئۆتۆمبێل لە ناوخۆ و دەرەوە لە ڕێگەی کۆمپانیا ناسراوەکانی جیهانەوە لەگەڵ ڕێکەوتنە تایبەتەکان.'
  },
  'services.tour.title': {
    en: 'Tour',
    ku: 'گەشت'
  },
  'services.tour.description': {
    en: 'Guaranteed departed domestic and abroad package tours prepared with special deals.',
    ku: 'گەشتە پێکهاتەکانی ناوخۆ و دەرەوەی گەڕانتیکراو کە بە ڕێکەوتنە تایبەتەکانەوە ئامادەکراون.'
  },
  'services.visa.title': {
    en: 'Visa',
    ku: 'ڤیزا'
  },
  'services.visa.description': {
    en: 'The opportunity to apply visa for all countries quickly and online, to pay and to follow up.',
    ku: 'دەرفەتی داواکردنی ڤیزا بۆ هەموو وڵاتان بە خێرایی و بە ئۆنلاین، پارەدان و شوێنکەوتن.'
  },
  
  // Authentication
  'auth.login': {
    en: 'Sign In to Your Account',
    ku: 'چوونە ژوورەوە بۆ هەژمارەکەت'
  },
  'auth.logout': {
    en: 'Sign Out',
    ku: 'چوونە دەرەوە'
  },
  'auth.email': {
    en: 'Email Address',
    ku: 'ناونیشانی ئیمەیل'
  },
  'auth.password': {
    en: 'Password',
    ku: 'وشەی نهێنی'
  },
  'auth.remember': {
    en: 'Remember me',
    ku: 'لەبیرم بێت'
  },
  'auth.forgot': {
    en: 'Forgot password?',
    ku: 'وشەی نهێنیت لەبیر چووە؟'
  },
  'auth.signin': {
    en: 'Sign In',
    ku: 'چوونە ژوورەوە'
  },
  'auth.noAccount': {
    en: 'Don\'t have an account?',
    ku: 'هەژمارەت نییە؟'
  },
  'auth.contact': {
    en: 'Contact our sales team',
    ku: 'پەیوەندی بە تیمی فرۆشتنمان بگرە'
  },
  
  // Future Content (keeping for compatibility)
  'content.title': {
    en: 'More Content Coming Soon',
    ku: 'ناوەڕۆکی زیاتر بەزووترین دێت'
  },
  'content.description': {
    en: 'This section will be populated with additional content.',
    ku: 'ئەم بەشە بە ناوەڕۆکی زیاتر پڕ دەکرێتەوە.'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}