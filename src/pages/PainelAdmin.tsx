import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, Search, UserPlus, Lock, LogIn } from "lucide-react";
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

const ADMIN_CREDENTIALS = { email: "admin@escola.edu.br", senha: "Admin@123" };

const PainelAdmin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", senha: "" });

  // Data state
  const [searchAluno, setSearchAluno] = useState("");
  const [searchProfessor, setSearchProfessor] = useState("");
  const [alunos, setAlunos] = useState<Pessoa[]>(mockAlunos);
  const [professores, setProfessores] = useState<Pessoa[]>(mockProfessores);

  // Edit modal state
  const [editDialog, setEditDialog] = useState(false);
  const [editTipo, setEditTipo] = useState<"aluno" | "professor">("aluno");
  const [editData, setEditData] = useState<Pessoa | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email === ADMIN_CREDENTIALS.email && loginForm.senha === ADMIN_CREDENTIALS.senha) {
      setIsLoggedIn(true);
      toast({ title: "✅ Login realizado com sucesso!" });
    } else {
      toast({ title: "❌ E-mail ou senha incorretos.", variant: "destructive" });
    }
  };

  const handleDelete = (tipo: "aluno" | "professor", id: string) => {
    if (tipo === "aluno") {
      setAlunos((prev) => prev.filter((a) => a.id !== id));
    } else {
      setProfessores((prev) => prev.filter((p) => p.id !== id));
    }
    toast({ title: `✅ ${tipo === "aluno" ? "Aluno" : "Professor"} removido com sucesso!` });
  };

  const openEdit = (tipo: "aluno" | "professor", pessoa: Pessoa) => {
    setEditTipo(tipo);
    setEditData({ ...pessoa });
    setEditDialog(true);
  };

  const handleEditSave = () => {
    if (!editData) return;
    if (editTipo === "aluno") {
      setAlunos((prev) => prev.map((a) => (a.id === editData.id ? editData : a)));
    } else {
      setProfessores((prev) => prev.map((p) => (p.id === editData.id ? editData : p)));
    }
    setEditDialog(false);
    toast({ title: `✅ ${editTipo === "aluno" ? "Aluno" : "Professor"} atualizado com sucesso!` });
  };

  const filteredAlunos = alunos.filter(
    (a) => a.nome.toLowerCase().includes(searchAluno.toLowerCase()) || a.matricula?.includes(searchAluno)
  );

  const filteredProfessores = professores.filter(
    (p) => p.nome.toLowerCase().includes(searchProfessor.toLowerCase()) || p.email.toLowerCase().includes(searchProfessor.toLowerCase())
  );

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md shadow-lg border-none">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl text-foreground">Acesso ao Painel Admin</CardTitle>
            <p className="text-sm text-muted-foreground">
              Faça login com suas credenciais de administrador.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">E-mail</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="admin@escola.edu.br"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-senha">Senha</Label>
                <Input
                  id="login-senha"
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.senha}
                  onChange={(e) => setLoginForm({ ...loginForm, senha: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground">
                <LogIn className="mr-2 h-4 w-4" /> Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Painel do Administrador</h2>
          <p className="text-muted-foreground mt-1">Gerencie alunos e professores cadastrados no sistema.</p>
        </div>
        <Button variant="outline" onClick={() => setIsLoggedIn(false)} className="text-destructive border-destructive hover:bg-destructive/10">
          Sair
        </Button>
      </div>

      <Tabs defaultValue="alunos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alunos">Alunos</TabsTrigger>
          <TabsTrigger value="professores">Professores</TabsTrigger>
        </TabsList>

        {/* Alunos Tab */}
        <TabsContent value="alunos" className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou matrícula..." value={searchAluno} onChange={(e) => setSearchAluno(e.target.value)} className="pl-9" />
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
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum aluno encontrado.</TableCell>
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
                              <Button size="icon" variant="ghost" title="Editar" onClick={() => openEdit("aluno", a)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="text-destructive" title="Excluir" onClick={() => handleDelete("aluno", a.id)}>
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

        {/* Professores Tab */}
        <TabsContent value="professores" className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou e-mail..." value={searchProfessor} onChange={(e) => setSearchProfessor(e.target.value)} className="pl-9" />
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
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">Nenhum professor encontrado.</TableCell>
                      </TableRow>
                    ) : (
                      filteredProfessores.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.nome}</TableCell>
                          <TableCell>{p.email}</TableCell>
                          <TableCell>{p.cpf}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button size="icon" variant="ghost" title="Editar" onClick={() => openEdit("professor", p)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="text-destructive" title="Excluir" onClick={() => handleDelete("professor", p.id)}>
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

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar {editTipo === "aluno" ? "Aluno" : "Professor"}</DialogTitle>
          </DialogHeader>
          {editData && (
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={editData.nome} onChange={(e) => setEditData({ ...editData, nome: e.target.value })} />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
              </div>
              {editTipo === "aluno" && (
                <>
                  <div>
                    <Label>Matrícula</Label>
                    <Input value={editData.matricula || ""} onChange={(e) => setEditData({ ...editData, matricula: e.target.value })} />
                  </div>
                  <div>
                    <Label>Turma</Label>
                    <Input value={editData.turma || ""} onChange={(e) => setEditData({ ...editData, turma: e.target.value })} />
                  </div>
                </>
              )}
              {editTipo === "professor" && (
                <div>
                  <Label>CPF</Label>
                  <Input value={editData.cpf || ""} onChange={(e) => setEditData({ ...editData, cpf: e.target.value })} />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>Cancelar</Button>
            <Button onClick={handleEditSave} className="bg-primary text-primary-foreground">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PainelAdmin;
