import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PasswordField from "@/components/PasswordField";
import FaceDetectionCamera from "@/components/FaceDetectionCamera";

const CadastroAdministradores = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmarSenha: "" });
  const [fotoCapturada, setFotoCapturada] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fotoCapturada) {
      toast({ title: "⚠️ Capture a foto com reconhecimento facial antes de cadastrar.", variant: "destructive" });
      return;
    }
    toast({ title: "✅ Administrador cadastrado com sucesso!" });
    navigate("/painel-admin");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Cadastro de Administradores</h2>
        <p className="text-muted-foreground mt-1">Preencha os dados do administrador.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-md border-none">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Dados do Administrador</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="admin@escola.edu.br" value={form.email} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <PasswordField value={form.senha} onChange={(val) => setForm({ ...form, senha: val })} />
            </div>
          </CardContent>
        </Card>

        <FaceDetectionCamera
          onCapture={(dataUrl) => setFotoCapturada(dataUrl)}
          title="Foto do Administrador — Reconhecimento Facial"
        />

        {fotoCapturada && (
          <div className="flex items-center gap-3">
            <img src={fotoCapturada} alt="Foto capturada" className="w-20 h-20 rounded-lg object-cover border-2 border-primary" />
            <span className="text-sm text-muted-foreground">Foto capturada com sucesso</span>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" className="bg-accent-foreground text-card hover:opacity-90 px-6 py-3 rounded-lg transition-all">
            Cadastrar Administrador
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/")}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CadastroAdministradores;
