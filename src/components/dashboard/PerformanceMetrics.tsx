import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Zap, Clock } from "lucide-react";
const PerformanceMetrics = () => {
  const metrics = [{
    label: "Eficiência Operacional",
    value: "94.2%",
    change: "+2.4%",
    icon: TrendingUp,
    color: "text-success",
    bgColor: "bg-success/10"
  }, {
    label: "Clientes Atendidos",
    value: "12,845",
    change: "+156",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10"
  }, {
    label: "Carga Distribuída",
    value: "2.8 MW",
    change: "+0.3 MW",
    icon: Zap,
    color: "text-accent",
    bgColor: "bg-accent/10"
  }, {
    label: "Tempo Médio de Resposta",
    value: "12 min",
    change: "-3 min",
    icon: Clock,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10"
  }];
  return <Card className="p-6 bg-card border-border mx-0 my-[20px] py-[50px]">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Atualizações   





          </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Indicadores principais de desempenho
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map(metric => {
          const Icon = metric.icon;
          return <div key={metric.label} className={`p-4 rounded-lg border ${metric.bgColor} border-border transition-all hover:shadow-md`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-10 w-10 rounded-lg ${metric.bgColor} border border-border flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>;
        })}
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Última sincronização</span>
            <span className="text-foreground font-medium">
              {new Date().toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
      </div>
    </Card>;
};
export default PerformanceMetrics;