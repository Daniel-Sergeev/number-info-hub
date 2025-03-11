
import { useState, useEffect } from "react";
import { fetchPhoneNumberInfo, processMultipleNumbers, summarizeByOperator, PhoneNumberInfo, OperatorSummary } from "@/utils/apiService";
import NumberInput from "@/components/NumberInput";
import FileUpload from "@/components/FileUpload";
import ResultCard from "@/components/ResultCard";
import ExportOptions from "@/components/ExportOptions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Info, PhoneForwarded, FileText, BarChart4, Search, X } from "lucide-react";

const Index = () => {
  const [results, setResults] = useState<PhoneNumberInfo[]>([]);
  const [operatorSummary, setOperatorSummary] = useState<OperatorSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputMethod, setInputMethod] = useState<string>("form");

  // Update operator summary whenever results change
  useEffect(() => {
    if (results.length > 0) {
      const summary = summarizeByOperator(results);
      setOperatorSummary(summary);
    }
  }, [results]);

  const handleSubmit = async (numbers: string[]) => {
    if (numbers.length === 0) return;
    
    setIsLoading(true);
    
    try {
      if (numbers.length === 1) {
        const result = await fetchPhoneNumberInfo(numbers[0]);
        if (result && typeof result !== 'string') {
          setResults([result]);
        }
      } else {
        const multipleResults = await processMultipleNumbers(numbers);
        setResults(multipleResults);
      }
    } catch (error) {
      console.error("Error processing numbers:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearResults = () => {
    setResults([]);
    setOperatorSummary([]);
  };
  
  const renderSummary = () => {
    if (operatorSummary.length === 0) return null;
    
    const totalNumbers = results.length;
    
    return (
      <Card className="bg-white/90 backdrop-blur-sm w-full max-w-2xl slide-up mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BarChart4 className="mr-2 h-5 w-5" />
            Статистика по операторам
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {operatorSummary.map((item, index) => {
              const percentage = Math.round((item.count / totalNumbers) * 100);
              
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.operator}</span>
                    <Badge variant="outline" className="bg-background">
                      {item.count} ({percentage}%)
                    </Badge>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-10 md:py-16 bg-gradient-to-b from-background to-background/95">
      <div className="w-full max-w-5xl mb-8 text-center scale-in">
        <Badge variant="outline" className="mb-4 py-1 px-4 text-sm bg-white/50 backdrop-blur-xs">
          <Info className="mr-1 h-3.5 w-3.5" />
          Информация о телефонных номерах
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Number Info Hub
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Получите подробную информацию о телефонных номерах: оператор, регион и многое другое
        </p>
      </div>
      
      <Tabs 
        defaultValue="form" 
        onValueChange={setInputMethod}
        className="w-full max-w-5xl mb-8"
      >
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-6">
          <TabsTrigger value="form" className="px-8 py-2">
            <PhoneForwarded className="mr-2 h-4 w-4" />
            Ввод номеров
          </TabsTrigger>
          <TabsTrigger value="file" className="px-8 py-2">
            <FileText className="mr-2 h-4 w-4" />
            Загрузка файла
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="form" className="mt-0 flex flex-col items-center">
          <NumberInput onSubmit={handleSubmit} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="file" className="mt-0 flex flex-col items-center">
          <FileUpload onFileProcessed={handleSubmit} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
      
      {isLoading && (
        <div className="w-full max-w-2xl mb-8 flex flex-col items-center">
          <Progress value={50} className="w-full mb-2" />
          <p className="text-sm text-muted-foreground animate-pulse-subtle">
            Загрузка данных...
          </p>
        </div>
      )}
      
      {results.length > 0 && (
        <>
          <div className="w-full max-w-2xl flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Результаты поиска ({results.length})
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearResults}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 h-4 w-4" />
              Очистить
            </Button>
          </div>
          
          <ExportOptions results={results} operatorSummary={operatorSummary} />
          
          {renderSummary()}
          
          <div className="w-full max-w-2xl grid grid-cols-1 gap-5 mb-8">
            {results.map((result, index) => (
              <ResultCard 
                key={index} 
                result={result} 
                index={index}
                delay={50}
              />
            ))}
          </div>
        </>
      )}
      
      {!isLoading && results.length === 0 && (
        <Card className="w-full max-w-2xl bg-white/70 backdrop-blur-sm border-dashed mb-8">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <PhoneForwarded className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Введите номер телефона</h3>
            <p className="text-center text-muted-foreground max-w-md">
              Укажите один или несколько номеров телефонов для получения информации об операторе, регионе и других данных
            </p>
          </CardContent>
        </Card>
      )}
      
      <Separator className="mb-6 w-full max-w-2xl" />
      
      <div className="text-center text-sm text-muted-foreground mb-10 max-w-xl mx-auto">
        <p>
          Number Info Hub предоставляет информацию о телефонных номерах через API сервис num.voxlink.ru.
        </p>
        <p className="mt-2">
          Данный сервис позволяет определить оператора, регион и другие данные по номеру телефона.
        </p>
      </div>
    </div>
  );
};

export default Index;
