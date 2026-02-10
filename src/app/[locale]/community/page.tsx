import { Metadata } from 'next';
import CommunityPageClient from './CommunityPageClient';
import { createClient } from '@/utils/supabase/supabaseServer';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Community.metadata' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://oneclass.yoga/community',
      siteName: 'OneClass',
      images: [
        {
          url: '/images/ogs/community-og.jpeg',
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
  };
}

export const revalidate = 30;

export default async function CommunityPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient(); // Await supabase client

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .from('posts')
    .select(
      'id, title, content, slug, user_name, user_id, created_at, category',
    )
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <CommunityPageClient user={user} posts={posts || []} locale={locale} />
  );
}
