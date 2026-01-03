'use client';

import React from 'react';

const CRTOverlay = () => {
    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-10">
            {/* Scanlines - Restored Original Aesthetic */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
                    backgroundSize: '100% 4px'
                }}
            />
            {/* Vignette - Restored Original Aesthetic */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.6)_100%)]" />
        </div>
    );
};

export default CRTOverlay;
