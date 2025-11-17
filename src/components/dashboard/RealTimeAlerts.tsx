import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock } from "lucide-react";

interface RealTimeAlertsProps {
  alert: string;
}

const RealTimeAlerts = ({ alert }: RealTimeAlertsProps) => {
  const isActive = alert && alert.trim() !== "";

  return (
    <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 transition-all hover:shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Alertas em Tempo Real</h3>
          {isActive && (
            <Badge variant="destructive" className="animate-pulse">
              Ativo
            </Badge>
          )}
        </div>
        
        {isActive ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground mb-1">Alerta Crítico</p>
                <p className="text-sm text-muted-foreground">{alert}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm pt-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Detectado agora</span>
              </div>
              <span className="text-destructive font-medium">Ação necessária</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="h-12 w-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-6 w-6 text-success" />
            </div>
            <p className="text-foreground font-medium mb-1">Nenhum alerta ativo</p>
            <p className="text-sm text-muted-foreground">Sistema operando normalmente</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RealTimeAlerts;
