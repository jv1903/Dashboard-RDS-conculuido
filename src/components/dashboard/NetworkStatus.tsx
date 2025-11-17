import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Power, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NetworkStatusProps {
  disconnectedList: string[];
}

const NetworkStatus = ({ disconnectedList }: NetworkStatusProps) => {
  const disconnectedCount = disconnectedList.length;

  return (
    <Card className="p-6 bg-card border-border transition-all hover:shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Alimentadores Desligados</h3>
          <Badge variant="destructive" className="text-xs">
            {disconnectedCount} {disconnectedCount === 1 ? 'desligado' : 'desligados'}
          </Badge>
        </div>
        
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
                {disconnectedList.map((item, index) => (
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
          </div>
        ) : (
          <div className="text-center py-6 px-4 rounded-lg bg-success/10 border border-success/20">
            <p className="text-success font-medium">Todos os alimentadores operacionais</p>
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
