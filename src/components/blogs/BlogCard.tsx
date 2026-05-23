// components/BlogCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogCardProps {
  blog: {
    id: number;
    title: string;
    description: string;
    slug: string;
    thumbnail: string;
    preview_image: string;
    keywords?: string[];
  };
  locale: string;
}

const BlogCard = ({ blog, locale }: BlogCardProps) => {
  return (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
  
  <div className="relative h-48 w-full">
    <Image
      src={blog.thumbnail || blog.preview_image || '/images/placeholder.jpg'}
      alt={blog.title}
      fill
      className="object-cover"
    />
  </div>

  <div className="p-5 flex flex-col flex-grow">
    
    <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
      {blog.title}
    </h3>

    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
      {blog.description}
    </p>

    <div className="mt-auto">
      <Link href={`/${locale}/blogs/${blog.slug}`}>
        <button className="bg-primary w-full text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-md">
          {locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}
        </button>
      </Link>
    </div>

  </div>
</div>
  );
};

export default BlogCard;