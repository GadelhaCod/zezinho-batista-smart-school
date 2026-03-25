import { useState } from "react";
import { Users, GraduationCap, Clock, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FaceDetectionCamera from "@/components/FaceDetectionCamera";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [lastCapture, setLastCapture] = useState<string | null>(null);

  const handleAttendanceCapture = (dataUrl: string) => {
    setLastCapture(dataUrl);
    toast({
      title: "📸 Registro de frequência capturado!",
      description: "A imagem será processada para identificação do aluno/professor.",
    });
  };

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

      {/* Face detection camera for attendance */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Registro de Frequência por Reconhecimento Facial
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FaceDetectionCamera
            onCapture={handleAttendanceCapture}
            title="Câmera de Frequência — Detecção Facial"
          />
          <Card className="shadow-md border-none">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Último Registro</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
              {lastCapture ? (
                <>
                  <img
                    src={lastCapture}
                    alt="Último registro"
                    className="w-40 h-40 rounded-xl object-cover border-2 border-primary"
                  />
                  <p className="text-sm text-muted-foreground">
                    Captura realizada — aguardando identificação
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">
                  Nenhuma captura realizada. Inicie a câmera para registrar a frequência.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
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
