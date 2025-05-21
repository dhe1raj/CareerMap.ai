
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, any>;
}

export default function SEOMetadata({
  title,
  description,
  keywords,
  canonicalPath,
  ogImage = "/lovable-uploads/6dada9e0-7c2b-4be1-8795-cb8580fec628.png",
  ogType = "website",
  jsonLd
}: SEOProps) {
  const siteUrl = "https://careermap.ai";
  const fullTitle = title.includes("CareerMap") ? title : `${title} | CareerMap`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={`${siteUrl}${canonicalPath}`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={`${siteUrl}${canonicalPath}`} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={`${siteUrl}${canonicalPath}`} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* JSON-LD Schema */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
