
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isValidPhoneNumber, parsePhoneNumbers } from "@/utils/formatters";
import { Search, FileText } from "lucide-react";

interface NumberInputProps {
  onSubmit: (numbers: string[]) => void;
  isLoading: boolean;
}

const NumberInput = ({ onSubmit, isLoading }: NumberInputProps) => {
  const [singleNumber, setSingleNumber] = useState<string>("");
  const [multipleNumbers, setMultipleNumbers] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("single");

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidPhoneNumber(singleNumber)) {
      onSubmit([singleNumber]);
    }
  };

  const handleMultipleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numbers = parsePhoneNumbers(multipleNumbers);
    if (numbers.length > 0) {
      onSubmit(numbers);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm border border-border rounded-xl shadow-soft px-6 py-6 scale-in mb-8">
      <h2 className="text-xl font-medium text-center mb-5">Проверка номера телефона</h2>
      
      <Tabs defaultValue="single" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="single">Один номер</TabsTrigger>
          <TabsTrigger value="multiple">Несколько номеров</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="mt-0">
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="+7 (XXX) XXX-XX-XX"
                value={singleNumber}
                onChange={(e) => setSingleNumber(e.target.value)}
                className="bg-background/50 transition-all duration-200 focus:bg-white"
              />
              <p className="text-sm text-muted-foreground">
                Введите номер в любом формате (российский или международный)
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !isValidPhoneNumber(singleNumber)}
            >
              <Search className="mr-2 h-4 w-4" />
              Проверить
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="multiple" className="mt-0">
          <form onSubmit={handleMultipleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Введите номера телефонов, по одному на строку"
                value={multipleNumbers}
                onChange={(e) => setMultipleNumbers(e.target.value)}
                className="min-h-[120px] bg-background/50 transition-all duration-200 focus:bg-white"
              />
              <p className="text-sm text-muted-foreground">
                Введите номера в любом формате, каждый с новой строки
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || multipleNumbers.trim().length === 0}
            >
              <FileText className="mr-2 h-4 w-4" />
              Проверить все
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NumberInput;
