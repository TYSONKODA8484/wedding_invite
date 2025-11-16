import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  schema?: Record<string, any>;
}

export function SEOHead({
  title,
  description,
  keywords,
  ogImage = "/og-default.jpg",
  ogType = "website",
  canonical,
  schema,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = `${title} | WeddingInvite.ai`;

    const metaTags = [
      { name: "description", content: description },
      { name: "keywords", content: keywords || "wedding video invitation, digital invitation, AI video creator, cinematic invitation" },
      { property: "og:title", content: `${title} | WeddingInvite.ai` },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImage },
      { property: "og:type", content: ogType },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${title} | WeddingInvite.ai` },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
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

    if (schema) {
      let schemaTag = document.querySelector('script[type="application/ld+json"]');
      if (!schemaTag) {
        schemaTag = document.createElement("script");
        schemaTag.setAttribute("type", "application/ld+json");
        document.head.appendChild(schemaTag);
      }
      schemaTag.textContent = JSON.stringify(schema);
    }

    return () => {
      document.title = "WeddingInvite.ai - Cinematic Video Invitations";
    };
  }, [title, description, keywords, ogImage, ogType, canonical, schema]);

  return null;
}
