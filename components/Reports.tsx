
import React, { useState } from 'react';
import { FileText, Calendar, ChevronRight, Loader2, Sparkles, Download, Share2 } from 'lucide-react';
import { VoiceNote } from '../types';
import { generateNoteReport } from '../services/geminiService';

interface ReportsProps {
  notes: VoiceNote[];
}

const Reports: React.FC<ReportsProps> = ({ notes }) => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [reportData, setReportData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Filter notes based on type
      const now = new Date();
      const filteredNotes = notes.filter(n => {
        const noteDate = new Date(n.timestamp);
        if (reportType === 'daily') return noteDate.toDateString() === now.toDateString();
        if (reportType === 'weekly') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return noteDate >= sevenDaysAgo;
        }
        if (reportType === 'monthly') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return noteDate >= thirtyDaysAgo;
        }
        return true;
      });

      if (filteredNotes.length === 0) {
        alert('ဤကာလအတွင်း မှတ်စုများ မရှိသေးပါ။');
        return;
      }

      const report = await generateNoteReport(filteredNotes, reportType);
      setReportData(report);
    } catch (err) {
      console.error(err);
      alert('အစီရင်ခံစာ ထုတ်ယူရာတွင် အမှားအယွင်းရှိခဲ့ပါသည်။');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportReport = () => {
    if (!reportData) return;
    const content = `
      မြန်မာ Voice Note AI - ${reportType === 'daily' ? 'နေ့စဉ်' : reportType === 'weekly' ? 'အပတ်စဉ်' : 'လစဉ်'} အစီရင်ခံစာ
      --------------------------------------------------
      အစီရင်ခံစာ အကျဉ်းချုပ်:
      ${reportData.summary}
      
      အဓိကအကြောင်းအရာများ:
      ${reportData.keyTopics.join(', ')}
      
      ရှာဖွေတွေ့ရှိချက်များ:
      ${reportData.insights.join('\n')}
      
      အကြံပြုချက်များ:
      ${reportData.actionRecommendations.join('\n')}
    `;
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${reportType}_${new Date().toISOString().split('T')[0]}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">အစီရင်ခံစာများ</h2>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200">
          {(['daily', 'weekly', 'monthly'] as const).map((type) => (
            <button
              key={type}
              onClick={() => { setReportType(type); setReportData(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                reportType === type ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {type === 'daily' ? 'ယနေ့' : type === 'weekly' ? 'အပတ်စဉ်' : 'လစဉ်'}
            </button>
          ))}
        </div>
      </div>

      {!reportData ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <Sparkles size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">အစီရင်ခံစာအသစ် ထုတ်ယူမည်</h3>
          <p className="text-slate-500 max-w-sm mb-8">
            AI အကူအညီဖြင့် သင့်မှတ်စုများအားလုံးကို သုံးသပ်ပြီး စနစ်တကျ အစီရင်ခံစာ ထုတ်ပေးမည်ဖြစ်သည်။
          </p>
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating || notes.length === 0}
            className={`flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <FileText />}
            {isGenerating ? 'လုပ်ဆောင်နေသည်...' : 'အစီရင်ခံစာ ထုတ်မည်'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">{reportType} REPORT</span>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">အစီရင်ခံစာ အကျဉ်းချုပ်</h3>
              </div>
              <div className="flex gap-2">
                 <button onClick={exportReport} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                   <Download size={18} /> .docx
                 </button>
                 <button onClick={() => setReportData(null)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                   ပြန်စမည်
                 </button>
              </div>
            </div>

            <div className="prose prose-slate max-w-none mb-10">
              <p className="text-lg leading-relaxed text-slate-700">{reportData.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-bold text-slate-800">
                  <ChevronRight className="text-blue-500" size={20} /> အဓိကအကြောင်းအရာများ
                </h4>
                <div className="flex flex-wrap gap-2">
                  {reportData.keyTopics.map((topic: string, i: number) => (
                    <span key={i} className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-600">{topic}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-bold text-slate-800">
                  <ChevronRight className="text-green-500" size={20} /> ရှာဖွေတွေ့ရှိချက်များ
                </h4>
                <ul className="space-y-2">
                  {reportData.insights.map((insight: string, i: number) => (
                    <li key={i} className="flex gap-2 text-slate-600 text-sm italic">
                      <span>•</span> {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100">
               <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                 <Sparkles size={18} /> လုပ်ဆောင်ရန် အကြံပြုချက်များ
               </h4>
               <ul className="space-y-3">
                 {reportData.actionRecommendations.map((action: string, i: number) => (
                   <li key={i} className="flex items-start gap-3 text-blue-800">
                      <div className="mt-1 w-5 h-5 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {i+1}
                      </div>
                      <span className="font-medium">{action}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
