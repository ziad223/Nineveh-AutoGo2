import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

// استدعاء دالة جلب المقالات
import { getBlogPosts } from '../../../src/lib/serverActions'
import { getTranslations } from 'next-intl/server'

interface BlogPost {
  id: number
  title: string
  description: string
  slug: string
  thumbnail: string
  preview_image: string
  keywords: string[]
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface BlogPageProps {
  params: {
    locale: string
  }
  searchParams: { page?: string }
}

const BlogPage = async ({ params, searchParams }: BlogPageProps) => {
  const { locale } = await params
  // تحديد الصفحة الحالية
  const currentPage = Number(searchParams.page) || 1
  const postsPerPage = 6
  const t = await getTranslations('blogs')
  
  // جلب المقالات
  const response = await getBlogPosts(locale, currentPage, postsPerPage)
  
  // التحقق من نجاح الطلب
  if (!response || response.status_code !== 200) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('error.title')}</h2>
          <p className="text-gray-600">{t('error.message')}</p>
        </div>
      </div>
    )
  }

  const posts = response.data?.data || []
  const meta = response.data?.meta

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* عنوان الصفحة */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* عرض المقالات */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: BlogPost) => (
                <BlogCard key={post.id} post={post} t={t} locale={locale} />
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <Pagination
                currentPage={meta.current_page}
                totalPages={meta.last_page}
                totalItems={meta.total}
                postsPerPage={postsPerPage}
                t={t}
                locale={locale}
              />
            )}
          </>
        ) : (
          <EmptyState t={t} />
        )}
      </div>
    </div>
  )
}

// مكون بطاقة المقالة
const BlogCard = ({ post, t, locale }: { post: BlogPost; t: any; locale: string }) => {
  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
      {/* صورة المقال */}
      <Link href={`/${locale}/blogs/${post.slug}`} className="relative h-56 w-full overflow-hidden block">
        <Image
          src={post.thumbnail || '/images/placeholder.jpg'}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      {/* محتوى المقال */}
      <div className="p-6 flex-1 flex flex-col">
        <Link href={`/${locale}/blogs/${post.slug}`} className="block group">
          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary/80 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.description}
        </p>

        {/* الكلمات المفتاحية */}
        {post.keywords && post.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.keywords.slice(0, 3).map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary-foreground text-sm rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* رابط قراءة المزيد */}
        <Link
          href={`/${locale}/blogs/${post.slug}`}
          className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 w-full font-medium"
        >
          {t('readMore')}
        </Link>
      </div>
    </article>
  )
}

// مكون Pagination مع الترجمة
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  postsPerPage,
  t,
  locale,
}: {
  currentPage: number
  totalPages: number
  totalItems: number
  postsPerPage: number
  t: any
  locale: string
}) => {
  // دالة توليد أرقام الصفحات المعروضة
  const getPageNumbers = () => {
    const delta = 2
    const pages = []
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // الصفحة الأولى
        i === totalPages || // الصفحة الأخيرة
        (i >= currentPage - delta && i <= currentPage + delta) // الصفحات القريبة من الصفحة الحالية
      ) {
        pages.push(i)
      } else if (i === currentPage - delta - 1 || i === currentPage + delta + 1) {
        pages.push('...')
      }
    }
    
    // إزالة التكرار في علامات ...
    return pages.filter((page, index, array) => 
      page !== '...' || (array[index - 1] !== '...' && array[index + 1] !== '...')
    )
  }

  // حساب أرقام المقالات المعروضة
  const startItem = ((currentPage - 1) * postsPerPage) + 1
  const endItem = Math.min(currentPage * postsPerPage, totalItems)

  return (
    <div className="mt-12 flex flex-col items-center">
      {/* معلومات الصفحة */}
      <p className="text-sm text-gray-600 mb-4">
        {t('pagination.showing', { 
          start: startItem, 
          end: endItem, 
          total: totalItems 
        })}
      </p>

      {/* أزرار التصفح */}
      <div className="flex items-center gap-2">
        {/* زر الصفحة السابقة */}
        <Link
          href={currentPage > 1 ? `?page=${currentPage - 1}` : '#'}
          className={`
            px-4 py-2 rounded-lg border transition-colors duration-200
            ${currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 pointer-events-none'
              : 'bg-white text-gray-700 hover:bg-primary/10 hover:border-primary/30 border-gray-300'
            }
          `}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : undefined}
        >
          {t('pagination.previous')}
        </Link>

        {/* أرقام الصفحات */}
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <Link
                  href={`?page=${page}`}
                  className={`
                    min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-colors duration-200
                    ${currentPage === page
                      ? 'bg-primary text-primary-foreground font-semibold shadow-md'
                      : 'bg-white text-gray-700 hover:bg-primary/10 border border-gray-300'
                    }
                  `}
                  aria-label={`${t('pagination.page')} ${page}`}
                >
                  {page}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* زر الصفحة التالية */}
        <Link
          href={currentPage < totalPages ? `?page=${currentPage + 1}` : '#'}
          className={`
            px-4 py-2 rounded-lg border transition-colors duration-200
            ${currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 pointer-events-none'
              : 'bg-white text-gray-700 hover:bg-primary/10 hover:border-primary/30 border-gray-300'
            }
          `}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : undefined}
        >
          {t('pagination.next')}
        </Link>
      </div>
    </div>
  )
}

// مكون الحالة الفارغة مع الترجمة
const EmptyState = ({ t }: { t: any }) => {
  return (
    <div className="text-center py-16">
      <div className="text-primary/30 mb-4">
        <svg
          className="mx-auto h-16 w-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        {t('empty.title')}
      </h3>
      <p className="text-gray-600">
        {t('empty.message')}
      </p>
      
    </div>
  )
}

export default BlogPage