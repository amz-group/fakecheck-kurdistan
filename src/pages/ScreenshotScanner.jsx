import React, { useState, useRef } from 'react';
import { Image as ImageIcon, ShieldCheck, Upload, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useScan } from '@/hooks/useScan';
import ScanProgress from '@/components/ScanProgress';
import AnalysisResult from '@/components/AnalysisResult';
import { Image } from '@/components/ui/image';

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export default function ScreenshotScanner() {
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const fileRef = useRef(null);
  const { loading, step, result, error, analyze, reset } = useScan();

  const handleFile = (f) => {
    setUploadError(null);
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      setUploadError('Unsupported file type. Use PNG, JPG, JPEG, or WEBP.');
      return;
    }
    if (f.size > MAX_SIZE) {
      setUploadError('File too large. Maximum 5MB.');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFileUrl(file_url);
      analyze('screenshot', '', file_url);
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setFileUrl(null);
    setUploadError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <AnalysisResult result={result} scanType="screenshot" inputContent={file?.name || ''} onScanAnother={() => { reset(); clearFile(); }} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="font-heading font-bold text-3xl mb-2">{t('tool_screenshot')}</h1>
        <p className="text-muted-foreground">{t('tool_screenshot_desc')}</p>
      </div>

      {loading ? (
        <ScanProgress step={step} />
      ) : (
        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8">
          {!preview ? (
            <label
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="block border-2 border-dashed border-white/10 rounded-xl p-10 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <input ref={fileRef} type="file" accept={ACCEPTED.join(',')} onChange={e => handleFile(e.target.files[0])} className="hidden" />
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-purple-400" />
              </div>
              <p className="font-medium mb-1">{t('upload_image')}</p>
              <p className="text-xs text-muted-foreground">{t('upload_hint')}</p>
              <p className="text-xs text-muted-foreground mt-2">Drag & drop or click to browse</p>
            </label>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-white/10">
              <Image src={preview} alt="preview" className="w-full max-h-80 object-contain bg-black/30" />
              <button type="button" onClick={clearFile} className="absolute top-3 end-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {uploadError && <p className="text-destructive text-sm mt-3 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" />{uploadError}</p>}
          {error && <p className="text-destructive text-sm mt-3">{error}</p>}

          <Button type="submit" className="w-full mt-4 h-12 text-base" disabled={!file}>
            <ShieldCheck className="w-5 h-5 me-2" /> {t('analyze_screenshot')}
          </Button>
        </form>
      )}
    </div>
  );
}