
import React, { useState, useEffect } from 'react';
import { Mic, FileText, BarChart3, ClipboardList, Settings, Sparkles, User, Cloud, LogIn } from 'lucide-react';
import Recorder from './components/Recorder';
import NoteList from './components/NoteList';
import Analytics from './components/Analytics';
import Reports from './components/Reports';
import Auth from './components/Auth';
import { VoiceNote } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'record' | 'notes' | 'analytics' | 'reports' | 'account'>('record');
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('myanmar_voice_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    const savedUser = localStorage.getItem('myanmar_ai_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('myanmar_voice_notes', JSON.stringify(notes));
  }, [notes]);

  const handleNoteCreated = (newNote: VoiceNote) => {
    setNotes(prev => [newNote, ...prev]);
    setActiveTab('notes');
  };

  const handleUpdateNote = (updatedNote: VoiceNote) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('ဤမှတ်စုကို ဖျက်မည်မှာ သေချာပါသလား?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleLogin = (userData: { email: string; name: string }) => {
    setUser(userData);
    localStorage.setItem('myanmar_ai_user', JSON.stringify(userData));
    setActiveTab('record');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('myanmar_ai_user');
    setActiveTab('account');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-['Pyidaungsu']">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-slate-900 hidden md:flex flex-col text-slate-300 z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/50">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white leading-tight">Myanmar AI</h1>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Secretary Pro</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            <NavButton 
              active={activeTab === 'record'} 
              onClick={() => setActiveTab('record')} 
              icon={<Mic size={20} />} 
              label="အသံဖမ်းမည်" 
            />
            <NavButton 
              active={activeTab === 'notes'} 
              onClick={() => setActiveTab('notes')} 
              icon={<ClipboardList size={20} />} 
              label="မှတ်စုများ" 
            />
            <NavButton 
              active={activeTab === 'analytics'} 
              onClick={() => setActiveTab('analytics')} 
              icon={<BarChart3 size={20} />} 
              label="သုံးသပ်ချက်များ" 
            />
            <NavButton 
              active={activeTab === 'reports'} 
              onClick={() => setActiveTab('reports')} 
              icon={<FileText size={20} />} 
              label="အစီရင်ခံစာများ" 
            />
            <NavButton 
              active={activeTab === 'account'} 
              onClick={() => setActiveTab('account')} 
              icon={user ? <User size={20} /> : <LogIn size={20} />} 
              label={user ? "အကောင့်" : "ဝင်ရောက်ရန်"} 
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
          <div className={`flex items-center gap-3 p-3 rounded-xl ${user ? 'bg-slate-800/50' : 'bg-red-900/10'}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${user ? 'bg-blue-500' : 'bg-slate-700'}`}>
              {user ? <Cloud size={20} /> : <Cloud size={20} className="opacity-30" />}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user ? 'Cloud Synced' : 'Offline Mode'}</p>
              <p className="text-[10px] text-slate-500 uppercase">{user ? user.name : 'Not Signed In'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 md:ml-72 pb-24 md:pb-10 transition-all">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'record' && (
            <div className="flex flex-col items-center justify-center min-h-[75vh]">
              <Recorder onNoteCreated={handleNoteCreated} />
            </div>
          )}
          
          {activeTab === 'notes' && (
            <NoteList 
              notes={notes} 
              onUpdateNote={handleUpdateNote} 
              onDeleteNote={handleDeleteNote} 
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics notes={notes} />
          )}

          {activeTab === 'reports' && (
            <Reports notes={notes} />
          )}

          {activeTab === 'account' && (
            <Auth user={user} onLogin={handleLogin} onLogout={handleLogout} />
          )}
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-4 md:hidden z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <MobileNavButton active={activeTab === 'record'} onClick={() => setActiveTab('record')} icon={<Mic size={24} />} />
        <MobileNavButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={<ClipboardList size={24} />} />
        <MobileNavButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart3 size={24} />} />
        <MobileNavButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<FileText size={24} />} />
        <MobileNavButton active={activeTab === 'account'} onClick={() => setActiveTab('account')} icon={<User size={24} />} />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
    }`}
  >
    {icon}
    <span className="font-semibold text-[15px]">{label}</span>
  </button>
);

const MobileNavButton = ({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-2xl transition-all ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
  >
    {icon}
  </button>
);

export default App;
