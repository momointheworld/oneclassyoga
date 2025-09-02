import { PageContainer } from '@/components/PageContainer';

export default function LocationPage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-8 text-center">Location</h1>

      <div className="space-y-6">
        <p className="text-center">
          Private classes take place in a semi-open venue in the heart of Chiang
          Mai&apos;s Old Town, offering a quiet and airy environment, perfect
          for focused yoga sessions.
        </p>

        {/* Info Card */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Private Class Features
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>
                Venue rental included (normally 500 THB per 1.5-hour session)
              </li>
              <li>Mats and props provided</li>
              <li>Quiet surroundings in the center of Old Town</li>
            </ul>
          </div>
        </div>

        {/* Address */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Address</h2>
          <p className="text-gray-700">
            11 Rachadamnoen Rd Soi 5, Tambon Si Phum, Mueang Chiang Mai
            District, Chiang Mai 50200
          </p>
        </div>

        {/* Map Embed */}
        <div className="mt-4 w-full h-64 sm:h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.211431120749!2d98.98818647519822!3d18.78872858235758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a989d7889b9%3A0x6e71e30452574cd7!2zMTEgUmFjaGFkYW1ub2VuIFJkIFNvaSA1LCBUYW1ib24gU2kgUGh1bSwg4LitLuC5gOC4oeC4t-C4reC4hyBDaGFuZyBXYXQgQ2hpYW5nIE1haSA1MDIwMA!5e0!3m2!1sen!2sth!4v1756811848605!5m2!1sen!2sth"
            width="600"
            height="450"
            className="w-full h-full border-0 rounded-lg"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </PageContainer>
  );
}
