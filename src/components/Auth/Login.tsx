import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Lock, 
  Mail, 
  Loader2, 
  AlertCircle, 
  LogIn, 
  Eye, 
  EyeOff, 
  Phone,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import OrganicParticles from './OrganicParticles';
import FeedbackBanner from '../Common/FeedbackBanner';
import { DEFAULT_APP_HASH, isLoginHash } from '../../lib/routes';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  React.useEffect(() => {
    const flashMessage = window.sessionStorage.getItem('agriconnect-company-flash');
    if (flashMessage) {
      setSuccess(flashMessage);
      window.sessionStorage.removeItem('agriconnect-company-flash');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Credenciais inválidas. Verifique os seus dados de acesso.');
        return;
      }

      setSuccess('Login efetuado com sucesso. A redirecionar para o painel...');
      window.setTimeout(() => {
        const currentHash = window.location.hash;
        window.location.hash = isLoginHash(currentHash) ? DEFAULT_APP_HASH : currentHash || DEFAULT_APP_HASH;
      }, 500);
    } catch (err) {
      setError('Ocorreu um erro ao tentar entrar. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Brand & Message */}
      <div className="md:w-1/2 bg-[#042f1a] relative flex flex-col justify-center p-12 md:p-24 overflow-hidden">
        <OrganicParticles />
        {/* Subtle Network Pattern Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
         
        </div>

        <div className="relative z-10 space-y-12">
          {/* Logo */}
          <div className="flex items-center gap-4">
              <img 
                src="/Assets/Logos/logo_simples_branca.png" 
                alt="AgriConnect Logo" 
                className="w-18 h-18 object-contain"
                referrerPolicy="no-referrer"
              />
            <h2 className="text-4xl font-black text-white tracking-tighter">AgriConnect</h2>
          </div>

          {/* Slogan */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Prever,<br />
              <span className="text-[#f27d26]">Transportar</span><br />
              & Crescer.
            </h1>
            <p className="text-emerald-100/80 text-lg max-w-md leading-relaxed">
              A principal <span className="text-white font-bold">Central de Inteligência Agrícola</span> em Angola. Conectando o campo ao mercado com tecnologia de ponta.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-10"
        >
          <div className="space-y-6">
            
            
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Acesso Restrito</h2>
              <p className="text-gray-400 font-medium">Central de Inteligência Agrícola</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <FeedbackBanner
                type="success"
                title="Acesso autorizado"
                message={success}
                onDismiss={() => setSuccess('')}
              />
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-2 ml-1">
                <Mail className="w-4 h-4 text-gray-400" />
                Email de acesso
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="empresa@agriconnect.ao"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-2 ml-1">
                <Lock className="w-4 h-4 text-gray-400" />
                Senha de Acesso
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium placeholder:text-gray-300"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs font-bold text-gray-400 hover:text-emerald-600 transition-colors">
                Esqueceu a senha?
              </button>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <FeedbackBanner
                  type="error"
                  title="Falha no login"
                  message={error}
                  onDismiss={() => setError('')}
                />
              </motion.div>
            )}

            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-600">
              Credenciais de demonstração: `empresa@agriconnect.ao` com a senha `empresa123`.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#10b981] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#059669] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>

          <div className="pt-8 border-t border-gray-100 space-y-8">

            <div className="text-center space-y-2">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Dúvidas? Entre em contacto:</p>
              <p className="text-sm font-black text-emerald-600 tracking-tight">(+244) 925 206 298</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
