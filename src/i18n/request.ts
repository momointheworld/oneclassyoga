import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'zh'];

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locale && locales.includes(locale) ? locale : 'en';

  try {
    const [home, programs, teachers, about, contact, policies, location] =
      await Promise.all([
        import(`../../messages/${validLocale}/home.json`),
        import(`../../messages/${validLocale}/programs.json`),
        import(`../../messages/${validLocale}/teachers.json`),
        import(`../../messages/${validLocale}/about.json`),
        import(`../../messages/${validLocale}/contact.json`),
        import(`../../messages/${validLocale}/policies.json`),
        import(`../../messages/${validLocale}/location.json`),
      ]);

    return {
      locale: validLocale,
      messages: {
        Home: home.default,
        Programs: programs.default,
        Teachers: teachers.default,
        About: about.default,
        Contact: contact.default,
        Policies: policies.default,
        Location: location.default,
      },
    };
  } catch (error) {
    console.error(
      `❌ [intl] Failed to load messages for: ${validLocale}`,
      error,
    );
    notFound();
  }
});
