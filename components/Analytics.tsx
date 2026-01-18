
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { VoiceNote, NoteCategory } from '../types';
import { TrendingUp, Clock, Tag as TagIcon, ListChecks } from 'lucide-react';

interface AnalyticsProps {
  notes: VoiceNote[];
}

const Analytics: React.FC<AnalyticsProps> = ({ notes }) => {
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach(note => {
      counts[note.category] = (counts[note.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [notes]);

  const timeData = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach(note => {
      const date = new Date(note.timestamp).toLocaleDateString('my-MM');
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }, [notes]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const topKeywords = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach(n => n.keywords.forEach(k => counts[k] = (counts[k] || 0) + 1));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [notes]);

  const urgentCount = notes.filter(n => n.isUrgent).length;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">အချက်အလက်များကို သုံးသပ်ခြင်း</h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<ListChecks className="text-blue-500" />} 
          title="စုစုပေါင်းမှတ်စု" 
          value={notes.length.toString()} 
        />
        <StatCard 
          icon={<Clock className="text-green-500" />} 
          title="ယနေ့မှတ်စု" 
          value={notes.filter(n => new Date(n.timestamp).toDateString() === new Date().toDateString()).length.toString()} 
        />
        <StatCard 
          icon={<TrendingUp className="text-purple-500" />} 
          title="အဓိကအမျိုးအစား" 
          value={categoryData.length > 0 ? categoryData.sort((a,b) => b.value - a.value)[0].name : '-'} 
        />
        <StatCard 
          icon={<TagIcon className="text-red-500" />} 
          title="အရေးကြီးမှတ်စု" 
          value={urgentCount.toString()} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-700 mb-6">အမျိုးအစားအလိုက် ခွဲခြားမှု</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            {categoryData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-slate-600">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Pattern */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-700 mb-6">မှတ်စုပြုလုပ်မှု အခြေအနေ</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-3xl shadow-xl">
        <h3 className="text-xl font-bold mb-4">AI တွေ့ရှိချက်များ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-blue-100 mb-2">အသုံးများဆုံးစကားလုံးများ</h4>
            <div className="flex flex-wrap gap-2">
              {topKeywords.map(([word, count], idx) => (
                <span key={idx} className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {word} ({count})
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-3">
             <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <p className="text-sm">
                  {notes.length > 5 
                    ? `သင်သည် "${categoryData.sort((a,b) => b.value - a.value)[0]?.name}" နှင့် ပတ်သက်၍ အလေးပေး လုပ်ဆောင်နေသည်ကို တွေ့ရပါသည်။`
                    : "မှတ်စုများ ပိုမိုပြုလုပ်ပါက AI မှ သင့်အတွက် ပိုမိုကောင်းမွန်သော သုံးသပ်ချက်များ ထုတ်ပေးနိုင်ပါမည်။"}
                </p>
             </div>
             <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <p className="text-sm">
                  {urgentCount > 0 
                    ? `သင့်တွင် အရေးကြီးမှတ်စု (${urgentCount}) ခု ရှိနေပါသည်။ မမေ့လျော့စေရန် ပြန်လည်စစ်ဆေးပါ။` 
                    : "လက်ရှိတွင် အရေးကြီးမှတ်စုများ မရှိသေးပါ။ အားလုံးအဆင်ပြေနေပါသည်။"}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
    <div className="bg-slate-50 p-3 rounded-xl">{icon}</div>
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{title}</p>
      <p className="text-xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default Analytics;
