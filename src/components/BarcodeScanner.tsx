import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, X, Loader2, RotateCw } from 'lucide-react';

interface BarcodeScannerProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

interface BarcodeDetection {
  code: string;
  timestamp: number;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onResult, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [scanning, setScanning] = useState(true);
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [lastDetections, setLastDetections] = useState<BarcodeDetection[]>([]);
  const codeReaderRef = useRef<BrowserMultiFormatReader>();
  const lastTapRef = useRef<number>(0);

  const REQUIRED_DETECTIONS = 3;
  const DETECTION_TIMEOUT = 2000;
  const DETECTION_THRESHOLD = 0.8;
  const DOUBLE_TAP_DELAY = 300; // Délai maximum entre deux taps (en ms)

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    codeReaderRef.current.timeBetweenDecodingAttempts = 150;

    const initializeDevices = async () => {
      try {
        const videoDevices = await codeReaderRef.current!.listVideoInputDevices();
        // Priorise les caméras arrières pour mobile
        const sortedDevices = videoDevices.sort((a, b) => {
          const aLabel = a.label.toLowerCase();
          const bLabel = b.label.toLowerCase();
          const isABack = aLabel.includes('back') || aLabel.includes('arrière');
          const isBBack = bLabel.includes('back') || bLabel.includes('arrière');
          return isBBack ? 1 : isABack ? -1 : 0;
        });
        setDevices(sortedDevices);
        startScanning(sortedDevices[0].deviceId);
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    initializeDevices();

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const validateDetections = (detections: BarcodeDetection[]): string | null => {
    if (detections.length < REQUIRED_DETECTIONS) return null;

    const now = Date.now();
    const validDetections = detections.filter(
      d => now - d.timestamp < DETECTION_TIMEOUT
    );

    if (validDetections.length < REQUIRED_DETECTIONS) return null;

    const counts = validDetections.reduce((acc, det) => {
      acc[det.code] = (acc[det.code] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const [mostDetectedCode, count] = Object.entries(counts).reduce(
      (max, [code, count]) => (count > max[1] ? [code, count] : max),
      ['', 0]
    );

    if (count / validDetections.length >= DETECTION_THRESHOLD) {
      return mostDetectedCode;
    }

    return null;
  };

  const startScanning = async (deviceId: string) => {
    if (!codeReaderRef.current || !videoRef.current) return;

    setScanning(true);
    setDetectionProgress(0);
    setLastDetections([]);

    try {
      await codeReaderRef.current.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result) => {
          if (result && scanning) {
            const newDetection = {
              code: result.getText(),
              timestamp: Date.now()
            };

            setLastDetections(prev => {
              const updated = [...prev, newDetection];
              const filtered = updated.filter(
                d => Date.now() - d.timestamp < DETECTION_TIMEOUT
              );

              const progress = Math.min(
                (filtered.length / REQUIRED_DETECTIONS) * 100,
                100
              );
              setDetectionProgress(progress);

              const validCode = validateDetections(filtered);
              if (validCode) {
                setScanning(false);
                onResult(validCode);
                if (codeReaderRef.current) {
                  codeReaderRef.current.reset();
                }
                onClose();
              }

              return filtered;
            });
          }
        }
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
    }
  };

  const switchCamera = async () => {
    if (!codeReaderRef.current || devices.length <= 1) return;
    
    codeReaderRef.current.reset();
    const nextIndex = (currentDeviceIndex + 1) % devices.length;
    setCurrentDeviceIndex(nextIndex);
    await startScanning(devices[nextIndex].deviceId);
  };

  const handleTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    if (timeSinceLastTap < DOUBLE_TAP_DELAY) {
      // Double tap détecté
      switchCamera();
    }
    
    lastTapRef.current = now;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-lg w-full mx-4">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover rounded-lg"
            onClick={handleTap}
          />
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-blue-500 opacity-50" />
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-blue-500 opacity-50" />
          </div>
          {detectionProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <div
                className="h-full bg-blue-500 transition-all duration-200"
                style={{ width: `${detectionProgress}%` }}
              />
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            {devices.length > 1 && (
              <button
                onClick={switchCamera}
                className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition-colors"
                title="Changer de caméra"
              >
                <RotateCw size={24} className="text-blue-600" />
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition-colors"
              title="Fermer"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            {scanning ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <p>Placez le code-barres dans le cadre ({Math.round(detectionProgress)}%)</p>
                {devices.length > 1 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Double-tapez l'écran pour changer de caméra
                  </p>
                )}
              </>
            ) : (
              <p>Code-barres détecté !</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};