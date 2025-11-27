import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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
import { Calendar, MessageSquare, X, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MessagesAndScheduleProps {
  messages: Array<{ title: string; content: string[] }>;
  programacao: string[];
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

const MessagesAndSchedule = ({ messages, programacao }: MessagesAndScheduleProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedItem, setSelectedItem] = useState<string>("all");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const regularMessages = messages;

  // Garantir sempre 4 mensagens
  const messagesList = Array.from({ length: 4 }, (_, index) => {
    const message = regularMessages[index];
    return {
      id: `msg-${index + 1}`,
      title: message?.title || `Mensagem ${index + 1}`,
      content: message?.content || []
    };
  });

  // Filtrar programação baseado nos filtros
  const filteredProgramacao = useMemo(() => {
    if (!programacao) return [];
    
    let result = [...programacao];
    
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
  }, [programacao, selectedDate, selectedItem]);

  const hasSchedule = filteredProgramacao && filteredProgramacao.length > 0;
  const hasActiveFilters = selectedDate || selectedItem !== "all";

  const handleClearFilters = () => {
    setSelectedDate(undefined);
    setSelectedItem("all");
  };

  return (
    <Card className="p-6 bg-card border-border">
      <Tabs defaultValue="msg-1" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          {messagesList.map((message, index) => (
            <TabsTrigger 
              key={message.id} 
              value={message.id}
              className="text-xs md:text-sm"
            >
              {index + 1}
            </TabsTrigger>
          ))}
          <TabsTrigger value="schedule" className="text-xs md:text-sm">
            Programação
          </TabsTrigger>
        </TabsList>

        {messagesList.map((message) => (
          <TabsContent key={message.id} value={message.id} className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {message.title}
                </h3>
                <div className="space-y-3">
                  {message.content.length > 0 ? (
                    message.content.map((item, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-lg bg-muted/50 border border-border"
                      >
                        <p className="text-foreground font-medium">
                          {item}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-muted-foreground">
                        Sem informações disponíveis
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Última atualização</span>
                <span className="text-foreground font-medium">
                  {new Date().toLocaleString("pt-BR")}
                </span>
              </div>
            </div>
          </TabsContent>
        ))}

        <TabsContent value="schedule" className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  PROGRAMAÇÃO
                </h3>
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
              {programacao && programacao.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
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
                        <Calendar className="h-3.5 w-3.5" />
                        {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Filtrar por data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
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
                      {programacao.map((item, index) => (
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

              <div className="space-y-3">
                {hasSchedule ? (
                  filteredProgramacao.map((item, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg bg-muted/50 border border-border"
                    >
                      <p className="text-foreground font-medium">
                        {item}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-muted-foreground">
                      {hasActiveFilters ? "Nenhum resultado encontrado para os filtros" : "Nenhuma programação disponível"}
                    </p>
                  </div>
                )}
              </div>

              {programacao && programacao.length > 0 && (
                <div className="text-xs text-muted-foreground text-center pt-3">
                  Mostrando {filteredProgramacao.length} de {programacao.length} itens
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Última sincronização</span>
              <span className="text-foreground font-medium">
                {new Date().toLocaleString("pt-BR")}
              </span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MessagesAndSchedule;
