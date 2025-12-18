import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'WIGVIVAL | Salon de Coiffure Premium - Montréal, Québec',
  description = 'Salon premium spécialisé dans la customisation, restauration et styling de perruques. Services exclusifs réalisés par des experts. Réservez votre consultation dès aujourd\'hui.',
  canonical = 'https://wigvival.ca',
  ogImage = 'https://wigvival.ca/images/og-image.jpg',
  type = 'website',
  keywords = 'perruque, customisation, restauration, lace front, wig, Québec, Montréal, salon premium, coiffure, beauty, hairstyle',
  author = 'WIGVIVAL Salon',
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: 'WIGVIVAL Salon',
    description: description,
    url: canonical,
    logo: 'https://wigvival.ca/logo.png',
    telephone: '+1-514-123-4567',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Rue de la Beauté',
      addressLocality: 'Montréal',
      addressRegion: 'QC',
      postalCode: 'H3A 1A1',
      addressCountry: 'CA'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '45.5017',
      longitude: '-73.5673'
    },
    openingHours: [
      'Mo-Fr 09:00-20:00',
      'Sa 09:00-18:00'
    ],
    priceRange: '$$$',
    servesCuisine: 'Hair Care Services',
    hasMenu: 'https://wigvival.ca/services',
    image: ogImage,
    sameAs: [
      'https://instagram.com/wigvival',
      'https://facebook.com/wigvival',
      'https://twitter.com/wigvival'
    ]
  };

  return (
    <Helmet>
      {/* Base Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="WIGVIVAL Salon Premium" />
      <meta property="og:locale" content="fr_CA" />
      <meta property="og:site_name" content="WIGVIVAL" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@wigvival" />

      {/* Article Specific */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Additional */}
      <meta name="theme-color" content="#0F172A" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="WIGVIVAL" />

      {/* Favicon */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#d4af37" />

      {/* Preload critical resources */}
      <link rel="preload" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" as="style" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Additional schema for service list */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "Service",
              "position": 1,
              "name": "RESSERAGE",
              "description": "Service professionnel de resserrage pour perruque",
              "offeredBy": {
                "@type": "BeautySalon",
                "name": "WIGVIVAL"
              },
              "price": "15.00",
              "priceCurrency": "CAD"
            },
            {
              "@type": "Service",
              "position": 2,
              "name": "COIFFURE",
              "description": "Service de coiffure personnalisé",
              "offeredBy": {
                "@type": "BeautySalon",
                "name": "WIGVIVAL"
              },
              "price": "30.00",
              "priceCurrency": "CAD"
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;