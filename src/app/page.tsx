'use client';

import VideoFeed from "@/components/VideoFeed";
import AttendanceLog from "@/components/AttendanceLog";
import FaceOverlay from "@/components/FaceOverlay";
import { useState, useRef, useEffect } from "react";

// Get the API URL from environment variables, with a fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface FaceData {
  name: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export default function Home() {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [logs, setLogs] = useState<{ name: string; time: string }[]>([]);
  const [faceData, setFaceData] = useState<FaceData[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionInterval = useRef<any>(null);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logs`);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg');
      }
    }
    return null;
  };

  const recognize = async () => {
    const imageDataUrl = captureFrame();
    if (imageDataUrl) {
      try {
        const response = await fetch(`${API_URL}/api/recognize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageDataUrl }),
        });
        if (response.ok) {
          const result = await response.json();
          setFaceData(result.face_data || []);
          fetchLogs(); // Refresh logs after recognition
        }
      } catch (error) {
        console.error("Error during recognition:", error);
      }
    }
  };

  const handleRecognition = () => {
    if (isRecognizing) {
      clearInterval(recognitionInterval.current);
      setFaceData([]); // Clear face data when stopping recognition
    } else {
      recognitionInterval.current = setInterval(recognize, 1000); // Recognize every 1 second for smoother experience
    }
    setIsRecognizing(!isRecognizing);
  };

  // Get video dimensions for the face overlay
  const videoWidth = videoRef.current?.videoWidth || 0;
  const videoHeight = videoRef.current?.videoHeight || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Face Recognition Attendance</h1>
          <div className="flex items-center space-x-4">
            <a
              href="/register"
              className="px-3 py-1 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Register Faces
            </a>
            <a
              href="/users"
              className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              User Management
            </a>
            <span className="text-sm text-slate-600">Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isRecognizing
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}>
              {isRecognizing ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Feed Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="p-5 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800">Camera Feed</h2>
              </div>
              <div className="p-5">
                <div className="w-full bg-slate-900 aspect-video rounded-xl overflow-hidden relative">
                  <VideoFeed ref={videoRef} />
                  {isRecognizing && videoWidth > 0 && videoHeight > 0 && (
                    <FaceOverlay
                      faceData={faceData}
                      videoWidth={videoWidth}
                      videoHeight={videoHeight}
                    />
                  )}
                  {!isRecognizing && (
                    <div className="absolute inset-0 bg-slate-90/80 flex items-center justify-center rounded-xl">
                      <p className="text-slate-300">Recognition is paused</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleRecognition}
                    className={`flex items-center justify-center w-full sm:w-64 py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] ${
                      isRecognizing
                        ? "bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20"
                        : "bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/20"
                    } text-white`}
                  >
                    {isRecognizing ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 011-1h4a1 1 011 1v4a1 1 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                        </svg>
                        Stop Recognition
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Start Recognition
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Log Section */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg h-full flex flex-col transition-all duration-300 hover:shadow-xl">
              <div className="p-5 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800">Attendance Log</h2>
              </div>
              <div className="flex-grow">
                <AttendanceLog logs={logs} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-slate-600 text-sm">
          <p>Face Recognition Attendance System &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
