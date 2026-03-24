import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Check, X, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PASSWORD_RULES = [
  { label: "Mínimo de 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Letra maiúscula (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Letra minúscula (a-z)", test: (p: string) => /[a-z]/.test(p) },
  { label: "Número (0-9)", test: (p: string) => /[0-9]/.test(p) },
  { label: "Caractere especial (!@#$%...)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

interface PasswordFieldProps {
  senha: string;
  confirmarSenha: string;
  showPassword: boolean;
  showConfirm: boolean;
  onSenhaChange: (value: string) => void;
  onConfirmarSenhaChange: (value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirm: () => void;
}

export const usePasswordValidation = (senha: string, confirmarSenha: string) => {
  const passwordValid = useMemo(() => PASSWORD_RULES.every((r) => r.test(senha)), [senha]);
  const passwordsMatch = senha === confirmarSenha && confirmarSenha.length > 0;
  return { passwordValid, passwordsMatch, PASSWORD_RULES };
};

const PasswordField = ({
  senha,
  confirmarSenha,
  showPassword,
  showConfirm,
  onSenhaChange,
  onConfirmarSenhaChange,
  onTogglePassword,
  onToggleConfirm,
}: PasswordFieldProps) => {
  const strength = useMemo(() => {
    const passed = PASSWORD_RULES.filter((r) => r.test(senha)).length;
    if (senha.length === 0) return 0;
    return Math.round((passed / PASSWORD_RULES.length) * 100);
  }, [senha]);

  const strengthColor = strength < 40 ? "bg-destructive" : strength < 80 ? "bg-yellow-500" : "bg-primary";
  const strengthLabel = strength < 40 ? "Fraca" : strength < 80 ? "Média" : "Forte";
  const passwordsMatch = senha === confirmarSenha && confirmarSenha.length > 0;

  return (
    <Card className="shadow-md border-none">
      <CardHeader>
        <CardTitle className="text-base text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Senha de Acesso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Criteria box - always visible */}
        <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
          <p className="text-xs font-semibold text-foreground mb-2">A senha deve conter:</p>
          {PASSWORD_RULES.map((rule) => {
            const passed = senha.length > 0 && rule.test(senha);
            const neutral = senha.length === 0;
            return (
              <div key={rule.label} className="flex items-center gap-2 text-xs">
                {neutral ? (
                  <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/40" />
                ) : passed ? (
                  <Check className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <X className="h-3.5 w-3.5 text-destructive" />
                )}
                <span className={neutral ? "text-muted-foreground" : passed ? "text-primary font-medium" : "text-destructive"}>
                  {rule.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="senha">Senha</Label>
            <div className="relative">
              <Input
                id="senha"
                name="senha"
                type={showPassword ? "text" : "password"}
                placeholder="Crie uma senha segura"
                value={senha}
                onChange={(e) => onSenhaChange(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={onTogglePassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {/* Strength bar */}
            {senha.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strengthColor}`} style={{ width: `${strength}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Força: <span className={`font-semibold ${strength >= 80 ? "text-primary" : strength >= 40 ? "text-yellow-600" : "text-destructive"}`}>{strengthLabel}</span>
                </p>
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type={showConfirm ? "text" : "password"}
                placeholder="Repita a senha"
                value={confirmarSenha}
                onChange={(e) => onConfirmarSenhaChange(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={onToggleConfirm}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmarSenha.length > 0 && (
              <p className={`text-xs mt-1 ${passwordsMatch ? "text-primary" : "text-destructive"}`}>
                {passwordsMatch ? "✅ As senhas coincidem" : "❌ As senhas não coincidem"}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordField;
