
import React, { useEffect } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const SitemapGenerator: React.FC = () => {
  const { portfolioItems } = usePortfolioData();

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

      // Add individual portfolio items if they have unique URLs in the future
      portfolioItems.forEach(item => {
        entries.push({
          url: `${baseUrl}/portfolio#${item.id}`,
          lastmod: item.updatedAt || item.createdAt,
          changefreq: 'monthly',
          priority: item.featured ? 0.7 : 0.6
        });
      });

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
      
      console.log('📄 Sitemap generated with', entries.length, 'entries');
      
      // In production, this could be sent to a server endpoint
      if (process.env.NODE_ENV === 'production') {
        // Could implement server-side sitemap generation here
        console.log('Production sitemap ready for deployment');
      }
    };

    if (portfolioItems.length > 0) {
      generateSitemap();
    }
  }, [portfolioItems]);

  return null; // This component doesn't render anything
};

export default SitemapGenerator;
