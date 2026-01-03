import React from 'react';

const CRTOverlay = () => {
    return (
        <>
            {/* Scanlines */}
            <div
                className="absolute inset-0 z-20 pointer-events-none opacity-20"
                style={{
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 2px, 3px 100%'
                }}
            />
            {/* Vignette */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.6)_100%)]" />
        </>
    );
};

export default CRTOverlay;
