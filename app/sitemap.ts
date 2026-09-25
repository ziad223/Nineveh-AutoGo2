import { MetadataRoute } from 'next';
import { getBlogPosts } from '../src/lib/serverActions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ninevehautogo.com';

  // 1. Static Pages
  const staticRoutes = [
    '',
    '/how-order',
    '/blogs',
    '/about-us',
    '/faq',
    '/technical-support',
    '/terms',
    '/privacy-policy'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add Arabic and English versions for each static route
  staticRoutes.forEach((route) => {
    sitemapEntries.push({
      url: `${baseUrl}/ar${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1 : 0.8,
    });
    sitemapEntries.push({
      url: `${baseUrl}/en${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1 : 0.8,
    });
  });

  try {
    // 2. Fetch Dynamic Blogs for Arabic
    const arBlogsResponse = await getBlogPosts('ar', 1, 100);
    const arBlogs = arBlogsResponse?.data?.data || [];

    arBlogs.forEach((post: any) => {
      sitemapEntries.push({
        url: `${baseUrl}/ar/blogs/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });

    // 3. Fetch Dynamic Blogs for English
    const enBlogsResponse = await getBlogPosts('en', 1, 100);
    const enBlogs = enBlogsResponse?.data?.data || [];

    enBlogs.forEach((post: any) => {
      sitemapEntries.push({
        url: `${baseUrl}/en/blogs/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error);
  }

  return sitemapEntries;
}
