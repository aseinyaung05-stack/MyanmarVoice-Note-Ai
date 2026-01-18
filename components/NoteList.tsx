
import React, { useState } from 'react';
import { Calendar, Tag, Trash2, Edit3, Check, X, Share2, Download, AlertCircle, ClipboardList, Clock } from 'lucide-react';
import { VoiceNote } from '../types';

interface NoteListProps {
  notes: VoiceNote[];
  onUpdateNote: (note: VoiceNote) => void;
  onDeleteNote: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onUpdateNote, onDeleteNote }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter(n => 
    n.enhancedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const startEditing = (note: VoiceNote) => {
    setEditingId(note.id);
    setEditedText(note.enhancedText);
  };

  const saveEdit = (note: VoiceNote) => {
    onUpdateNote({ ...note, enhancedText: editedText });
    setEditingId(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('မှတ်စုကို Clipboard သို့ ကူးယူပြီးပါပြီ။');
  };

  const exportAsWord = (note: VoiceNote) => {
    const content = `
Myanmar Voice Note AI Report
Generated on: ${new Date().toLocaleString()}

DATE: ${new Date(note.timestamp).toLocaleString()}
CATEGORY: ${note.category}
SUMMARY: ${note.summary}

DETAILED NOTE:
${note.enhancedText}

KEYWORDS: ${note.keywords.join(', ')}
    `;
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Note_${note.id.substring(0, 8)}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">သိမ်းဆည်းထားသော မှတ်စုများ</h2>
          <p className="text-slate-500">စုစုပေါင်း မှတ်စု ({notes.length}) ခု ရှိပါသည်</p>
        </div>
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="မှတ်စုများ ရှာဖွေရန်..."
            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-20 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="text-slate-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">မှတ်စုများ မရှိသေးပါ</h3>
          <p className="text-slate-400">အသံမှတ်တမ်းအသစ်များကို စတင်ဖမ်းယူလိုက်ပါ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredNotes.map(note => (
            <div 
              key={note.id} 
              className={`bg-white rounded-[1.5rem] p-6 border-l-[12px] shadow-sm transition-all hover:shadow-xl hover:translate-x-1 ${
                note.isUrgent ? 'border-l-red-500' : 'border-l-blue-500'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    note.isUrgent ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {note.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <Calendar size={14} />
                    {new Date(note.timestamp).toLocaleDateString('my-MM')}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <Clock size={14} />
                    {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {note.isUrgent && (
                    <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold animate-pulse">
                      <AlertCircle size={14} />
                      အရေးကြီး
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 self-end sm:self-start">
                  <button onClick={() => copyToClipboard(note.enhancedText)} className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Share/Copy">
                    <Share2 size={20} />
                  </button>
                  <button onClick={() => exportAsWord(note)} className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all" title="Export as Word">
                    <Download size={20} />
                  </button>
                  <button onClick={() => onDeleteNote(note.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {editingId === note.id ? (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                  <textarea 
                    className="w-full p-5 border-2 border-blue-100 rounded-2xl focus:outline-none focus:border-blue-500 min-h-[150px] text-lg leading-relaxed shadow-inner bg-slate-50"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setEditingId(null)} className="flex items-center gap-2 px-6 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-bold transition-all">
                      <X size={20} /> ပယ်ဖျက်
                    </button>
                    <button onClick={() => saveEdit(note)} className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold transition-all">
                      <Check size={20} /> သိမ်းမည်
                    </button>
                  </div>
                </div>
              ) : (
                <div className="group">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-slate-800 text-xl font-bold leading-relaxed">{note.enhancedText}</p>
                      </div>
                      <div className="flex items-start gap-3 text-slate-600">
                        <div className="mt-1.5 min-w-[4px] h-4 bg-blue-400 rounded-full"></div>
                        <p className="text-[15px] italic leading-relaxed">
                          <span className="font-bold text-slate-700 mr-2">AI အနှစ်ချုပ်:</span>
                          {note.summary}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => startEditing(note)} 
                      className="hidden group-hover:block p-3 text-blue-500 bg-blue-50 rounded-xl transition-all hover:scale-110"
                    >
                      <Edit3 size={20} />
                    </button>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {note.keywords.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full hover:bg-slate-200 transition-colors cursor-default">
                        <Tag size={12} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
