"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Camera, CheckCircle2, LocateFixed, RefreshCw, ShieldCheck } from "lucide-react";

type Lookup = {
  id: string;
  subjectName: string;
  hotelName: string;
  action: string;
  expiresAt: string;
  locationMode: "hotel_geofence" | "record_only";
};

type Verified = {
  reviewRequired: boolean;
  photoCaptured: boolean;
  distanceM: number;
  locationMode: "hotel_geofence" | "record_only";
  withinHotelGeofence: boolean;
};

const input = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg tracking-[.2em] text-slate-950 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100";
const button = "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold disabled:cursor-not-allowed disabled:opacity-50";

function deviceId() {
  const key = "supraja_attendance_device_id";
  let value = localStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    localStorage.setItem(key, value);
  }
  return value;
}

async function imageFileToJpeg(file: File) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Unable to read this photo. Please take another one."));
      img.src = objectUrl;
    });

    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    if (!sourceWidth || !sourceHeight) throw new Error("The captured photo is empty.");

    const size = Math.min(sourceWidth, sourceHeight);
    const sx = (sourceWidth - size) / 2;
    const sy = (sourceHeight - size) / 2;
    const canvas = document.createElement("canvas");
    canvas.width = 420;
    canvas.height = 420;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Unable to prepare the captured photo.");

    ctx.drawImage(image, sx, sy, size, size, 0, 0, 420, 420);
    let data = canvas.toDataURL("image/jpeg", 0.72);
    if (data.length > 300000) data = canvas.toDataURL("image/jpeg", 0.55);
    if (!data || data.length < 2000) throw new Error("Photo capture failed. Please try again.");
    return data;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function AttendanceVerifyPage() {
  const [code, setCode] = useState("");
  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [verified, setVerified] = useState<Verified | null>(null);

  async function lookupCode(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setVerified(null);
    setPhotoData(null);

    const response = await fetch("/api/attendance-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: "lookup", code }),
    });
    const data = await response.json();

    if (!response.ok) {
      setLookup(null);
      setMessage(data.error || "Unable to verify this code.");
      setBusy(false);
      return;
    }

    setLookup(data.verification);
    setMessage("Code accepted. Take a fresh photo using your phone camera.");
    setBusy(false);
  }

  async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setPhotoBusy(true);
    setMessage("Preparing captured photo...");

    try {
      const data = await imageFileToJpeg(file);
      setPhotoData(data);
      setMessage("Photo captured successfully. Check the preview, then verify your current location.");
    } catch (error) {
      setPhotoData(null);
      setMessage(error instanceof Error ? error.message : "Unable to process the captured photo.");
    } finally {
      setPhotoBusy(false);
    }
  }

  async function livePosition() {
    if (!navigator.geolocation) throw new Error("Location is not supported on this phone.");

    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      });
    });
  }

  async function verifyPresence() {
    if (!lookup) return;
    if (!photoData) {
      setMessage("Take a fresh photo before verifying attendance.");
      return;
    }

    setBusy(true);
    setMessage("Capturing your current GPS location...");

    try {
      const position = await livePosition();

      const response = await fetch("/api/attendance-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "verify",
          code,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          deviceId: deviceId(),
          photoData,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to verify attendance.");
        return;
      }

      setVerified(data.verification);
      setMessage(data.verification.locationMode === "record_only"
        ? "Photo and your current GPS location were recorded successfully."
        : "Physical presence at the hotel was verified successfully.");
    } catch (error) {
      const geoError = typeof error === "object" && error !== null && "code" in error;
      const text = geoError
        ? "Location permission failed. Turn on phone Location/GPS, allow location for this site, and try again."
        : error instanceof Error ? error.message : "Unable to read live location.";
      setMessage(text);
    } finally {
      setBusy(false);
    }
  }

  function resetVerification() {
    setLookup(null);
    setCode("");
    setMessage("");
    setPhotoData(null);
    setVerified(null);
  }

  return <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950">
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-800 p-3 text-white"><ShieldCheck /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-amber-600">Supraja Hotels</p>
            <h1 className="text-xl font-bold">Staff Attendance Verification</h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          Take a fresh phone-camera photo and allow GPS so the attendance record contains both your photo and current location.
        </p>

        {!lookup && <form onSubmit={lookupCode} className="mt-6 space-y-3">
          <label className="block text-sm font-bold">6-digit attendance code</label>
          <input
            className={input}
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            required
          />
          <button disabled={busy || code.length !== 6} className={`${button} bg-blue-800 text-white`}>
            {busy ? "Checking..." : "Continue"}
          </button>
        </form>}

        {lookup && !verified && <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-bold">{lookup.subjectName}</p>
            <p className="text-sm text-slate-600">{lookup.hotelName}</p>
            <p className={`mt-2 text-xs font-semibold ${lookup.locationMode === "record_only" ? "text-blue-800" : "text-amber-800"}`}>
              {lookup.locationMode === "record_only"
                ? "Test mode: your current GPS location will be recorded, even when you are away from the hotel."
                : "Manager mode: your GPS location must be within the hotel attendance radius."}
            </p>
          </div>

          {photoData ? <div className="overflow-hidden rounded-2xl border border-emerald-300 bg-slate-950">
            <img src={photoData} alt="Captured attendance photo" className="aspect-square w-full object-cover" />
          </div> : <div className="flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center text-slate-500">
            <div className="px-6">
              <Camera className="mx-auto" size={42}/>
              <p className="mt-2 text-sm font-semibold">No photo captured yet</p>
              <p className="mt-1 text-xs">Tap the button below to open your phone camera.</p>
            </div>
          </div>}

          <label className={`${button} cursor-pointer bg-blue-800 text-white`}>
            {photoData ? <><RefreshCw size={18}/>Retake Photo</> : <><Camera size={18}/>{photoBusy ? "Preparing Photo..." : "Take Photo"}</>}
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={e => void handlePhoto(e)}
              disabled={photoBusy || busy}
              className="sr-only"
            />
          </label>

          {photoData && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 size={18}/>Photo captured
            </div>
            <p className="mt-1 text-sm text-emerald-800">Your captured photo is shown above. Retake it if the face is not clear.</p>
          </div>}

          <button
            type="button"
            onClick={() => void verifyPresence()}
            disabled={busy || photoBusy || !photoData}
            className={`${button} bg-emerald-700 text-white`}
          >
            <LocateFixed size={18}/>
            {busy ? "Capturing Location..." : "Capture Current Location & Submit"}
          </button>

          <button type="button" onClick={resetVerification} className={`${button} border border-slate-300 bg-white text-slate-700`}>
            Use a Different Code
          </button>
        </div>}

        {verified && <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
          <CheckCircle2 className="mx-auto text-emerald-700" size={42}/>
          <p className="mt-2 text-lg font-bold text-emerald-900">
            {verified.locationMode === "record_only" ? "Test Attendance Recorded" : "Presence Verified"}
          </p>
          <p className="mt-1 text-sm text-emerald-800">
            Photo: {verified.photoCaptured ? "captured" : "not available"} · Distance from hotel: {verified.distanceM} m
          </p>
          <p className="mt-3 text-sm font-semibold text-slate-700">
            {verified.locationMode === "record_only"
              ? "Your actual current location was saved. Hotel-distance blocking was intentionally disabled for this test profile."
              : "The manager is within the permitted hotel attendance area. Return to the hotel desk to start the shift."}
          </p>
        </div>}

        {message && <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${verified ? "bg-emerald-50 text-emerald-900" : "bg-blue-50 text-blue-900"}`}>
          {message}
        </div>}

        <p className="mt-5 text-xs leading-5 text-slate-500">
          Attendance photo and GPS are stored only for attendance control and audit.
        </p>
      </div>
    </div>
  </main>;
}
