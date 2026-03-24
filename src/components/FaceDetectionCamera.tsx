import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, ScanFace, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface FaceDetectionCameraProps {
  onCapture: (dataUrl: string) => void;
  multiple?: boolean;
  title?: string;
}

const FaceDetectionCamera = ({ onCapture, multiple = false, title = "Foto com Reconhecimento Facial" }: FaceDetectionCameraProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [streaming, setStreaming] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [detectorSupported, setDetectorSupported] = useState(true);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch {
      toast({ title: "❌ Erro ao acessar a câmera", variant: "destructive" });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setStreaming(false);
    setFaceDetected(false);
    setFaceCount(0);
  }, []);

  // Face detection loop
  useEffect(() => {
    if (!streaming || !videoRef.current || !overlayCanvasRef.current) return;

    const video = videoRef.current;
    const overlay = overlayCanvasRef.current;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    let detector: any = null;
    let fallbackMode = false;

    const initDetector = async () => {
      if ("FaceDetector" in window) {
        try {
          detector = new (window as any).FaceDetector({ maxDetectedFaces: 5, fastMode: true });
        } catch {
          fallbackMode = true;
          setDetectorSupported(false);
        }
      } else {
        fallbackMode = true;
        setDetectorSupported(false);
      }
    };

    const drawFaceGuide = () => {
      overlay.width = video.videoWidth || 640;
      overlay.height = video.videoHeight || 480;
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      // Draw oval guide
      const cx = overlay.width / 2;
      const cy = overlay.height / 2;
      const rx = overlay.width * 0.22;
      const ry = overlay.height * 0.35;

      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = faceDetected ? "#22c55e" : "#FFA500";
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const detectFaces = async () => {
      if (!video || video.readyState < 2) {
        animationRef.current = requestAnimationFrame(detectFaces);
        return;
      }

      overlay.width = video.videoWidth || 640;
      overlay.height = video.videoHeight || 480;
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      if (!fallbackMode && detector) {
        try {
          const faces = await detector.detect(video);
          setFaceCount(faces.length);
          setFaceDetected(faces.length > 0);

          faces.forEach((face: any) => {
            const { x, y, width, height } = face.boundingBox;
            // Green rectangle around detected face
            ctx.strokeStyle = "#22c55e";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            // Corner accents
            const cornerLen = 15;
            ctx.strokeStyle = "#22c55e";
            ctx.lineWidth = 4;
            // Top-left
            ctx.beginPath(); ctx.moveTo(x, y + cornerLen); ctx.lineTo(x, y); ctx.lineTo(x + cornerLen, y); ctx.stroke();
            // Top-right
            ctx.beginPath(); ctx.moveTo(x + width - cornerLen, y); ctx.lineTo(x + width, y); ctx.lineTo(x + width, y + cornerLen); ctx.stroke();
            // Bottom-left
            ctx.beginPath(); ctx.moveTo(x, y + height - cornerLen); ctx.lineTo(x, y + height); ctx.lineTo(x + cornerLen, y + height); ctx.stroke();
            // Bottom-right
            ctx.beginPath(); ctx.moveTo(x + width - cornerLen, y + height); ctx.lineTo(x + width, y + height); ctx.lineTo(x + width, y + height - cornerLen); ctx.stroke();

            // Label
            ctx.fillStyle = "rgba(34, 197, 94, 0.85)";
            ctx.fillRect(x, y - 24, 120, 22);
            ctx.fillStyle = "#fff";
            ctx.font = "bold 12px Inter, sans-serif";
            ctx.fillText("Rosto detectado", x + 4, y - 8);
          });

          if (faces.length === 0) {
            drawFaceGuide();
          }
        } catch {
          drawFaceGuide();
        }
      } else {
        drawFaceGuide();
      }

      animationRef.current = requestAnimationFrame(detectFaces);
    };

    initDetector().then(() => {
      animationRef.current = requestAnimationFrame(detectFaces);
    });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [streaming, faceDetected]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvasRef.current.toDataURL("image/jpeg");
    onCapture(dataUrl);
    toast({
      title: faceDetected
        ? "✅ Foto capturada com rosto detectado!"
        : "⚠️ Foto capturada sem detecção de rosto",
      variant: faceDetected ? "default" : "destructive",
    });
  };

  return (
    <Card className="shadow-md border-none">
      <CardHeader>
        <CardTitle className="text-base text-foreground flex items-center gap-2">
          <ScanFace className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {/* Status panel */}
        <div className="w-full max-w-sm flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground">Monitoramento Facial</span>
          {!streaming ? (
            <Badge variant="outline" className="text-muted-foreground">Câmera desligada</Badge>
          ) : faceDetected ? (
            <Badge className="bg-primary text-primary-foreground gap-1">
              <CheckCircle2 className="h-3 w-3" /> {faceCount} rosto{faceCount > 1 ? "s" : ""} detectado{faceCount > 1 ? "s" : ""}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-destructive border-destructive gap-1">
              <AlertTriangle className="h-3 w-3" /> Nenhum rosto
            </Badge>
          )}
        </div>

        {!detectorSupported && streaming && (
          <p className="text-xs text-muted-foreground text-center">
            Seu navegador não suporta detecção facial nativa. Posicione o rosto dentro da guia oval.
          </p>
        )}

        {/* Camera view with overlay */}
        <div className="relative w-full max-w-sm aspect-video bg-muted rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas
            ref={overlayCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
          {!streaming && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
              <Button type="button" variant="outline" onClick={startCamera}>
                <Camera className="mr-2 h-4 w-4" /> Iniciar Câmera
              </Button>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />

        {streaming && (
          <div className="flex gap-2">
            <Button type="button" onClick={capturePhoto} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ScanFace className="mr-2 h-4 w-4" /> Tirar Foto
            </Button>
            <Button type="button" variant="outline" onClick={stopCamera}>
              Parar Câmera
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FaceDetectionCamera;
