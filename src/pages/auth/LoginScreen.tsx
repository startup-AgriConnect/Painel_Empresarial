import React, { useState } from "react";
import { UserRole } from "../../types";
import {
  ShieldCheck,
  Building2,
  Lock,
  LogIn,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  BarChart3,
  Globe,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import logoBranco from "../../assets/images/logo_simples_branca.png";

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
  onGoToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onGoToRegister,
}) => {
  const { login, isLoading, error } = useAuth();
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);

    // Validação básica
    if (!telefone || !senha) {
      setShowError(true);
      return;
    }

    if (senha.length < 6) {
      setShowError(true);
      return;
    }

    // Login via AuthContext
    const success = await login(telefone, senha);
    if (success) {
      onLogin(UserRole.GOVERNMENT); // Callback para App.tsx
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Background Animated Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-950" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-600/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-agriYellow/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Main Container */}
      <div className="w-full h-screen flex items-stretch relative z-10">
        {/* Left Side - Visual Area */}
        <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/95 via-emerald-800/98 to-slate-950/98" />

          {/* Grid Pattern Background */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full flex flex-col justify-between p-16">
            {/* Logo and Main Title */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <img
                  src={logoBranco}
                  alt="AgriConnect Logo"
                  className="h-20 w-auto"
                />
                <span className="text-4xl font-black text-white tracking-tight">
                  AgriConnect
                </span>
              </div>

              {/* Main Slogan */}
              <div
                className="space-y-6 animate-in slide-in-from-left duration-700"
                style={{ animationDelay: "200ms" }}
              >
                <div className="space-y-3">
                  <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tight">
                    Prever,
                  </h1>
                  <h1 className="text-6xl font-black text-agriYellow leading-[1.1] tracking-tight">
                    Transportar
                  </h1>
                  <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tight">
                    & Crescer.
                  </h1>
                </div>
                <p className="text-emerald-100 text-base font-medium max-w-xl leading-relaxed">
                  A principal{" "}
                  <span className="font-bold text-white">
                    Central de Inteligência Agrícola
                  </span>{" "}
                  em Angola. Conectando o campo ao mercado com tecnologia de
                  ponta.
                </p>
              </div>

              {/* Tech Features */}
              <div
                className="grid grid-cols-2 gap-3 max-w-2xl animate-in slide-in-from-left duration-700"
                style={{ animationDelay: "400ms" }}
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-white/90" />
                    </div>
                    <p className="text-lg font-black text-white">98%</p>
                  </div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                    Precisão Geoespacial
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white/90" />
                    </div>
                    <p className="text-lg font-black text-white">Real-time</p>
                  </div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                    Atualização de Dados
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white/90" />
                    </div>
                    <p className="text-lg font-black text-white">4 semanas</p>
                  </div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                    Antecedência Preditiva
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white/90" />
                    </div>
                    <p className="text-lg font-black text-white">24/7</p>
                  </div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                    Monitoramento IA
                  </p>
                </div>
              </div>

              {/* Tech Stack Icons */}
              <div
                className="flex items-center gap-4 flex-wrap animate-in slide-in-from-left duration-700"
                style={{ animationDelay: "600ms" }}
              >
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
                  <Sparkles className="w-4 h-4 text-white/80" />
                  <span className="text-xs font-bold text-white">
                    Machine Learning
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
                  <ShieldCheck className="w-4 h-4 text-white/80" />
                  <span className="text-xs font-bold text-white">
                    Blockchain
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
                  <Globe className="w-4 h-4 text-white/80" />
                  <span className="text-xs font-bold text-white">
                    Google Earth Engine
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Data Visualization Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
              <div
                className="absolute top-1/4 left-1/4 w-20 h-20 border-2 border-emerald-400/30 rounded-lg animate-float"
                style={{ animationDelay: "0s" }}
              >
                <div className="absolute inset-2 border border-emerald-400/20 rounded-md" />
              </div>
              <div
                className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-agriYellow/30 rounded-full animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="absolute inset-2 border border-agriYellow/20 rounded-full" />
              </div>
              <div
                className="absolute bottom-1/3 left-1/3 w-24 h-24 border-2 border-blue-400/30 rounded-xl animate-float"
                style={{ animationDelay: "3s" }}
              >
                <div className="absolute inset-3 border border-blue-400/20 rounded-lg" />
              </div>
            </div>

            {/* Bottom Info */}
            <div
              className="space-y-4 animate-in slide-in-from-bottom duration-700"
              style={{ animationDelay: "800ms" }}
            >
              {/* Launch Info */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-agriYellow uppercase tracking-widest mb-1">
                      Lançamento Oficial
                    </p>
                    <p className="text-xl font-black text-white">
                      3 de Julho de 2026
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider mb-1">
                      Painel Empresarial
                    </p>
                    <p className="text-sm font-black text-white">
                      Em Acesso Antecipado
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold">
                    Protocolo Seguro SSL
                  </span>
                </div>
                <div className="text-emerald-200 text-xs font-bold">
                  Angola • v4.0.5
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Compact Login Form */}
        <div className="w-full lg:w-[40%] bg-white dark:bg-slate-900 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md space-y-8 animate-in slide-in-from-right duration-700">
            {/* Logo for Mobile */}
            <div className="lg:hidden flex justify-center mb-8">
              <img src={logoBranco} alt="AgriConnect" className="h-12 w-auto" />
            </div>

            {/* Form Header */}
            <div className="text-center lg:text-left space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-full mb-4">
                <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                  Painel Empresarial
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                Acesso Restrito
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Central de Inteligência Agrícola
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Telefone Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone
                </label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => {
                    setTelefone(e.target.value);
                    setShowError(false);
                  }}
                  placeholder="+244 900 000 000"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Senha de Acesso
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value);
                      setShowError(false);
                    }}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {(showError || error) && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl animate-in slide-in-from-top duration-300">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                    {error || "Credenciais inválidas"}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all group flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    Entrar no Sistema
                  </>
                )}
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-medium transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
            </form>

            {/* Register Link */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="text-center space-y-3">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Ainda não tem acesso empresarial?
                </p>
                <button
                  onClick={onGoToRegister}
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-sm transition-colors inline-flex items-center gap-2 group"
                >
                  Solicitar Credenciais
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="pt-4 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Dúvidas? Entre em contacto:
              </p>
              <a
                href="tel:+244925206298"
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                (+244) 925 206 298
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(3deg);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
