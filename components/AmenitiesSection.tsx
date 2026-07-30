import SmartImage from "@/components/SmartImage";
import { amenities } from "@/data/amenities";

export default function AmenitiesSection() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <span className="uppercase tracking-[0.3em] text-[#C8A54B] text-sm font-medium">
            Amenities
          </span>

          <h2 className="mt-4 text-4xl font-light text-slate-900">
            Everything You Need For A Comfortable Stay
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {amenities.map((item) => (
            <div
              key={item.title}
              className="group border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <SmartImage
                src={item.icon}
                alt={item.title}
                width={48}
                height={48}
                className="mb-6"
              />

              <h3 className="text-xl font-medium text-slate-900">
                {item.title}
              </h3>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
