
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { parsePhoneNumbers } from "@/utils/formatters";

interface FileUploadProps {
  onFileProcessed: (numbers: string[]) => void;
  isLoading: boolean;
}

const FileUpload = ({ onFileProcessed, isLoading }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== 'text/plain') {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, загрузите файл в формате .txt",
          variant: "destructive"
        });
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Ошибка",
          description: "Файл слишком большой. Максимальный размер 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleProcessFile = async () => {
    if (!file) return;
    
    try {
      const text = await file.text();
      const numbers = parsePhoneNumbers(text);
      
      if (numbers.length === 0) {
        toast({
          title: "Ошибка",
          description: "В файле не обнаружено номеров телефонов",
          variant: "destructive"
        });
        return;
      }
      
      if (numbers.length > 100) {
        toast({
          title: "Предупреждение",
          description: "Обнаружено более 100 номеров, обработка может занять некоторое время",
          variant: "default"
        });
      }
      
      onFileProcessed(numbers);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Ошибка",
        description: "Ошибка при обработке файла",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm border border-border rounded-xl shadow-soft px-6 py-6 scale-in mb-8">
      <h2 className="text-xl font-medium text-center mb-5">Загрузка файла</h2>
      
      <div className="space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt"
        />
        
        {!file ? (
          <div 
            onClick={handleUploadClick}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/50 transition-colors duration-200"
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Нажмите для загрузки файла .txt с номерами телефонов
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Каждый номер должен быть на отдельной строке
            </p>
          </div>
        ) : (
          <div className="rounded-lg p-5 bg-secondary">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileIcon className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="font-medium text-sm truncate max-w-[240px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClearFile}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        <Button 
          onClick={handleProcessFile}
          disabled={!file || isLoading}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Обработать файл
        </Button>
      </div>
    </div>
  );
};

// Simple file icon component
const FileIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default FileUpload;
