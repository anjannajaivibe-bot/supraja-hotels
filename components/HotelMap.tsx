interface HotelMapProps {
  title: string;
  embedUrl: string;
}

export default function HotelMap({
  title,
  embedUrl,
}: HotelMapProps) {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-custom">
        <h2 className="mb-6 text-3xl font-light text-slate-900">
          Location & Directions
        </h2>

        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
          <iframe
            src={embedUrl}
            width="100%"
            height="500"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title={title}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
