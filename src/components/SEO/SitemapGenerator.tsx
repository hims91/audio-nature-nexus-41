
import React, { useEffect } from "react";

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const SitemapGenerator: React.FC = () => {
  useEffect(() => {
    const generateSitemap = () => {
      const baseUrl = window.location.origin;
      const entries: SitemapEntry[] = [
        {
          url: `${baseUrl}/`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 1.0
        },
        {
          url: `${baseUrl}/portfolio`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.9
        },
        {
          url: `${baseUrl}/contact`,
          lastmod: new Date().toISOString(),
          changefreq: 'monthly',
          priority: 0.8
        }
      ];

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

      // Store sitemap in localStorage for development
      localStorage.setItem('sitemap.xml', sitemapXml);
      
      console.log('Sitemap generated:', sitemapXml);
    };

    generateSitemap();
  }, []);

  return null; // This component doesn't render anything
};

export default SitemapGenerator;
