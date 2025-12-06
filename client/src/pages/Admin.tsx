import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Download, Eye, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Admin() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<"all" | "draft" | "submitted">("all");
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const utils = trpc.useUtils();

  // Проверка доступа
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      setLocation("/");
    }
  }, [authLoading, isAuthenticated, user, setLocation]);

  // Загрузка списка опросников
  const { data: submissions, isLoading, refetch } = trpc.admin.getAllSubmissions.useQuery(
    filter === "all" ? undefined : { status: filter },
    {
      enabled: isAuthenticated && user?.role === "admin",
    }
  );

  // Загрузка деталей опросника
  const { data: submissionDetail, isLoading: detailLoading } = trpc.admin.getSubmission.useQuery(
    { token: selectedToken! },
    {
      enabled: !!selectedToken,
    }
  );

  // Функция экспорта JSON (используем tRPC utils)
  const handleExportJSON = async (token: string) => {
    try {
      const result = await utils.questionnaire.exportJSON.fetch({ token });
      
      if (result.json) {
        const blob = new Blob([result.json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `questionnaire-${token}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        throw new Error("Данные не найдены");
      }
    } catch (error) {
      console.error("Error exporting JSON:", error);
      alert("Ошибка при экспорте JSON");
    }
  };

  // Функция экспорта CSV (используем tRPC utils)
  const handleExportCSV = async (token: string) => {
    try {
      const result = await utils.questionnaire.exportCSV.fetch({ token });
      
      if (result.csv) {
        const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `questionnaire-${token}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        throw new Error("Данные не найдены");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Ошибка при экспорте CSV");
    }
  };

  const handleViewDetails = (token: string) => {
    setSelectedToken(token);
  };

  const closeDialog = () => {
    setSelectedToken(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Панель администратора</CardTitle>
            <CardDescription>Просмотр всех отправленных опросников</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="draft">Черновики</TabsTrigger>
                <TabsTrigger value="submitted">Отправленные</TabsTrigger>
              </TabsList>

              <TabsContent value={filter}>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : !submissions || submissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Опросники не найдены
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ФИО респондента</TableHead>
                          <TableHead>Email пользователя</TableHead>
                          <TableHead>Имя пользователя</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Дата создания</TableHead>
                          <TableHead>Дата отправки</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => (
                          <TableRow key={submission.id}>
                            <TableCell className="font-medium">
                              {submission.respondentName}
                            </TableCell>
                            <TableCell>{submission.userEmail || "—"}</TableCell>
                            <TableCell>{submission.userName || "—"}</TableCell>
                            <TableCell>
                              <Badge variant={submission.status === "submitted" ? "default" : "secondary"}>
                                {submission.status === "submitted" ? "Отправлен" : "Черновик"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(submission.createdAt).toLocaleDateString("ru-RU")}
                            </TableCell>
                            <TableCell>
                              {submission.submittedAt
                                ? new Date(submission.submittedAt).toLocaleDateString("ru-RU")
                                : "—"}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDetails(submission.token)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Просмотр
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleExportJSON(submission.token)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  JSON
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleExportCSV(submission.token)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  CSV
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Диалог с деталями опросника */}
      <Dialog open={!!selectedToken && !detailLoading} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Детали опросника</DialogTitle>
            <DialogDescription>
              Полная информация о заполненном опроснике
            </DialogDescription>
          </DialogHeader>
          {submissionDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Пользователь:</span> {submissionDetail.user?.name || "—"}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {submissionDetail.user?.email || "—"}
                </div>
                <div>
                  <span className="font-semibold">Статус:</span>{" "}
                  <Badge variant={submissionDetail.status === "submitted" ? "default" : "secondary"}>
                    {submissionDetail.status === "submitted" ? "Отправлен" : "Черновик"}
                  </Badge>
                </div>
                <div>
                  <span className="font-semibold">Дата отправки:</span>{" "}
                  {submissionDetail.submittedAt
                    ? new Date(submissionDetail.submittedAt).toLocaleString("ru-RU")
                    : "—"}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2">Данные опросника</h3>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs">
                  {JSON.stringify(submissionDetail.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
