import React from 'react';

export const JsonLdSchema: React.FC = () => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: 'Mehfil Restaurant',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop',
    '@id': 'https://www.mehfilbiryani.com',
    url: 'https://www.mehfilbiryani.com',
    telephone: '+91-40-24756677',
    priceRange: '₹₹',
    servesCuisine: ['Hyderabadi', 'Biryani', 'Mughlai', 'Tandoori', 'North Indian'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'H.No. 3-5-890, Opposite YMCA, Main Road, Narayanguda',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500029',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.3971,
      longitude: 78.4897,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '11:00',
        closes: '23:30',
      },
    ],
    menu: 'https://www.mehfilbiryani.com/menu',
    acceptsReservations: 'True',
    hasMap: 'https://maps.google.com/?q=Mehfil+Narayanguda+Hyderabad',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};
