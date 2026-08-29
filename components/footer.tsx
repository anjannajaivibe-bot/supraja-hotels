import Link from "next/link";
import { hotels } from "@/data/hotels";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white">
      <div className="container-custom px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-2xl font-semibold text-amber-400">Supraja Hotels</h2>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              Hotels in Hyderabad for business trips, family visits and short stays. Choose Madhapur near HITEC City or Chandanagar near Lingampally, BHEL and Miyapur, then contact the hotel directly to book.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <Link href="/" className="block hover:text-amber-400">Home</Link>
              <Link href="/hotels" className="block hover:text-amber-400">Hotels in Hyderabad</Link>
              <Link href="/about" className="block hover:text-amber-400">About Supraja Hotels</Link>
              <Link href="/gallery" className="block hover:text-amber-400">Hotel Gallery</Link>
              <Link href="/offers" className="block hover:text-amber-400">Corporate & Group Stays</Link>
              <Link href="/blog" className="block hover:text-amber-400">Hyderabad Stay Guides</Link>
              <Link href="/contact" className="block hover:text-amber-400">Contact Hotels</Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Our Hotels</h3>
            <div className="mt-5 space-y-5 text-sm text-slate-300">
              <div>
                <Link href="/hotels/supraja-cyber-view" className="block font-medium hover:text-amber-400">Hotel Supraja Cyber View</Link>
                <p className="mt-1 text-xs text-slate-400">Madhapur near HITEC City, Shilpakala Vedika & Shilparamam</p>
                <a href="tel:+919550776161" className="mt-1 block text-xs text-slate-400 hover:text-amber-400">9550776161</a>
                <a href={hotels[0].googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-block text-xs font-semibold text-amber-400 hover:text-amber-300">Google Business Profile</a>
              </div>
              <div>
                <Link href="/hotels/supraja-residency" className="block font-medium hover:text-amber-400">Hotel Supraja Residency</Link>
                <p className="mt-1 text-xs text-slate-400">Chandanagar near Gangaram, Lingampally & BHEL</p>
                <a href="tel:+919346316161" className="mt-1 block text-xs text-slate-400 hover:text-amber-400">9346316161</a>
                <a href={hotels[1].googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-block text-xs font-semibold text-amber-400 hover:text-amber-300">Google Business Profile</a>
              </div>
              <div>
                <Link href="/hotels/supraja-lodge" className="block font-medium hover:text-amber-400">Hotel Supraja Lodge</Link>
                <p className="mt-1 text-xs text-slate-400">Budget stay in Chandanagar near Lingampally & BHEL</p>
                <a href="tel:+919348446161" className="mt-1 block text-xs text-slate-400 hover:text-amber-400">9348446161</a>
                <a href={hotels[2].googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-block text-xs font-semibold text-amber-400 hover:text-amber-300">Google Business Profile</a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Book Direct</h3>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              Call or WhatsApp your preferred hotel to check available rooms, current rates and booking details directly with the property team.
            </p>
            <a
              href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20book%20a%20room%20at%20Supraja%20Hotels"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Check on WhatsApp
            </a>
            <p className="mt-5 text-sm text-slate-400">Hyderabad, Telangana, India</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-400">© {year} Supraja Hotels. All rights reserved.</p>
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <Link href="/privacy-policy" className="hover:text-amber-400">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="hover:text-amber-400">Terms & Conditions</Link>
              <Link href="/refund-policy" className="hover:text-amber-400">Refund Policy</Link>
              <Link href="/contact" className="hover:text-amber-400">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
