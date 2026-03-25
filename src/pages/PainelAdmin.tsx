import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2, Search, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Pessoa {
  id: string;
  nome: string;
  email: string;
  matricula?: string;
  turma?: string;
  cpf?: string;
}

const mockAlunos: Pessoa[] = [
  { id: "1", nome: "João Silva", email: "joao@escola.edu.br", matricula: "2024001", turma: "A" },
  { id: "2", nome: "Maria Santos", email: "maria@escola.edu.br", matricula: "2024002", turma: "B" },
];

const mockProfessores: Pessoa[] = [
  { id: "1", nome: "Prof. Carlos Lima", email: "carlos@escola.edu.br", cpf: "***.***.***-01" },
  { id: "2", nome: "Prof. Ana Costa", email: "ana@escola.edu.br", cpf: "***.***.***-02" },
];

const PainelAdmin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchAluno, setSearchAluno] = useState("");
  const [searchProfessor, setSearchProfessor] = useState("");
  const [alunos, setAlunos] = useState<Pessoa[]>(mockAlunos);
  const [professores, setProfessores] = useState<Pessoa[]>(mockProfessores);

  const handleDelete = (tipo: "aluno" | "professor", id: string) => {
    if (tipo === "aluno") {
      setAlunos((prev) => prev.filter((a) => a.id !== id));
    } else {
      setProfessores((prev) => prev.filter((p) => p.id !== id));
    }
    toast({ title: `✅ ${tipo === "aluno" ? "Aluno" : "Professor"} removido com sucesso!` });
  };

  const filteredAlunos = alunos.filter(
    (a) =>
      a.nome.toLowerCase().includes(searchAluno.toLowerCase()) ||
      a.matricula?.includes(searchAluno)
  );

  const filteredProfessores = professores.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchProfessor.toLowerCase()) ||
      p.email.toLowerCase().includes(searchProfessor.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Painel do Administrador</h2>
        <p className="text-muted-foreground mt-1">
          Gerencie alunos e professores cadastrados no sistema.
        </p>
      </div>

      <Tabs defaultValue="alunos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alunos">Alunos</TabsTrigger>
          <TabsTrigger value="professores">Professores</TabsTrigger>
        </TabsList>

        <TabsContent value="alunos" className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou matrícula..."
                value={searchAluno}
                onChange={(e) => setSearchAluno(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => navigate("/alunos")} className="bg-primary text-primary-foreground">
              <UserPlus className="mr-2 h-4 w-4" /> Novo Aluno
            </Button>
          </div>
          <Card className="shadow-md border-none">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlunos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          Nenhum aluno encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAlunos.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium">{a.nome}</TableCell>
                          <TableCell>{a.email}</TableCell>
                          <TableCell>{a.matricula}</TableCell>
                          <TableCell>{a.turma}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button size="icon" variant="ghost" title="Editar">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive"
                                title="Excluir"
                                onClick={() => handleDelete("aluno", a.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professores" className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={searchProfessor}
                onChange={(e) => setSearchProfessor(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => navigate("/professores")} className="bg-secondary text-secondary-foreground">
              <UserPlus className="mr-2 h-4 w-4" /> Novo Professor
            </Button>
          </div>
          <Card className="shadow-md border-none">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfessores.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          Nenhum professor encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProfessores.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.nome}</TableCell>
                          <TableCell>{p.email}</TableCell>
                          <TableCell>{p.cpf}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button size="icon" variant="ghost" title="Editar">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive"
                                title="Excluir"
                                onClick={() => handleDelete("professor", p.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PainelAdmin;
