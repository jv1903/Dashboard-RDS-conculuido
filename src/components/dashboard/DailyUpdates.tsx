import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, CheckCircle, X, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DailyUpdatesProps {
  title: string;
  update: string[];
}

// Função para extrair data de uma string (formato DD/MM/YYYY ou DD-MM-YYYY)
const extractDate = (text: string): Date | null => {
  const datePattern = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/;
  const match = text.match(datePattern);
  
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    let year = parseInt(match[3], 10);
    
    if (year < 100) {
      year += 2000;
    }
    
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  return null;
};

const DailyUpdates = ({ title, update }: DailyUpdatesProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedItem, setSelectedItem] = useState<string>("all");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Filtrar updates baseado nos filtros
  const filteredUpdates = useMemo(() => {
    if (!update) return [];
    
    let result = [...update];
    
    // Filtro por data
    if (selectedDate) {
      result = result.filter((item) => {
        const itemDate = extractDate(item);
        if (!itemDate) return false;
        
        return (
          itemDate.getDate() === selectedDate.getDate() &&
          itemDate.getMonth() === selectedDate.getMonth() &&
          itemDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    }
    
    // Filtro por item específico
    if (selectedItem !== "all") {
      result = result.filter((item) => item === selectedItem);
    }
    
    return result;
  }, [update, selectedDate, selectedItem]);

  const hasUpdates = filteredUpdates && filteredUpdates.length > 0;
  const hasActiveFilters = selectedDate || selectedItem !== "all";

  const handleClearFilters = () => {
    setSelectedDate(undefined);
    setSelectedItem("all");
  };

  return (
    <Card className="p-6 bg-card border-border transition-all hover:shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {/* Filtro por data */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 text-xs gap-1.5",
                  selectedDate && "bg-primary/10 border-primary/30 text-primary"
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Filtrar por data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsCalendarOpen(false);
                }}
                locale={ptBR}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Filtro por elemento */}
          <Select value={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger className={cn(
              "h-8 w-auto min-w-[180px] text-xs gap-1.5",
              selectedItem !== "all" && "bg-primary/10 border-primary/30 text-primary"
            )}>
              <Filter className="h-3.5 w-3.5" />
              <SelectValue placeholder="Filtrar por elemento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os elementos</SelectItem>
              {update && update.map((item, index) => (
                <SelectItem key={index} value={item} className="text-xs">
                  <span className="truncate max-w-[250px] block">
                    {item.length > 50 ? `${item.substring(0, 50)}...` : item}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 max-h-[250px] overflow-y-auto">
          {hasUpdates ? (
            filteredUpdates.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10"
              >
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-foreground mb-1">
                    Atualização {filteredUpdates.length > 1 && `#${index + 1}`}
                  </p>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border">
              <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {hasActiveFilters
                    ? "Nenhum resultado encontrado para os filtros aplicados"
                    : "Sem atualizações disponíveis"}
                </p>
              </div>
            </div>
          )}
        </div>

        {update && update.length > 0 && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
            Mostrando {filteredUpdates.length} de {update.length} itens
          </div>
        )}
      </div>
    </Card>
  );
};

export default DailyUpdates;
