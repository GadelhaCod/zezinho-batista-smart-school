import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import FaceDetectionCamera from "@/components/FaceDetectionCamera";

const CadastroAlunos = () => {
  const { toast } = useToast();
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({
    nome: "",
    turma: "",
    serie: "",
    email: "",
    numero_matricula: "",
    cpf: "",
    contato_pai: "",
    email_pai: "",
    horario_entrada: "",
    horario_saida: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "✅ Aluno cadastrado com sucesso!" });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-semibold text-school-green-deep">
          Cadastro de Alunos
        </h2>
        <p className="text-muted-foreground mt-1">
          Preencha os dados do aluno para realizar o cadastro.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-md border-none">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" name="nome" placeholder="Nome completo do aluno" value={form.nome} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="turma">Turma</Label>
              <Input id="turma" name="turma" placeholder="Ex: A" value={form.turma} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="serie">Série</Label>
              <Input id="serie" name="serie" placeholder="Ex: 1º Ano" value={form.serie} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">E-mail Institucional</Label>
              <Input id="email" name="email" type="email" placeholder="aluno@escola.edu.br" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="numero_matricula">Número de Matrícula</Label>
              <Input id="numero_matricula" name="numero_matricula" placeholder="Matrícula" value={form.numero_matricula} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" name="cpf" placeholder="000.000.000-00" value={form.cpf} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="contato_pai">Contato do Pai/Responsável</Label>
              <Input id="contato_pai" name="contato_pai" placeholder="(00) 00000-0000" value={form.contato_pai} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="email_pai">E-mail/Telefone do Pai (notificações)</Label>
              <Input id="email_pai" name="email_pai" placeholder="pai@email.com ou telefone" value={form.email_pai} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="horario_entrada">Horário de Entrada Padrão</Label>
              <Input id="horario_entrada" name="horario_entrada" type="time" value={form.horario_entrada} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="horario_saida">Horário de Saída Padrão</Label>
              <Input id="horario_saida" name="horario_saida" type="time" value={form.horario_saida} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <FaceDetectionCamera
          onCapture={(dataUrl) => setCapturedPhotos((prev) => [...prev, dataUrl])}
          multiple
          title="Fotos do Aluno com Reconhecimento Facial"
        />

        {capturedPhotos.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {capturedPhotos.map((p, i) => (
              <img key={i} src={p} alt={`Foto ${i + 1}`} className="w-20 h-20 rounded-md object-cover border" />
            ))}
          </div>
        )}

        <div className="w-full">
          <Label>Upload de Fotos Adicionais (3 a 5)</Label>
          <Input type="file" accept="image/*" multiple className="mt-1" />
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg transition-all">
            Cadastrar Aluno
          </Button>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CadastroAlunos;
