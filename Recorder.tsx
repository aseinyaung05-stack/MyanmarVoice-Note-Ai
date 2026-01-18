
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">အသံဖြင့် မှတ်စုရေးပါ</h2>
        <p className="text-slate-500">မြန်မာလို ပြောဆိုပြီး မှတ်စုများကို AI ဖြင့် သိမ်းဆည်းပါ</p>
      </div>

      <div className="relative group">
        {isRecording && (
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20 scale-150"></div>
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
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
        </button>
      </div>

      <div className="h-8 flex items-center justify-center">
        {isRecording && (
          <div className="flex flex-col items-center">
            <span className="text-2xl font-mono font-bold text-red-500">{formatTime(timer)}</span>
            <span className="text-slate-400 text-sm animate-pulse">နားထောင်နေသည်...</span>
          </div>
        )}
        {isProcessing && (
          <div className="flex items-center gap-2 text-blue-600">
            <span className="font-medium">AI က လုပ်ဆောင်နေသည်...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 w-full mt-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
          <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">သဒ္ဒါစစ်ဆေးမှု</span>
          <span className="text-sm font-semibold text-slate-700">အလိုအလျောက်</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
          <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">အကျဉ်းချုပ်</span>
          <span className="text-sm font-semibold text-slate-700">AI စွမ်းအင်သုံး</span>
        </div>
      </div>
    </div>
  );
};

export default Recorder;
