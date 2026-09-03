import { useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const stepOrder = ['uploading', 'reading', 'analyzing', 'calculating', 'preparing'];

export function useScan() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('uploading');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (scanType, content, fileUrl) => {
    setLoading(true);
    setError(null);
    setResult(null);

    let currentStep = 0;
    setStep(stepOrder[0]);
    const interval = setInterval(() => {
      currentStep = Math.min(currentStep + 1, stepOrder.length - 2);
      setStep(stepOrder[currentStep]);
    }, 800);

    try {
      const res = await base44.functions.invoke('analyzeContent', {
        scan_type: scanType,
        content,
        file_url: fileUrl,
      });
      clearInterval(interval);
      setStep('preparing');
      await new Promise(r => setTimeout(r, 400));
      setResult(res.data);
    } catch (e) {
      clearInterval(interval);
      setError(e.response?.data?.error || e.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setStep('uploading');
  }, []);

  return { loading, step, result, error, analyze, reset };
}