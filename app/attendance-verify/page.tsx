"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, LocateFixed, ShieldCheck } from "lucide-react";

type Lookup = {
  id: string;
  subjectName: string;
  hotelName: string;
  action: string;
  expiresAt: string;
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

export default function AttendanceVerifyPage() {
  const [code, setCode] = useState("");
  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraUnavailable, setCameraUnavailable] = useState(false);
  const [verified, setVerified] = useState<{ reviewRequired: boolean; photoCaptured: boolean; distanceM: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
  }, []);

  async function lookupCode(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setVerified(null);
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
    setMessage("Code accepted. Allow location and camera access, then verify your presence.");
    setBusy(false);
    await startCamera();
  }

  async function startCamera() {
    setCameraUnavailable(false);
    setCameraReady(false);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera unavailable");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch {
      setCameraUnavailable(true);
      setMessage("Camera is unavailable or permission was denied. You can continue with GPS only, but Master Admin will see it for review.");
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video || !cameraReady || video.videoWidth < 10 || video.videoHeight < 10) return null;
    const size = Math.min(video.videoWidth, video.videoHeight);
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, 320, 320);
    return canvas.toDataURL("image/jpeg", 0.62);
  }

  async function livePosition() {
    if (!navigator.geolocation) throw new Error("Location is not supported on this phone.");
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 18000,
        maximumAge: 0,
      });
    });
  }

  async function verifyPresence() {
    if (!lookup) return;
    setBusy(true);
    setMessage("Checking live GPS location...");
    try {
      const position = await livePosition();
      const photoData = capturePhoto();
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
        setMessage(data.error || "Unable to verify physical presence.");
        setBusy(false);
        return;
      }
      streamRef.current?.getTracks().forEach(track => track.stop());
      setVerified(data.verification);
      setMessage(data.verification.reviewRequired
        ? "Location verified. This record is flagged for review because the live photo was unavailable or another check needs attention."
        : "Physical presence verified successfully.");
    } catch (error) {
      const text = error instanceof GeolocationPositionError
        ? "Location permission failed. Turn on phone Location/GPS, allow location for this site, and try again."
        : error instanceof Error ? error.message : "Unable to read live location.";
      setMessage(text);
    } finally {
      setBusy(false);
    }
  }

  return <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950">
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-800 p-3 text-white"><ShieldCheck /></div>
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-amber-600">Supraja Hotels</p><h1 className="text-xl font-bold">Staff Attendance Verification</h1></div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">Use this page only while you are physically at the hotel. Your live GPS location and, when available, a live camera photo are attached to the attendance record.</p>

        {!lookup && <form onSubmit={lookupCode} className="mt-6 space-y-3">
          <label className="block text-sm font-bold">6-digit attendance code</label>
          <input className={input} inputMode="numeric" autoComplete="one-time-code" value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="000000" required />
          <button disabled={busy || code.length !== 6} className={`${button} bg-blue-800 text-white`}>{busy ? "Checking..." : "Continue"}</button>
        </form>}

        {lookup && !verified && <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-bold">{lookup.subjectName}</p>
            <p className="text-sm text-slate-600">{lookup.hotelName}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border bg-slate-950">
            <video ref={videoRef} playsInline muted className="aspect-square w-full object-cover" />
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            {cameraReady ? <><Camera size={17} className="text-emerald-700"/>Live camera ready</> : cameraUnavailable ? <><Camera size={17} className="text-amber-700"/>Camera unavailable, GPS-only fallback</> : <><Camera size={17}/>Starting camera...</>}
          </div>
          {cameraUnavailable && <button type="button" onClick={()=>void startCamera()} className={`${button} border border-slate-300 bg-white text-slate-800`}>Try Camera Again</button>}
          <button type="button" onClick={()=>void verifyPresence()} disabled={busy} className={`${button} bg-emerald-700 text-white`}><LocateFixed size={18}/>{busy ? "Verifying..." : cameraReady ? "Capture Photo & Verify" : "Verify GPS Location"}</button>
          <button type="button" onClick={()=>{setLookup(null);setCode("");setMessage("");streamRef.current?.getTracks().forEach(track=>track.stop());}} className={`${button} border border-slate-300 bg-white text-slate-700`}>Use a Different Code</button>
        </div>}

        {verified && <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
          <CheckCircle2 className="mx-auto text-emerald-700" size={42}/>
          <p className="mt-2 text-lg font-bold text-emerald-900">Presence Verified</p>
          <p className="mt-1 text-sm text-emerald-800">GPS distance: {verified.distanceM} m · Photo: {verified.photoCaptured ? "captured" : "not available"}</p>
          <p className="mt-3 text-sm font-semibold text-slate-700">You can now return to the hotel desk. The shift can be started there.</p>
        </div>}

        {message && <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${verified ? "bg-emerald-50 text-emerald-900" : "bg-blue-50 text-blue-900"}`}>{message}</div>}
        <p className="mt-5 text-xs leading-5 text-slate-500">Location and verification evidence are used only for attendance control and audit. Do not share attendance codes.</p>
      </div>
    </div>
  </main>;
}
