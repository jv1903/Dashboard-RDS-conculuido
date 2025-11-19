import { useState } from "react";
import { Upload, Activity, Zap, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import StatusOverview from "@/components/dashboard/StatusOverview";
import NetworkStatus from "@/components/dashboard/NetworkStatus";
import DailyUpdates from "@/components/dashboard/DailyUpdates";
import RealTimeAlerts from "@/components/dashboard/RealTimeAlerts";
import MessagesAndSchedule from "@/components/dashboard/MessagesAndSchedule";

export interface DashboardData {
  "projetos_em_obra": number;
  "projetos_em_projeto": number;
  "projetos_concluidos": number;
  "als_desligados": string[];
  "Atualizações do dia": string[];
  "Atualizações em tempo real": string[];
  "mensagens": Array<{ title: string; content: string }>;
  "programacao": string[];
}

const Index = () => {
  const { toast } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);

  const processExcelData = (worksheet: XLSX.WorkSheet): DashboardData | null => {
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
    if (jsonData.length < 2) {
      return null;
    }

    // Encontrar índices das colunas baseado no cabeçalho
    const headers = jsonData[0].map((h: string) => h?.toString().toLowerCase().trim());

    const findColumnIndex = (possibleNames: string[]) => {
      for (const name of possibleNames) {
        const index = headers.findIndex((h: string) => h?.includes(name));
        if (index !== -1) return index;
      }
      return -1;
    };

    const statusIdx = findColumnIndex(['status', 'situação', 'estado']);
    const desligadosIdx = findColumnIndex(['desligado', 'als desligado', 'alimentadores']);
    const atualizacoesDiaIdx = findColumnIndex(['atualização', 'atualização do dia', 'atualizações do dia']);
    const atualizacoesTempoRealIdx = findColumnIndex(['tempo real', 'real time', 'alerta']);
    const programacaoIdx = findColumnIndex(['programação', 'programacao']);

    // Contar projetos por status
    let emObra = 0;
    let emProjeto = 0;
    let concluidos = 0;

    // Processar todas as linhas para contar status
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row[statusIdx]) {
        const status = row[statusIdx].toString().toLowerCase().trim();
        if (status.includes('obra')) {
          emObra++;
        } else if (status.includes('projeto')) {
          emProjeto++;
        } else if (status.includes('conclu')) {
          concluidos++;
        }
      }
    }

    // Processar alimentadores desligados (pode estar em uma célula ou em múltiplas linhas)
    const desligadosList: string[] = [];
    
    if (desligadosIdx !== -1) {
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row && row[desligadosIdx]) {
          const value = row[desligadosIdx].toString().trim();
          if (value) {
            // Se for uma lista separada por vírgula, quebrar
            if (value.includes(',')) {
              const items = value.split(',').map(item => item.trim()).filter(item => item);
              desligadosList.push(...items);
            } else {
              desligadosList.push(value);
            }
          }
        }
      }
    }

    // Pegar atualizações da primeira linha de dados
    const firstDataRow = jsonData[1];

    // Processar mensagens - buscar colunas de mensagens em ordem
    const mensagens: Array<{ title: string; content: string }> = [];
    const skipColumns = [statusIdx, desligadosIdx, atualizacoesDiaIdx, atualizacoesTempoRealIdx, programacaoIdx];
    
    for (let colIdx = 0; colIdx < headers.length; colIdx++) {
      if (skipColumns.includes(colIdx)) continue;
      
      const header = jsonData[0][colIdx]?.toString().trim();
      const value = firstDataRow[colIdx]?.toString().trim();
      
      if (header && value) {
        mensagens.push({ title: header, content: value });
      }
    }

    // Processar TODAS as linhas da coluna programação
    const programacaoList: string[] = [];
    if (programacaoIdx !== -1) {
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row && row[programacaoIdx]) {
          const value = row[programacaoIdx].toString().trim();
          if (value) {
            programacaoList.push(value);
          }
        }
      }
    }

    // Processar TODAS as linhas da coluna Atualizações do dia
    const atualizacoesDiaList: string[] = [];
    if (atualizacoesDiaIdx !== -1) {
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row && row[atualizacoesDiaIdx]) {
          const value = row[atualizacoesDiaIdx].toString().trim();
          if (value) {
            atualizacoesDiaList.push(value);
          }
        }
      }
    }

    // Processar TODAS as linhas da coluna Atualizações em tempo real
    const atualizacoesTempoRealList: string[] = [];
    if (atualizacoesTempoRealIdx !== -1) {
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row && row[atualizacoesTempoRealIdx]) {
          const value = row[atualizacoesTempoRealIdx].toString().trim();
          if (value) {
            atualizacoesTempoRealList.push(value);
          }
        }
      }
    }

    return {
      "projetos_em_obra": emObra,
      "projetos_em_projeto": emProjeto,
      "projetos_concluidos": concluidos,
      "als_desligados": desligadosList,
      "Atualizações do dia": atualizacoesDiaList,
      "Atualizações em tempo real": atualizacoesTempoRealList,
      "mensagens": mensagens,
      "programacao": programacaoList
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    // Processar Excel ou CSV
    if (fileExtension === 'xlsx' || fileExtension === 'xls' || fileExtension === 'csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          
          const parsedData = processExcelData(firstSheet);
          
          if (parsedData) {
            setData(parsedData);
            toast({
              title: "Planilha carregada com sucesso",
              description: `Dados de ${file.name} processados.`,
            });
          } else {
            toast({
              title: "Erro ao processar planilha",
              description: "Formato de planilha inválido. Verifique as colunas.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error(error);
          toast({
            title: "Erro ao carregar planilha",
            description: "Não foi possível processar o arquivo.",
            variant: "destructive",
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } 
    // Processar JSON
    else if (fileExtension === 'json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          setData(jsonData);
          toast({
            title: "Dados carregados com sucesso",
            description: "Dashboard atualizado com os novos dados.",
          });
        } catch (error) {
          toast({
            title: "Erro ao carregar dados",
            description: "Formato JSON inválido.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Formato não suportado",
        description: "Use arquivos Excel (.xlsx, .xls), CSV ou JSON.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Ceee Equatorial</h1>
                <p className="text-sm text-muted-foreground">Dashboard de Performance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
                <Activity className="h-4 w-4 text-success animate-pulse" />
                <span className="text-sm font-medium text-success">Sistema Ativo</span>
              </div>
              
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Carregar Planilha
                  </span>
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls,.csv,.json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!data ? (
          <Card className="p-12 text-center border-dashed">
            <FileSpreadsheet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Nenhum dado carregado</h2>
            <p className="text-muted-foreground mb-6">
              Faça upload de uma planilha Excel, CSV ou JSON para visualizar o dashboard
            </p>
            <div className="space-y-3 mb-6">
              <p className="text-sm text-muted-foreground">Formatos aceitos:</p>
              <div className="flex justify-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Excel (.xlsx, .xls)</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">CSV</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">JSON</span>
              </div>
            </div>
            <label htmlFor="file-upload-main">
              <Button size="lg" asChild>
                <span>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Selecionar Planilha
                </span>
              </Button>
            </label>
            <input
              id="file-upload-main"
              type="file"
              accept=".xlsx,.xls,.csv,.json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Row 1: Real-time Alerts + Network Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealTimeAlerts alert={data["Atualizações em tempo real"]} />
              <NetworkStatus disconnectedList={data.als_desligados} />
            </div>

            {/* Row 2: Status Overview + Daily Updates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatusOverview 
                emObra={data.projetos_em_obra}
                emProjeto={data.projetos_em_projeto}
                concluidos={data.projetos_concluidos}
              />
              <DailyUpdates update={data["Atualizações do dia"]} />
            </div>

            {/* Row 3: Messages and Schedule (Full Width) */}
            <MessagesAndSchedule messages={data.mensagens} programacao={data.programacao} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
