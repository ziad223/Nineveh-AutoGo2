// components/AllBlogs.tsx
import React from 'react';
import BlogCard from './BlogCard';
import { getBlogPosts } from '../../lib/serverActions';
import { getTranslations } from "next-intl/server";
import Link from 'next/link';

interface AllBlogsProps {
  locale: string;
}

const Blogs = async ({ locale }: AllBlogsProps) => {
  const response = await getBlogPosts(locale, 1);
  const t = await getTranslations('articles');

  if (!response?.data?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {locale === 'ar' ? 'لا توجد مقالات' : 'No blogs found'}
        </p>
      </div>
    );
  }

  const blogs = response.data.data;

  // نعرض أول 6 فقط
  const displayedBlogs = blogs.slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-8">

      {/* العنوان */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">
          {t("title")}
        </h2>
        <p className="text-gray-600 text-xs md:text-sm mt-2 max-w-md mx-auto">
          {t("description")}
        </p>
      </div>

      {/* المقالات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedBlogs.map((blog: any) => (
          <BlogCard key={blog.id} blog={blog} locale={locale} />
        ))}
      </div>

      {/* زرار عرض المزيد */}
      {blogs.length > 6 && (
        <div className="text-center mt-10">
          <Link href={`/${locale}/blogs`}>
            <button className="bg-primary text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5">
              {locale === 'ar'
                ? 'عرض المزيد من المقالات'
                : 'View More Articles'}
            </button>
          </Link>
        </div>
      )}

    </div>
  );
};

export default Blogs;