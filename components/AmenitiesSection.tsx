import {
  AirVent,
  Broom,
  CarFront,
  ConciergeBell,
  UsersRound,
  Wifi,
} from "lucide-react";
import { amenities } from "@/data/amenities";

const amenityIcons = {
  "Free WiFi": Wifi,
  "Air Conditioning": AirVent,
  "24x7 Reception": ConciergeBell,
  "Daily Housekeeping": Broom,
  Parking: CarFront,
  "Family Rooms": UsersRound,
};

export default function AmenitiesSection() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center lg:mb-14">
          <span className="text-sm font-bold uppercase tracking-[0.28em] text-amber-700">
            Hotel Amenities
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Everything You Need for a Comfortable Stay
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Essential comforts for business trips, family visits and short stays across Supraja Hotels.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((item) => {
            const Icon = amenityIcons[item.title as keyof typeof amenityIcons] || ConciergeBell;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-amber-500 opacity-0 transition group-hover:opacity-100" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 ring-1 ring-amber-100 transition duration-300 group-hover:bg-amber-100">
                  <Icon size={28} strokeWidth={1.9} aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">
                  {item.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
