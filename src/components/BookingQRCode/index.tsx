"use client";

import React, { useRef } from 'react';
import QRCode from 'react-qr-code';

interface Props {
  bookingUrl: string;
}

export default function BookingQRCode({ bookingUrl }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const downloadPNG = async (fileName = 'ticket.png') => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = png;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  };

  const foreignObjectProps = { xmlns: 'http://www.w3.org/1999/xhtml' } as any;

  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ background: 'white', padding: 8 }}>
        <svg ref={svgRef} width={160} height={160}>
          <foreignObject width="160" height="160">
            <div {...foreignObjectProps} style={{ width: '100%', height: '100%' }}>
              <QRCode value={bookingUrl} size={150} />
            </div>
          </foreignObject>
        </svg>
      </div>
      <button onClick={() => downloadPNG('boarding-pass.png')} className="inline-flex items-center justify-center rounded bg-slate-900 px-3 py-1 text-sm text-white">Download QR</button>
    </div>
  );
}
