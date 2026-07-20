import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, X } from "lucide-react";
import { clsx } from "clsx";

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function UploadDropzone({ onFileSelected, disabled }: UploadDropzoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    maxFiles: 1,
    accept: { "application/pdf": [".pdf"] },
  });

  if (selectedFile) {
    return (
      <div className="card flex items-center justify-between gap-4 p-5 animate-scale-in">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">
            <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(0)} KB</p>
          </div>
        </div>
        {!disabled && (
          <button
            onClick={() => setSelectedFile(null)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "group cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300",
        isDragActive
          ? "border-brand-500 bg-brand-50/60 dark:bg-brand-500/10 scale-[1.01]"
          : "border-slate-200 dark:border-white/10 hover:border-brand-400 hover:bg-slate-50/60 dark:hover:bg-white/5"
      )}
    >
      <input {...getInputProps()} />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 animate-float">
        <UploadCloud className="h-8 w-8 text-brand-600 dark:text-brand-400" />
      </div>
      <p className="mt-4 font-medium">
        {isDragActive ? "Drop your resume here" : "Drag & drop your resume PDF"}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">or click to browse — PDF only, up to 10MB</p>
    </div>
  );
}
