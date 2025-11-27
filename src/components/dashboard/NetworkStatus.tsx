import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Power, AlertTriangle, Calendar as CalendarIcon, X, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface NetworkStatusProps {
  disconnectedList: string[];
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

const NetworkStatus = ({ disconnectedList }: NetworkStatusProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedItem, setSelectedItem] = useState<string>("all");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Filtrar lista baseado nos filtros
  const filteredList = useMemo(() => {
    if (!disconnectedList) return [];
    
    let result = [...disconnectedList];
    
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
  }, [disconnectedList, selectedDate, selectedItem]);

  const disconnectedCount = filteredList.length;
  const totalCount = disconnectedList.length;
  const hasActiveFilters = selectedDate || selectedItem !== "all";

  const handleClearFilters = () => {
    setSelectedDate(undefined);
    setSelectedItem("all");
  };

  return (
    <Card className="p-6 bg-card border-border transition-all hover:shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Alimentadores Desligados</h3>
          <div className="flex items-center gap-2">
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
            <Badge variant="destructive" className="text-xs">
              {disconnectedCount} {disconnectedCount === 1 ? 'desligado' : 'desligados'}
            </Badge>
          </div>
        </div>

        {/* Filtros */}
        {totalCount > 0 && (
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
                {disconnectedList.map((item, index) => (
                  <SelectItem key={index} value={item} className="text-xs">
                    <span className="truncate max-w-[250px] block">
                      {item.length > 50 ? `${item.substring(0, 50)}...` : item}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex items-center gap-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="h-16 w-16 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center flex-shrink-0">
            <Power className="h-8 w-8 text-destructive" />
          </div>
          
          <div className="flex-1">
            <p className="text-4xl font-bold text-destructive mb-1">{disconnectedCount}</p>
            <p className="text-sm text-muted-foreground">
              Alimentadores fora de operação
            </p>
          </div>
        </div>

        {disconnectedCount > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>Lista de alimentadores:</span>
            </div>
            
            <ScrollArea className="h-[140px] rounded-lg border border-border bg-muted/30 p-3">
              <div className="space-y-1.5">
                {filteredList.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded bg-background border border-border text-sm"
                  >
                    <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {totalCount > 0 && (
              <div className="text-xs text-muted-foreground text-center pt-2">
                Mostrando {filteredList.length} de {totalCount} alimentadores
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 px-4 rounded-lg bg-success/10 border border-success/20">
            <p className="text-success font-medium">
              {hasActiveFilters ? "Nenhum resultado encontrado para os filtros" : "Todos os alimentadores operacionais"}
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Monitoramento em tempo real
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NetworkStatus;
