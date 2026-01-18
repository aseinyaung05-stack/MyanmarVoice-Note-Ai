
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { processVoiceAudio } from '../services/geminiService';
import { VoiceNote } from '../types';

interface RecorderProps {
  onNoteCreated: (note: VoiceNote) => void;
}

const Recorder: React.FC<RecorderProps> = ({ onNoteCreated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimer(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await handleProcessAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError('မိုက်ကရိုဖုန်း အသုံးပြုခွင့် မရှိပါ။');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleProcessAudio = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const processedNote = await processVoiceAudio(base64Data);
        if (processedNote) {
          onNoteCreated(processedNote as VoiceNote);
        }
      };
    } catch (err) {
      console.error(err);
      setError('မှတ်စုပြုလုပ်ရာတွင် အမှားအယွင်းရှိခဲ့ပါသည်။');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md px-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">အသံဖြင့် မှတ်စုရေးပါ</h2>
        <p className="text-slate-500 text-lg">AI စနစ်က သင့်စကားပြောဆိုချက်များကို စနစ်တကျ မှတ်တမ်းတင်ပေးပါမည်</p>
      </div>

      <div className="relative">
        {isRecording && (
          <>
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20 scale-150"></div>
            <div className="absolute inset-0 bg-blue-300 rounded-full animate-ping opacity-10 scale-[2]"></div>
          </>
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative z-10 w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all shadow-2xl active:scale-95 border-8 border-white ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing ? (
            <Loader2 className="animate-spin" size={48} />
          ) : isRecording ? (
            <Square size={48} fill="currentColor" />
          ) : (
            <Mic size={48} />
          )}
          <span className="mt-2 text-xs font-bold uppercase tracking-widest">
            {isRecording ? 'ရပ်မည်' : 'စမည်'}
          </span>
        </button>
      </div>

      <div className="h-12 flex items-center justify-center">
        {isRecording && (
          <div className="flex flex-col items-center">
            <span className="text-3xl font-mono font-bold text-slate-700">{formatTime(timer)}</span>
            <span className="text-red-500 text-sm font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              နားထောင်နေသည်...
            </span>
          </div>
        )}
        {isProcessing && (
          <div className="flex flex-col items-center gap-2 text-blue-600">
            <div className="flex items-center gap-2">
              <Sparkles className="animate-pulse" size={20} />
              <span className="font-bold">Gemini AI က မှတ်စုကို ပြုပြင်ရေးသားနေပါသည်</span>
            </div>
            <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-6 py-3 rounded-2xl border border-red-100 shadow-sm animate-in fade-in zoom-in">
          <AlertCircle size={20} />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 w-full mt-4">
        <FeatureCard label="Professional Writing" active={isProcessing} />
        <FeatureCard label="Smart Categorization" active={isProcessing} />
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ label, active }: { label: string, active: boolean }) => (
  <div className={`bg-white p-4 rounded-2xl border shadow-sm flex flex-col items-center transition-colors ${active ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}>
    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">စနစ်သုံး</span>
    <span className={`text-sm font-bold ${active ? 'text-blue-700' : 'text-slate-700'}`}>{label}</span>
  </div>
);

export default Recorder;
