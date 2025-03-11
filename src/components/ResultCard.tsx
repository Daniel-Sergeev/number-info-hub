
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PhoneNumberInfo } from "@/utils/apiService";
import { formatPhoneNumber } from "@/utils/formatters";

interface ResultCardProps {
  result: PhoneNumberInfo;
  index?: number;
  delay?: number;
}

const ResultCard = ({ result, index = 0, delay = 0 }: ResultCardProps) => {
  const animationDelay = delay ? `${delay * index}ms` : '0';
  
  return (
    <Card className="slide-up overflow-hidden" style={{ animationDelay }}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2">
              {result.region}
            </Badge>
            <CardTitle className="text-lg md:text-xl">
              {formatPhoneNumber(`+7${result.code}${result.num}`)}
            </CardTitle>
          </div>
          
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
            {result.code}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-1 gap-2">
          <InfoRow label="Оператор" value={result.operator} highlight />
          
          {result.old_operator && (
            <>
              <Separator className="my-1" />
              <InfoRow 
                label="Предыдущий оператор" 
                value={result.old_operator} 
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const InfoRow = ({ label, value, highlight = false }: InfoRowProps) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-muted-foreground">{label}:</span>
    <span className={highlight ? "font-medium" : ""}>{value}</span>
  </div>
);

export default ResultCard;
