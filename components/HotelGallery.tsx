import SmartImage from "@/components/SmartImage";
import Link from "next/link";
import { Camera } from "lucide-react";

type HotelGalleryProps = {
  hotelName: string;
  hero: string;
  gallery: string[];
};

export default function HotelGallery({ hotelName, hero, gallery }: HotelGalleryProps) {
  const previewImages = gallery.slice(0, 4);
  const totalImages = gallery.length + 1;

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">See the Stay</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Rooms & Hotel Experience</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">Explore real views of {hotelName} before you decide where to stay.</p>
        </div>
        <Link href="/gallery" className="inline-flex items-center gap-2 self-start rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:border-blue-700 hover:text-blue-700 sm:self-auto"><Camera size={17} />View Full Gallery</Link>
      </div>

      <div className="grid gap-3 overflow-hidden rounded-[1.75rem] md:grid-cols-[1.65fr_1fr] md:gap-3">
        <div className="group relative min-h-[360px] overflow-hidden bg-slate-100 sm:min-h-[460px] lg:min-h-[540px]">
          <SmartImage src={hero} alt={`${hotelName} room and stay experience`} fill priority className="object-cover transition duration-700 group-hover:scale-[1.025]" sizes="(max-width: 768px) 100vw, 62vw" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 pt-20 text-white"><p className="text-lg font-bold">{hotelName}</p><p className="mt-1 text-sm text-white/85">See the property before you book</p></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {previewImages.map((image, index) => (
            <div key={image} className="group relative min-h-[180px] overflow-hidden bg-slate-100 sm:min-h-[220px] lg:min-h-[264px]">
              <SmartImage src={image} alt={`${hotelName} room and hotel view ${index + 1}`} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 19vw" />
              {index === previewImages.length - 1 ? <Link href="/gallery" aria-label={`View all ${hotelName} photos`} className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/55 via-transparent to-transparent p-4"><span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg">+ {Math.max(totalImages - 5, 0)} more photos</span></Link> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
