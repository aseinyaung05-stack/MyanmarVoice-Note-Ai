
import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, LogOut, Cloud, RefreshCw, ShieldCheck } from 'lucide-react';

interface AuthProps {
  user: { email: string; name: string } | null;
  onLogin: (userData: { email: string; name: string }) => void;
  onLogout: () => void;
}

const Auth: React.FC<AuthProps> = ({ user, onLogin, onLogout }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call
    onLogin({ email, name: name || email.split('@')[0] });
  };

  if (user) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 text-blue-50 opacity-10">
            <User size={160} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <User size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">{user.name}</h2>
                <p className="text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm">
                  <Cloud size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sync Status</p>
                  <p className="text-lg font-bold text-slate-700">ချိတ်ဆက်ပြီး</p>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl text-green-600 shadow-sm">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Security</p>
                  <p className="text-lg font-bold text-slate-700">Protected</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all group">
                <div className="flex items-center gap-4">
                  <RefreshCw size={20} className="text-blue-500 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="font-bold text-slate-700">မှတ်စုများကို အခု Sync လုပ်မည်</span>
                </div>
                <span className="text-xs text-slate-400 font-bold">Last sync: Just now</span>
              </button>
              
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-4 p-5 text-red-600 bg-red-50/50 hover:bg-red-50 border border-red-100 rounded-2xl transition-all font-bold"
              >
                <LogOut size={20} />
                အကောင့်မှ ထွက်ရန်
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-[2rem] p-8 text-white flex items-center justify-between shadow-lg shadow-blue-200">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Multi-Device Sync</h3>
            <p className="text-blue-100 text-sm">သင့်မှတ်စုများကို ဖုန်း၊ တက်ဘလက်နှင့် ကွန်ပျူတာတို့တွင် တစ်ပြိုင်နက် အသုံးပြုနိုင်ပါပြီ။</p>
          </div>
          <Cloud className="opacity-40" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-10 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-200">
          <LogIn size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Sync & Backup</h2>
        <p className="text-slate-500">Device အသီးသီးမှ သင့်မှတ်စုများကို ရယူနိုင်ရန် Login ဝင်ရောက်ပါ</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">နာမည်</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="သင့်နာမည်"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">အီးမေးလ်</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                placeholder="example@mail.com"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">စကားဝှက်</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            {isLogin ? 'အကောင့်ဝင်မည်' : 'အကောင့်သစ်ဖွင့်မည်'}
          </button>
        </form>
      </div>

      <p className="text-center mt-8 text-slate-400 text-sm">
        {isLogin ? 'အကောင့်မရှိသေးဘူးလား?' : 'အကောင့်ရှိပြီးသားလား?'} 
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="ml-2 text-blue-600 font-bold hover:underline"
        >
          {isLogin ? 'Register လုပ်ပါ' : 'Login ဝင်ပါ'}
        </button>
      </p>
    </div>
  );
};

export default Auth;
