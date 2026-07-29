import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white">
      <div className="container-custom px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-2xl font-semibold text-amber-400">
              Supraja Hotels
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              Comfortable stays, prime locations and trusted hospitality across
              Hyderabad. Stay near Hitech City, Madhapur, Chandanagar, BHEL,
              Miyapur and nearby Hyderabad locations with direct booking
              support.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <Link href="/" className="block hover:text-amber-400">
                Home
              </Link>

              <Link href="/about" className="block hover:text-amber-400">
                About Us
              </Link>

              <Link href="/hotels" className="block hover:text-amber-400">
                Hotels in Hyderabad
              </Link>

              <Link href="/blog" className="block hover:text-amber-400">
                Hotel & Stay Guides
              </Link>

              <Link href="/gallery" className="block hover:text-amber-400">
                Gallery
              </Link>

              <Link href="/offers" className="block hover:text-amber-400">
                Offers
              </Link>

              <Link href="/contact" className="block hover:text-amber-400">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Our Hotels</h3>

            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div>
                <Link
                  href="/hotels/supraja-cyber-view"
                  className="block font-medium hover:text-amber-400"
                >
                  Hotel Supraja Cyber View
                </Link>

                <p className="mt-1 text-xs text-slate-400">
                  Madhapur, Hitech City, Kondapur, Gachibowli
                </p>

                <a
                  href="tel:+919550776161"
                  className="mt-1 block text-xs text-slate-400 hover:text-amber-400"
                >
                  9550776161
                </a>

                <a
                  href="mailto:suprajacyberviewhotel@gmail.com"
                  className="block break-all text-xs text-slate-400 hover:text-amber-400"
                >
                  suprajacyberviewhotel@gmail.com
                </a>
              </div>

              <div>
                <Link
                  href="/hotels/supraja-residency"
                  className="block font-medium hover:text-amber-400"
                >
                  Hotel Supraja Residency
                </Link>

                <p className="mt-1 text-xs text-slate-400">
                  Chandanagar, Gangaram, BHEL, Miyapur
                </p>

                <a
                  href="tel:+919346316161"
                  className="mt-1 block text-xs text-slate-400 hover:text-amber-400"
                >
                  9346316161
                </a>

                <a
                  href="mailto:residency.suprajahotels@gmail.com"
                  className="block break-all text-xs text-slate-400 hover:text-amber-400"
                >
                  residency.suprajahotels@gmail.com
                </a>
              </div>

              <div>
                <Link
                  href="/hotels/supraja-lodge"
                  className="block font-medium hover:text-amber-400"
                >
                  Hotel Supraja Lodge
                </Link>

                <p className="mt-1 text-xs text-slate-400">
                  Chandanagar, BHEL, Serilingampally, Nallagandla
                </p>

                <a
                  href="tel:+919348446161"
                  className="mt-1 block text-xs text-slate-400 hover:text-amber-400"
                >
                  9348446161
                </a>

                <a
                  href="mailto:lodge.suprajahotels@gmail.com"
                  className="block break-all text-xs text-slate-400 hover:text-amber-400"
                >
                  lodge.suprajahotels@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Direct Booking</h3>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              Contact Supraja Hotels directly for room availability, suitable
              property guidance and booking assistance in Hyderabad.
            </p>

            <a
              href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20book%20a%20room%20at%20Supraja%20Hotels"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Book on WhatsApp
            </a>

            <p className="mt-5 text-sm text-slate-400">
              Hyderabad, Telangana, India
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-400">
              © {year} Supraja Hotels. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <Link href="/privacy-policy" className="hover:text-amber-400">
                Privacy Policy
              </Link>

              <Link
                href="/terms-and-conditions"
                className="hover:text-amber-400"
              >
                Terms & Conditions
              </Link>

              <Link href="/refund-policy" className="hover:text-amber-400">
                Refund Policy
              </Link>

              <Link href="/contact" className="hover:text-amber-400">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
