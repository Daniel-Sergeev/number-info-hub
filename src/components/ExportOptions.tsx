
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DownloadCloud, BarChart } from "lucide-react";
import { PhoneNumberInfo, OperatorSummary } from "@/utils/apiService";
import { prepareExportData, downloadAsFile } from "@/utils/formatters";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

interface ExportOptionsProps {
  results: PhoneNumberInfo[];
  operatorSummary: OperatorSummary[];
}

const ExportOptions = ({ results, operatorSummary }: ExportOptionsProps) => {
  const [exportType, setExportType] = useState<string>("all");
  
  if (results.length === 0) return null;
  
  const handleExport = (format: 'csv' | 'json' | 'text') => {
    if (results.length === 0) {
      toast.error("Нет данных для экспорта");
      return;
    }
    
    try {
      let data: any[];
      let filename: string;
      
      if (exportType === "all") {
        data = results;
        filename = `phone-numbers-data.${format}`;
      } else {
        data = operatorSummary;
        filename = `operator-summary.${format}`;
      }
      
      const exportData = prepareExportData(data, format);
      
      const contentType = 
        format === 'csv' 
          ? 'text/csv' 
          : format === 'json' 
            ? 'application/json' 
            : 'text/plain';
            
      downloadAsFile(exportData, filename, contentType);
      
      toast.success(`Экспорт в формате ${format.toUpperCase()} успешно выполнен`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Ошибка при экспорте данных");
    }
  };
  
  return (
    <Card className="scale-in bg-white/90 backdrop-blur-sm p-4 mb-8 w-full max-w-2xl">
      <h3 className="text-lg font-medium mb-3">Экспорт данных</h3>
      
      <Tabs defaultValue="all" onValueChange={setExportType} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="all">
            <DownloadCloud className="h-4 w-4 mr-2" />
            Все номера
          </TabsTrigger>
          <TabsTrigger value="summary">
            <BarChart className="h-4 w-4 mr-2" />
            По операторам
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <p className="text-sm text-muted-foreground mb-4">
            Экспорт данных по всем проверенным номерам телефонов ({results.length})
          </p>
        </TabsContent>
        
        <TabsContent value="summary" className="mt-0">
          <p className="text-sm text-muted-foreground mb-4">
            Экспорт статистики по операторам ({operatorSummary.length})
          </p>
        </TabsContent>
      </Tabs>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('csv')}
        >
          Скачать CSV
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('json')}
        >
          Скачать JSON
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('text')}
        >
          Скачать TXT
        </Button>
      </div>
    </Card>
  );
};

export default ExportOptions;
