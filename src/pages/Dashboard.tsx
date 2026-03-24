import { Users, GraduationCap, Clock, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const stats = [
  {
    title: "Total de Alunos Presentes Hoje",
    value: "0",
    icon: UserCheck,
    accent: "primary" as const,
  },
  {
    title: "Total de Professores Cadastrados",
    value: "0",
    icon: GraduationCap,
    accent: "secondary" as const,
  },
  {
    title: "Total de Alunos Cadastrados",
    value: "0",
    icon: Users,
    accent: "primary" as const,
  },
  {
    title: "Registros de Frequência Hoje",
    value: "0",
    icon: Clock,
    accent: "secondary" as const,
  },
];

const recentEntries = [
  { name: "Nenhum registro ainda", time: "--:--" },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-school-green-deep">Visão Geral</h2>
        <p className="text-muted-foreground mt-1">
          Resumo do dia na Escola Zezinho Batista
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="shadow-md border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg ${
                  s.accent === "primary"
                    ? "bg-school-green-light text-primary"
                    : "bg-school-orange-light text-secondary"
                }`}
              >
                <s.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent entries */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Últimas Entradas de Frequência
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentEntries.map((entry, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <span className="font-medium text-foreground">{entry.name}</span>
                <span className="text-muted-foreground text-sm">{entry.time}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
