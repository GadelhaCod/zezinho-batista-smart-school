import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const CadastroAdministradores = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "✅ Administrador cadastrado com sucesso!" });
    navigate("/painel-admin");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Cadastro de Administradores
        </h2>
        <p className="text-muted-foreground mt-1">
          Preencha os dados do administrador.
        </p>
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
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="bg-accent-foreground text-card hover:opacity-90 px-6 py-3 rounded-lg transition-all">
            Cadastrar Administrador
          </Button>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CadastroAdministradores;
