import { useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CadastroProfessores = () => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch {
      toast({ title: "❌ Erro ao acessar a câmera", variant: "destructive" });
    }
  }, [toast]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvasRef.current.toDataURL("image/jpeg");
    setCapturedPhoto(dataUrl);
    toast({ title: "✅ Foto capturada com sucesso!" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "✅ Professor cadastrado com sucesso!" });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-semibold text-secondary">
          Cadastro de Professores
        </h2>
        <p className="text-muted-foreground mt-1">
          Preencha os dados do professor.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-md border-none">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Dados do Professor</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">E-mail Institucional</Label>
              <Input id="email" name="email" type="email" placeholder="professor@escola.edu.br" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" name="cpf" placeholder="000.000.000-00" value={form.cpf} onChange={handleChange} required />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-none">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Foto de Perfil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <div className="relative w-full max-w-sm aspect-video bg-muted rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {!streaming && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button type="button" variant="outline" onClick={startCamera}>
                    <Camera className="mr-2 h-4 w-4" /> Iniciar Câmera
                  </Button>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
            {streaming && (
              <Button type="button" onClick={capturePhoto} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Tirar Foto
              </Button>
            )}

            {capturedPhoto && (
              <img src={capturedPhoto} alt="Foto capturada" className="w-24 h-24 rounded-full object-cover border-2 border-secondary" />
            )}

            <div className="w-full">
              <Label>Ou faça upload de uma foto</Label>
              <Input type="file" accept="image/*" className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-lg transition-all">
            Cadastrar Professor
          </Button>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CadastroProfessores;
