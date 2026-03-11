import React, { useState, useMemo } from "react";
import {
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  FileText,
  Zap,
  ChevronRight,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  BarChart3,
  Globe,
  TrendingUp,
  MapPin,
  Upload,
  X,
} from "lucide-react";
import { UserRole } from "../../types";
import logoBranco from "../../assets/images/logo_simples_branca.png";
import { geoData } from "../../components/shared/FilterStrip";

interface RegisterScreenProps {
  onBackToLogin: () => void;
  onRegisterSuccess: (role: UserRole) => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onBackToLogin,
  onRegisterSuccess: _onRegisterSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<{
    certidao?: File;
    alvara?: File;
  }>({});

  // Form States - Todos os campos do schema.prisma
  const [formData, setFormData] = useState({
    // Step 1 - Dados do Usuário (tabla: utilizadores)
    userName: "", // nome_completo
    email: "", // email
    phone: "", // telefone (unique)
    password: "",
    confirmPassword: "",

    // Step 2 - Dados da Empresa (tabla: empresas)
    companyName: "", // nome
    nif: "", // nif (unique)
    tipoEmpresa: "", // tipo_empresa (GOVERNAMENTAL, PRIVADA, ONG)
    sector: "", // setor_atividade
    provincia: "", // provincia
    address: "", // endereco_sede

    // Step 3 - Pessoa de Contacto (empresas.responsavel_*)
    contactPerson: "", // responsavel_nome
    responsavelTelefone: "", // responsavel_telefone
    contactPersonEmail: "", // responsavel_email
    referral: "", // opcional

    // Step 5 - Termos
    termsAccepted: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const steps = [
    { n: 1, label: "Usuário" },
    { n: 2, label: "Empresa" },
    { n: 3, label: "Contacto" },
    { n: 4, label: "Documentos" },
    { n: 5, label: "Termos" },
  ];

  const isStepValid = useMemo(() => {
    if (step === 1) {
      return (
        formData.userName &&
        formData.email &&
        formData.phone &&
        formData.password &&
        formData.password === formData.confirmPassword &&
        formData.password.length >= 6
      );
    }
    if (step === 2) {
      return (
        formData.companyName &&
        formData.nif &&
        formData.tipoEmpresa &&
        formData.sector &&
        formData.provincia &&
        formData.address
      );
    }
    if (step === 3) {
      return (
        formData.contactPerson &&
        formData.responsavelTelefone &&
        formData.contactPersonEmail
      );
    }
    if (step === 4) {
      // Documentos são opcionais, mas recomendados
      return true; // Sempre permite avançar
    }
    if (step === 5) return formData.termsAccepted;
    return false;
  }, [step, formData]);

  const handleNext = () => {
    if (isStepValid && step < 5) setStep(step + 1);
    else if (step === 5) handleSubmit();
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Cadastro enviado com sucesso, a nossa equipe irá verificar.");
      onBackToLogin();
    }, 2000);
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: "certidao" | "alvara",
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("O arquivo não pode exceder 5MB");
        return;
      }
      // Validar tipo
      if (!file.type.includes("pdf") && !file.type.includes("image")) {
        alert("Apenas arquivos PDF ou imagens são permitidos");
        return;
      }
      setUploadedDocs((prev) => ({ ...prev, [docType]: file }));
    }
  };

  const handleRemoveFile = (docType: "certidao" | "alvara") => {
    setUploadedDocs((prev) => {
      const updated = { ...prev };
      delete updated[docType];
      return updated;
    });
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
      </div>

      {/* Main Container */}
      <div className="w-full h-screen flex items-stretch relative z-10">
        {/* Left Side - Visual Branding */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
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
            <div className="space-y-8">
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

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-agriYellow/20 backdrop-blur-sm border border-agriYellow/30 px-4 py-2 rounded-full">
                  <Building2 className="w-4 h-4 text-agriYellow" />
                  <span className="text-xs font-black text-agriYellow uppercase tracking-wider">
                    Acesso Empresarial
                  </span>
                </div>

                <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                  Junte-se à Revolução Agrícola
                </h1>
                <p className="text-emerald-100 text-base font-medium max-w-xl leading-relaxed">
                  Conecte a sua empresa à maior{" "}
                  <span className="font-bold text-white">
                    plataforma de inteligência agrícola
                  </span>{" "}
                  de Angola e otimize toda a sua cadeia de suprimentos.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-3 max-w-2xl">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-white/90" />
                    </div>
                    <p className="text-lg font-black text-white">Dados BI</p>
                  </div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                    Business Intelligence
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white/90" />
                    </div>
                    <p className="text-lg font-black text-white">Previsões</p>
                  </div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                    IA Preditiva Avançada
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white/90" />
                    </div>
                    <p className="text-lg font-black text-white">Geo-Intel</p>
                  </div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                    Geointeligência Espacial
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-white/90" />
                    </div>
                    <p className="text-lg font-black text-white">Seguro</p>
                  </div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                    Blockchain Certificado
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="space-y-4">
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
                      Acesso Antecipado
                    </p>
                    <p className="text-sm font-black text-white">
                      Disponível Agora
                    </p>
                  </div>
                </div>
              </div>

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

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-[55%] bg-white dark:bg-slate-900 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-xl space-y-6">
            {/* Logo for Mobile */}
            <div className="lg:hidden flex justify-center mb-6">
              <img src={logoBranco} alt="AgriConnect" className="h-12 w-auto" />
            </div>

            {/* Form Header */}
            <div className="text-center lg:text-left space-y-3">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                Criar Conta Empresarial
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Preencha os dados para solicitar acesso à plataforma
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 py-4">
              {steps.map((s) => (
                <div key={s.n} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                      step === s.n
                        ? "bg-emerald-600 text-white scale-110"
                        : step > s.n
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {step > s.n ? <Check size={16} strokeWidth={3} /> : s.n}
                  </div>
                  {s.n < steps.length && (
                    <div
                      className={`w-16 h-1 mx-1 rounded-full ${step > s.n ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`}
                    />
                  )}
                </div>
              ))}
            </div>
            {/* STEP 1: DADOS DO USUÁRIO */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right duration-500">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => updateField("userName", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Ex: João Manuel Silva"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="joao@exemplo.co.ao"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="+244 900 000 000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Senha de Acesso
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          updateField("password", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all pr-11"
                        placeholder="••••••••"
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

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Confirmar Senha
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                      className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 outline-none transition-all ${
                        formData.confirmPassword &&
                        formData.password !== formData.confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-200 dark:border-slate-700 focus:ring-emerald-500 focus:border-emerald-500"
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {formData.password &&
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-xs font-medium text-red-600 dark:text-red-400">
                        As senhas não coincidem
                      </p>
                    </div>
                  )}
              </div>
            )}

            {/* STEP 2: DADOS DA EMPRESA */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right duration-500">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Ex: AgroDistribuidora Lda"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      NIF (Número Identificação Fiscal)
                    </label>
                    <input
                      type="text"
                      value={formData.nif}
                      onChange={(e) => updateField("nif", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="5000123456"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Tipo de Empresa
                    </label>
                    <select
                      value={formData.tipoEmpresa}
                      onChange={(e) =>
                        updateField("tipoEmpresa", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                    >
                      <option value="">Selecione o Tipo</option>
                      <option value="PRIVADA">Empresa Privada</option>
                      <option value="GOVERNAMENTAL">
                        Entidade Governamental
                      </option>
                      <option value="ONG">ONG / Organização</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Setor de Atividade
                    </label>
                    <select
                      value={formData.sector}
                      onChange={(e) => updateField("sector", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                    >
                      <option value="">Selecione o Setor</option>
                      <option>Distribuição Agrícola</option>
                      <option>Logística e Transporte</option>
                      <option>Transformação Industrial</option>
                      <option>Supermercados / Retalho</option>
                      <option>Entidade Governamental</option>
                      <option>Consultoria Agrícola</option>
                      <option>Exportação/Importação</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Província da Sede
                    </label>
                    <select
                      value={formData.provincia}
                      onChange={(e) => updateField("provincia", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                    >
                      <option value="">Selecione a Província</option>
                      {Object.entries(geoData)
                        .filter(([key]) => key !== "nacional")
                        .map(([key, data]) => (
                          <option key={key} value={key}>
                            {data.label}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Morada / Sede
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                    placeholder="Endereço completo da empresa (Rua, Número, Bairro, Município)"
                  />
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl">
                  <div className="flex gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                        Documentos Necessários
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                        Após submissão, será contactado para envio da Certidão
                        de Registo Comercial e Alvará de funcionamento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PESSOA DE CONTACTO */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right duration-500">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome do Responsável / Gestor
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      updateField("contactPerson", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Nome completo do responsável pela empresa"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone do Responsável
                    </label>
                    <input
                      type="tel"
                      value={formData.responsavelTelefone}
                      onChange={(e) =>
                        updateField("responsavelTelefone", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="+244 900 000 000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      E-mail do Responsável
                    </label>
                    <input
                      type="email"
                      value={formData.contactPersonEmail}
                      onChange={(e) =>
                        updateField("contactPersonEmail", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="responsavel@empresa.co.ao"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Como conheceu o AgriConnect?
                  </label>
                  <select
                    value={formData.referral}
                    onChange={(e) => updateField("referral", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                  >
                    <option value="">Selecione uma opção (opcional)</option>
                    <option>Redes Sociais</option>
                    <option>Televisão ou Rádio</option>
                    <option>Recomendação de Parceiro</option>
                    <option>Feira ou Evento Agrícola</option>
                    <option>Site Oficial</option>
                    <option>Indicação Governamental</option>
                  </select>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-blue-900 dark:text-blue-300">
                        Informação Importante
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                        Este será o contacto principal para comunicações
                        oficiais. Certifique-se de que os dados estão corretos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: DOCUMENTOS */}
            {step === 4 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-4">
                  <FileText className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Documentos da Empresa
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Carregue os documentos oficiais (opcional, mas acelera a
                    aprovação)
                  </p>
                </div>

                {/* Certidão de Registo Comercial */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Certidão de Registo Comercial
                  </label>

                  {!uploadedDocs.certidao ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-all bg-slate-50 dark:bg-slate-800/50 group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors mb-2" />
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            Clique para carregar
                          </span>{" "}
                          ou arraste aqui
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                          PDF ou Imagem (máx. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,image/*"
                        onChange={(e) => handleFileUpload(e, "certidao")}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                            {uploadedDocs.certidao.name}
                          </p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            {(uploadedDocs.certidao.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile("certidao")}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-950 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Alvará de Funcionamento */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Alvará de Funcionamento
                  </label>

                  {!uploadedDocs.alvara ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-all bg-slate-50 dark:bg-slate-800/50 group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors mb-2" />
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            Clique para carregar
                          </span>{" "}
                          ou arraste aqui
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                          PDF ou Imagem (máx. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,image/*"
                        onChange={(e) => handleFileUpload(e, "alvara")}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                            {uploadedDocs.alvara.name}
                          </p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            {(uploadedDocs.alvara.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile("alvara")}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-950 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-blue-900 dark:text-blue-300 mb-1">
                        Documentos Opcionais
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        Pode carregar os documentos agora ou enviá-los
                        posteriormente por e-mail. O upload acelera o processo
                        de validação da sua conta.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: TERMS */}
            {step === 5 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right duration-500">
                <div className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-6 max-h-[300px] overflow-y-auto text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
                  <h5 className="text-slate-900 dark:text-white font-black uppercase text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                    Termos de Uso - Acesso Empresarial
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                        1. Proteção de Dados
                      </p>
                      <p>
                        A plataforma AgriConnect garante a proteção dos dados
                        empresariais através de criptografia SSL de grau militar
                        e blockchain certificado. Os dados de inteligência de
                        mercado são processados em conformidade com as leis
                        angolanas de proteção de dados.
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                        2. Validação de Credenciais
                      </p>
                      <p>
                        Todas as contas empresariais passam por verificação de
                        identidade fiscal (NIF) e validação documental em até 48
                        horas. O acesso completo aos módulos de Business
                        Intelligence é concedido após aprovação.
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                        3. Responsabilidade
                      </p>
                      <p>
                        A empresa compromete-se a utilizar os dados da
                        plataforma de forma ética e legal, respeitando os
                        direitos dos produtores e transportadores cadastrados.
                        Qualquer uso indevido resultará em suspensão imediata.
                      </p>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-emerald-500 transition-all group">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                      formData.termsAccepted
                        ? "bg-emerald-600 border-emerald-600 scale-110"
                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {formData.termsAccepted && (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.termsAccepted}
                    onChange={(e) =>
                      updateField("termsAccepted", e.target.checked)
                    }
                  />
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      Li e aceito os Termos de Uso
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Concordo com as políticas de proteção de dados e
                      responsabilidade contratual
                    </p>
                  </div>
                </label>

                <div className="p-5 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900 rounded-xl">
                  <div className="flex gap-3 mb-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-amber-900 dark:text-amber-300 mb-1">
                        Aprovação Pendente
                      </h4>
                      <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                        Após o registo, a equipa AgriConnect irá verificar e
                        aprovar o seu acesso. Sua conta ficará{" "}
                        <span className="font-black">
                          pendente até a aprovação
                        </span>{" "}
                        da nossa equipa.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    Verificação em{" "}
                    <span className="font-black">24-48 horas</span>. Receberá
                    confirmação por e-mail e SMS quando a sua conta for ativada.
                  </p>
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-800 mt-8">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <ArrowLeft size={16} /> Voltar
                </button>
              )}
              <button
                disabled={!isStepValid || isSubmitting}
                onClick={handleNext}
                className={`flex-grow py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isStepValid
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Zap className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {step === 5 ? "Concluir Registo" : "Continuar"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Back to Login */}
            <div className="pt-6 text-center">
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
                Já possui uma conta ativa?
              </p>
              <button
                onClick={onBackToLogin}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-sm transition-colors inline-flex items-center gap-2 group"
              >
                Entrar no Sistema
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
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
    </div>
  );
};

export default RegisterScreen;
