import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Construction, FileText, CheckCircle2 } from "lucide-react";
interface StatusOverviewProps {
  emObra: number;
  emProjeto: number;
  concluidos: number;
}
const StatusOverview = ({
  emObra,
  emProjeto,
  concluidos
}: StatusOverviewProps) => {
  const total = emObra + emProjeto + concluidos;
  const statusItems = [{
    label: "Em Obra",
    count: emObra,
    icon: Construction,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20"
  }, {
    label: "Em Projeto",
    count: emProjeto,
    icon: FileText,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20"
  }, {
    label: "Concluídos",
    count: concluidos,
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20"
  }];
  return <Card className="p-6 bg-card border-border transition-all hover:shadow-lg py-[80px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between py-0 my-0">
          <h3 className="text-lg font-semibold text-foreground">Status dos Projetos</h3>
          <Badge variant="outline" className="text-xs">
            Total: {total}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {statusItems.map(item => {
          const Icon = item.icon;
          return <div key={item.label} className={`p-4 rounded-lg ${item.bgColor} border ${item.borderColor} transition-all hover:shadow-md`}>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`h-12 w-12 rounded-lg ${item.bgColor} border ${item.borderColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground mb-1">{item.count}</p>
                    <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                  </div>
                </div>
              </div>;
        })}
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Distribuição</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 rounded-full bg-muted overflow-hidden flex">
                {emObra > 0 && <div className="h-full bg-warning transition-all" style={{
                width: `${emObra / total * 100}%`
              }} />}
                {emProjeto > 0 && <div className="h-full bg-primary transition-all" style={{
                width: `${emProjeto / total * 100}%`
              }} />}
                {concluidos > 0 && <div className="h-full bg-success transition-all" style={{
                width: `${concluidos / total * 100}%`
              }} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>;
};
export default StatusOverview;