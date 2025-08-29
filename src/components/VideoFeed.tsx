'use client';

import { useEffect, forwardRef, useState } from 'react';

const VideoFeed = forwardRef<HTMLVideoElement>((props, ref) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (ref && 'current' in ref && ref.current) {
          ref.current.srcObject = stream;
        }
        setError(null);
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("Unable to access camera. Please ensure you have granted permission and that a camera is connected.");
      }
    };

    getCameraStream();
  }, [ref]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden">
      <video ref={ref} autoPlay playsInline className="w-full h-full object-cover" />
      {error && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center p-4 rounded-xl">
          <p className="text-rose-400 text-center">{error}</p>
        </div>
      )}
    </div>
  );
});

VideoFeed.displayName = 'VideoFeed';

export default VideoFeed;