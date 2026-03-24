import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const aulas = Array.from({ length: 9 }, (_, i) => `Aula ${i + 1}`);

const Relatorios = () => {
  const [date, setDate] = useState<Date>();
  const [turma, setTurma] = useState("");

  // Placeholder data
  const alunos: any[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-school-green-deep">
          Relatório de Frequência Diária
        </h2>
        <p className="text-muted-foreground mt-1">
          Filtre por data e turma para visualizar a frequência dos alunos.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Data</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy") : "Selecione a data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Turma</label>
          <Select value={turma} onValueChange={setTurma}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione a turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Turma A</SelectItem>
              <SelectItem value="B">Turma B</SelectItem>
              <SelectItem value="C">Turma C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Filtrar
        </Button>
      </div>

      {/* Table or empty state */}
      {alunos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            Nenhum dado de frequência encontrado para o período selecionado.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="min-w-[180px]">Nome do Aluno</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Entrada</TableHead>
                {aulas.map((a) => (
                  <TableHead key={a} className="text-center min-w-[70px]">
                    {a}
                  </TableHead>
                ))}
                <TableHead className="text-center">% Infrequência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alunos.map((aluno: any) => (
                <TableRow key={aluno.id}>
                  <TableCell className="font-medium">{aluno.nome}</TableCell>
                  <TableCell>{aluno.turma}</TableCell>
                  <TableCell>{aluno.matricula}</TableCell>
                  <TableCell>{aluno.entrada}</TableCell>
                  {aulas.map((_, i) => (
                    <TableCell key={i} className="text-center">
                      <Checkbox checked={aluno.aulas[i]} />
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-semibold">
                    {aluno.infrequencia}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Relatorios;
