import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Download, FileJson, FileSpreadsheet, FileText, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Success() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    setToken(tokenFromUrl);
  }, []);

  const { data: jsonData } = trpc.questionnaire.exportJSON.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  const { data: csvData } = trpc.questionnaire.exportCSV.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  const { data: pdfData } = trpc.questionnaire.exportPDF.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Спасибо за участие!
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            Ваш опросник успешно отправлен и сохранён
          </p>
          
          <p className="text-gray-500">
            Ваши данные помогут сохранить семейную историю для будущих поколений
          </p>
        </div>

        <div className="border-t-2 border-gray-200 pt-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Экспорт данных</h2>
          <p className="text-sm text-gray-600 mb-4">
            Вы можете скачать свои ответы в различных форматах:
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => jsonData && downloadFile(jsonData.json, "questionnaire.json", "application/json")}
              disabled={!jsonData}
              variant="outline"
              className="w-full justify-start text-left h-auto py-4"
            >
              <FileJson className="w-5 h-5 mr-3 flex-shrink-0" />
              <div>
                <div className="font-semibold">Скачать JSON</div>
                <div className="text-xs text-gray-500">Структурированные данные для программной обработки</div>
              </div>
              <Download className="w-4 h-4 ml-auto" />
            </Button>

            <Button
              onClick={() => csvData && downloadFile(csvData.csv, "questionnaire.csv", "text/csv")}
              disabled={!csvData}
              variant="outline"
              className="w-full justify-start text-left h-auto py-4"
            >
              <FileSpreadsheet className="w-5 h-5 mr-3 flex-shrink-0" />
              <div>
                <div className="font-semibold">Скачать CSV</div>
                <div className="text-xs text-gray-500">Табличный формат для Excel и Google Sheets</div>
              </div>
              <Download className="w-4 h-4 ml-auto" />
            </Button>

            <Button
              onClick={() => pdfData && downloadFile(pdfData.pdfText, "questionnaire.txt", "text/plain")}
              disabled={!pdfData}
              variant="outline"
              className="w-full justify-start text-left h-auto py-4"
            >
              <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
              <div>
                <div className="font-semibold">Скачать текстовый файл</div>
                <div className="text-xs text-gray-500">Читаемый текстовый формат для печати</div>
              </div>
              <Download className="w-4 h-4 ml-auto" />
            </Button>
          </div>
        </div>

        <div className="border-t-2 border-gray-200 pt-6">
          <Button
            onClick={() => setLocation("/")}
            size="lg"
            className="w-full"
          >
            <Home className="w-5 h-5 mr-2" />
            Вернуться на главную
          </Button>
        </div>

        {/* Важное уведомление о документах */}
        <div className="mt-6 p-6 bg-amber-50 border-4 border-amber-400 rounded-lg shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                Важный следующий шаг!
              </h3>
              <p className="text-base text-amber-900 mb-3">
                Пожалуйста, <strong>отправьте сканы/копии/файлы</strong> указанных в опроснике документов, 
                фотографий и других материалов на email:
              </p>
              <div className="bg-white rounded-lg p-3 border-2 border-amber-300 mb-3">
                <p className="text-xl font-bold text-amber-900 text-center">
                  hs-mixen@yandex.com
                </p>
              </div>
              <p className="text-sm text-amber-800">
                Это <strong>один из наиболее важных шагов</strong> в формировании родословной книги. 
                Фотографии и документы помогут сделать семейную историю живой и наглядной. 
				Данные собранных опросов позволят перейти к следующему этапу исследования в государственных архивах.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Что дальше?</span> Ваши данные будут использованы 
            для составления семейной родословной книги. Если у вас есть дополнительные вопросы, 
            вы можете связаться с организаторами проекта:
			Михаил Ланин - Telegram: @RobotMurlok / email: hs-mixen@yandex.com
          </p>
        </div>
      </div>
    </div>
  );
}

