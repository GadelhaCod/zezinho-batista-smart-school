import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PasswordField, { usePasswordValidation } from "@/components/PasswordField";
import FaceDetectionCamera from "@/components/FaceDetectionCamera";

const CadastroProfessores = () => {
  const { toast } = useToast();
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

  const { passwordValid, passwordsMatch } = usePasswordValidation(form.senha, form.confirmarSenha);

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

        <PasswordField
          senha={form.senha}
          confirmarSenha={form.confirmarSenha}
          showPassword={showPassword}
          showConfirm={showConfirm}
          onSenhaChange={(v) => setForm((f) => ({ ...f, senha: v }))}
          onConfirmarSenhaChange={(v) => setForm((f) => ({ ...f, confirmarSenha: v }))}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onToggleConfirm={() => setShowConfirm(!showConfirm)}
        />

        <FaceDetectionCamera
          onCapture={(dataUrl) => setCapturedPhoto(dataUrl)}
          title="Foto de Perfil com Reconhecimento Facial"
        />

        {capturedPhoto && (
          <div className="flex justify-center">
            <img src={capturedPhoto} alt="Foto capturada" className="w-24 h-24 rounded-full object-cover border-2 border-secondary" />
          </div>
        )}

        <div className="w-full">
          <Label>Ou faça upload de uma foto</Label>
          <Input type="file" accept="image/*" className="mt-1" />
        </div>

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
