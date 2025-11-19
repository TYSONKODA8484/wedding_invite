import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  schema?: Record<string, any> | Record<string, any>[];
  locale?: string;
  alternateLang?: { lang: string; url: string }[];
}

export function SEOHead({
  title,
  description,
  keywords,
  ogImage = "/og-default.jpg",
  ogType = "website",
  canonical,
  schema,
  locale = "en_US",
  alternateLang,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = `${title} | WeddingInvite.ai`;

    const metaTags = [
      { name: "description", content: description },
      { name: "keywords", content: keywords || "indian wedding invitation video, whatsapp wedding video, digital wedding invitation, arabic wedding video, wedding video maker, shaadi video invitation" },
      
      { property: "og:title", content: `${title} | WeddingInvite.ai` },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:type", content: ogType },
      { property: "og:locale", content: locale },
      { property: "og:site_name", content: "WeddingInvite.ai" },
      
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${title} | WeddingInvite.ai` },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
      
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "format-detection", content: "telephone=no" },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let tag = document.querySelector(selector);
      
      if (!tag) {
        tag = document.createElement("meta");
        if (name) tag.setAttribute("name", name);
        if (property) tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      
      tag.setAttribute("content", content);
    });

    if (canonical) {
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (!canonicalTag) {
        canonicalTag = document.createElement("link");
        canonicalTag.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute("href", canonical);
    }

    if (alternateLang) {
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(tag => tag.remove());
      alternateLang.forEach(({ lang, url }) => {
        const link = document.createElement("link");
        link.setAttribute("rel", "alternate");
        link.setAttribute("hreflang", lang);
        link.setAttribute("href", url);
        document.head.appendChild(link);
      });
    }

    document.querySelectorAll('script[type="application/ld+json"][data-seo-head]').forEach(tag => tag.remove());
    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];
      schemas.forEach((schemaItem) => {
        const schemaTag = document.createElement("script");
        schemaTag.setAttribute("type", "application/ld+json");
        schemaTag.setAttribute("data-seo-head", "true");
        schemaTag.textContent = JSON.stringify(schemaItem);
        document.head.appendChild(schemaTag);
      });
    }

    return () => {
      document.title = "WeddingInvite.ai - Premium Wedding Video Invitations";
    };
  }, [title, description, keywords, ogImage, ogType, canonical, schema, locale, alternateLang]);

  return null;
}
