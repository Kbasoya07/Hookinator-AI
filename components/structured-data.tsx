import React from 'react';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Hookinator AI',
    'url': 'https://hookinator.com',
    'logo': 'https://hookinator.com/favicon.ico',
    'sameAs': [
      'https://twitter.com/hookinator_ai',
      'https://github.com/hookinator-ai'
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Hookinator AI',
    'operatingSystem': 'All',
    'applicationCategory': 'BusinessApplication',
    'offers': {
      '@type': 'Offer',
      'price': '0.00',
      'priceCurrency': 'USD'
    },
    'description': 'AI-powered YouTube title optimizer, SEO description generator, and hashtag tool for creators'
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Is this the best youtube title optimizer free to use?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes! Hookinator AI offers the best youtube title optimizer free tier with complimentary credits so you can generate high-CTR hooks without paying a single cent.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can I use the ai youtube title generator for gaming videos?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Absolutely! Our ai youtube title generator for gaming channels helps match high-energy video highlights with curiosity gaps, listicles, or challenge hooks.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is there a youtube description generator for roblox content?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes! Roblox creators can easily use Hookinator as a youtube description generator for roblox or Minecraft videos. It automatically structures game outlines, chapter segments, and keyword metadata.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Do you have a specialized youtube seo tool for indian creators?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Hookinator functions perfectly as a youtube seo tool for indian creators, supporting multiple niches, content genres, and Hinglish or regional language concepts.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How does the youtube shorts title generator work?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Our youtube shorts title generator parses your short concept to output short, punchy, high-impact titles (under 60 characters) formatted with engaging emojis and hashtags.'
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
