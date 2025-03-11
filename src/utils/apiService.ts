
import { toast } from "@/hooks/use-toast";

export interface PhoneNumberInfo {
  code: string;
  num: string;
  full_num: string;
  operator: string;
  old_operator?: string;
  region: string;
}

export interface OperatorSummary {
  operator: string;
  count: number;
}

const API_BASE_URL = 'https://corsproxy.io/?https%3A%2F%2Fnum.voxlink.ru%2Fget%2F';

export const fetchPhoneNumberInfo = async (
  phoneNumber: string,
  field?: string,
  translit?: boolean
): Promise<PhoneNumberInfo | string | null> => {
  try {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (cleanNumber.length < 10) {
      throw new Error('Недостаточно цифр для номера телефона');
    }
    
    const params = new URLSearchParams();
    params.append('num', cleanNumber);
    
    if (field) {
      params.append('field', field);
      
      if (translit) {
        params.append('translit', '1');
      }
    }
    
    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    if (field) {
      return await response.text();
    } else {
      return await response.json();
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error('Error fetching phone number info:', errorMessage);
    toast({
      title: "Ошибка",
      description: errorMessage,
      variant: "destructive"
    });
    return null;
  }
};

export const processMultipleNumbers = async (
  numbers: string[]
): Promise<PhoneNumberInfo[]> => {
  const results: PhoneNumberInfo[] = [];
  const errors: string[] = [];
  
  // Обрабатываем по 3 номера за раз
  const batchSize = 3;
  
  for (let i = 0; i < numbers.length; i += batchSize) {
    const batch = numbers.slice(i, i + batchSize);
    const batchPromises = batch.map(async (number) => {
      const result = await fetchPhoneNumberInfo(number);
      if (result && typeof result !== 'string') {
        return result;
      }
      return null;
    });
    
    const batchResults = await Promise.all(batchPromises);
    
    batchResults.forEach((result, index) => {
      if (result) {
        results.push(result);
      } else {
        errors.push(batch[index]);
      }
    });
    
    // Задержка в 2 секунды между пакетами запросов
    if (i + batchSize < numbers.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  if (errors.length > 0) {
    toast({
      title: "Предупреждение",
      description: `Не удалось обработать ${errors.length} номер(ов)`,
      variant: "default"
    });
  }
  
  return results;
};

export const summarizeByOperator = (results: PhoneNumberInfo[]): OperatorSummary[] => {
  const operators: Record<string, number> = {};
  
  results.forEach(result => {
    const operator = result.operator;
    operators[operator] = (operators[operator] || 0) + 1;
  });
  
  return Object.entries(operators).map(([operator, count]) => ({
    operator,
    count
  })).sort((a, b) => b.count - a.count);
};
