import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle } from "lucide-react";
interface DailyUpdatesProps {
  update: string[];
}
const DailyUpdates = ({
  update
}: DailyUpdatesProps) => {
  const hasUpdates = update && update.length > 0;
  
  return <Card className="p-6 bg-card border-border transition-all hover:shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Atualizações do Dia</h3>
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            Hoje
          </Badge>
        </div>
        
        <div className="space-y-3">
          {hasUpdates ? (
            update.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-foreground mb-1">
                    Atualização Concluída {update.length > 1 && `#${index + 1}`}
                  </p>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border">
              <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Sem atualizações disponíveis</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>;
};
export default DailyUpdates;