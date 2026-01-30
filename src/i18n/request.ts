import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'zh'];
export default getRequestConfig(async ({ locale }) => {
  // If locale is undefined or not in list, fallback to default or 404
  const validLocale = locale && locales.includes(locale) ? locale : 'en';

  try {
    // We use a more explicit path for the bundler
    const [home, programs, teachers, about, contact, policies] =
      await Promise.all([
        import(`../../messages/${validLocale}/home.json`),
        import(`../../messages/${validLocale}/programs.json`),
        import(`../../messages/${validLocale}/teachers.json`),
        import(`../../messages/${validLocale}/about.json`),
        import(`../../messages/${validLocale}/contact.json`),
        // import(`../../messages/${validLocale}/policies.json`),
      ]);

    return {
      locale: validLocale,
      messages: {
        Home: home.default,
        Programs: programs.default,
        Teachers: teachers.default,
        About: about.default,
        Contact: contact.default,
        // Policies: policies.default,
      },
    };
  } catch (error) {
    console.error(
      `-> Failed to load messages for locale: ${validLocale}`,
      error,
    );
    notFound();
  }
});
