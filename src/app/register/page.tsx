'use client';

import { useState, useRef, useEffect } from "react";
import VideoFeed from "@/components/VideoFeed";

// Get the API URL from environment variables, with a fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImages(prev => [...prev, imageDataUrl]);
      }
    }
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setMessage({ type: "error", text: "Please enter a name" });
      return;
    }
    
    if (capturedImages.length === 0) {
      setMessage({ type: "error", text: "Please capture at least one image" });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      // Send each captured image to the backend
      const results = await Promise.all(
        capturedImages.map(async (imageDataUrl, index) => {
          const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              name: name.trim(),
              image: imageDataUrl,
              index: index
            }),
          });
          
          return response.ok;
        })
      );
      
      if (results.every(result => result)) {
        setMessage({ type: "success", text: "Registration successful!" });
        setName("");
        setCapturedImages([]);
      } else {
        setMessage({ type: "error", text: "Registration failed. Please try again." });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage({ type: "error", text: "An error occurred during registration. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Face Recognition Registration</h1>
          <div className="flex items-center space-x-3">
            <a
              href="/users"
              className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              User Management
            </a>
            <a
              href="/"
              className="px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Attendance
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">Register New Face</h2>
              <p className="text-slate-600 mt-1">Capture images of the person's face to register them in the system</p>
            </div>
            
            <div className="p-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Person's Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 text-slate-900"
                    placeholder="Enter the person's name"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Webcam Section */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-slate-800">Camera Feed</h3>
                      <p className="text-slate-600 text-sm">Position the person's face in the frame</p>
                    </div>
                    
                    <div className="w-full bg-slate-900 aspect-video rounded-xl overflow-hidden relative">
                      <VideoFeed ref={videoRef} />
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        onClick={captureImage}
                        className="flex items-center justify-center w-full sm:w-64 py-3 px-6 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-sky-500/20"
                        disabled={isSubmitting}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Capture Image
                      </button>
                    </div>
                  </div>
                  
                  {/* Preview Section */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-slate-800">Captured Images</h3>
                      <p className="text-slate-600 text-sm">Preview of captured images ({capturedImages.length} captured)</p>
                    </div>
                    
                    <div className="bg-slate-100 rounded-xl p-4 min-h-[300px]">
                      {capturedImages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                          <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <h3 className="text-xl font-medium text-slate-600 mb-2">No Images Captured</h3>
                          <p className="text-slate-500 max-w-xs">
                            Capture images using the camera feed. For best results, capture 3-5 images from different angles.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {capturedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={image} 
                                alt={`Captured ${index + 1}`} 
                                className="w-full h-32 object-cover rounded-lg border border-slate-300"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                disabled={isSubmitting}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                              <div className="text-center text-xs text-slate-600 mt-1">Image {index + 1}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Message Display */}
                {message && (
                  <div className={`mt-6 p-4 rounded-lg ${
                    message.type === "success" 
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                  }`}>
                    {message.text}
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    type="submit"
                    className={`flex items-center justify-center w-full sm:w-64 py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] ${
                      isSubmitting
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                    } text-white`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Register Face
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Tips Section */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">Registration Tips</h2>
            </div>
            <div className="p-5">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-slate-700">Position the person in good lighting (avoid backlighting)</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-slate-700">Face the camera directly</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-100 text-sky-60 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-slate-700">Capture multiple images from different angles</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-slate-700">Capture images with different expressions</p>
                </li>
              </ul>
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