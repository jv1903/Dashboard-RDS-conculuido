import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MessageSquare } from "lucide-react";

interface MessagesAndScheduleProps {
  messages: Array<{ title: string; content: string }>;
  programacao: string[];
}

const MessagesAndSchedule = ({ messages, programacao }: MessagesAndScheduleProps) => {
  const regularMessages = messages;

  // Garantir sempre 4 mensagens
  const messagesList = Array.from({ length: 4 }, (_, index) => {
    const message = regularMessages[index];
    return {
      id: `msg-${index + 1}`,
      title: message?.title || `Mensagem ${index + 1}`,
      content: message?.content || "Sem informações disponíveis"
    };
  });

  const hasSchedule = programacao && programacao.length > 0;

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
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {message.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {message.content}
                </p>
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
              <h3 className="text-lg font-semibold text-foreground mb-4">
                PROGRAMAÇÃO
              </h3>
              <div className="space-y-3">
                {hasSchedule ? (
                  programacao.map((item, index) => (
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
                      Nenhuma programação disponível
                    </p>
                  </div>
                )}
              </div>
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
