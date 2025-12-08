import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations('error');

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-xl">{t('pageNotFound')}</h2>
      <p className="text-gray-500">{t('pageNotFoundDesc')}</p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
