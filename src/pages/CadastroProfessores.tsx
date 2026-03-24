import { useState, useRef, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Eye, EyeOff, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PASSWORD_RULES = [
  { label: "Mínimo de 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Letra minúscula", test: (p: string) => /[a-z]/.test(p) },
  { label: "Número", test: (p: string) => /[0-9]/.test(p) },
  { label: "Caractere especial (!@#$%...)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const CadastroProfessores = () => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const passwordValid = useMemo(
    () => PASSWORD_RULES.every((r) => r.test(form.senha)),
    [form.senha]
  );

  const passwordsMatch = form.senha === form.confirmarSenha && form.confirmarSenha.length > 0;

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
    if (!passwordValid) {
      toast({ title: "❌ A senha não atende aos requisitos de segurança.", variant: "destructive" });
      return;
    }
    if (!passwordsMatch) {
      toast({ title: "❌ As senhas não coincidem.", variant: "destructive" });
      return;
    }
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
            <CardTitle className="text-base text-foreground">Senha de Acesso</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crie uma senha segura"
                  value={form.senha}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
              <div className="relative">
                <Input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repita a senha"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.confirmarSenha.length > 0 && !passwordsMatch && (
                <p className="text-xs text-destructive mt-1">As senhas não coincidem.</p>
              )}
            </div>
            {form.senha.length > 0 && (
              <div className="md:col-span-2 space-y-1 mt-1">
                <p className="text-xs font-medium text-muted-foreground mb-1">Requisitos da senha:</p>
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(form.senha);
                  return (
                    <div key={rule.label} className="flex items-center gap-1.5 text-xs">
                      {passed ? (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-destructive" />
                      )}
                      <span className={passed ? "text-primary" : "text-muted-foreground"}>
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
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
