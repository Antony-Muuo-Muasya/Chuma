import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

const SplineScene: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] w-full h-full pointer-events-none">
      <Suspense fallback={<div className="w-full h-full bg-gray-200" />}>
        {/* Using a generic public abstract Spline scene URL. 
            In a real project, this would be the user's specific export. */}
        <Spline scene="https://prod.spline.design/kZDDjO5IyCcmJbIV/scene.splinecode" />
      </Suspense>
      
      {/* Overlay to blend it better with the UI */}
      <div className="absolute inset-0 bg-white/30 pointer-events-none mix-blend-overlay" />
    </div>
  );
};

export default SplineScene;