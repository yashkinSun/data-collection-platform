import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useLocation } from "wouter";

/**
 * All content in this page are only for example, delete if unneeded
 * When building pages, remember your instructions in Frontend Workflow, Frontend Best Practices, Design Guide and Common Pitfalls
 */
export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  const [, setLocation] = useLocation();
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  // If theme is switchable in App.tsx, we can implement theme toggling like this:
  // const { theme, toggleTheme } = useTheme();

  // Use APP_LOGO (as image src) and APP_TITLE if needed

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {APP_TITLE}
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Семейный опросник для сбора родословных данных
            </p>
            <p className="text-gray-500">
              Сохраним память о наших предках для будущих поколений
            </p>
          </div>

          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <p className="text-blue-900 mb-4">
                  Добро пожаловать, <span className="font-semibold">{user?.name || user?.email}</span>!
                </p>
                <p className="text-blue-800 text-sm">
                  Вы можете начать заполнение опросника или продолжить сохранённый черновик.
                </p>
              </div>

              <Button
                onClick={() => window.location.href = '/questionnaire'}
                size="lg"
                className="w-full text-lg py-6"
              >
                Начать заполнение опросника
              </Button>

              {user?.role === "admin" && (
                <Button
                  onClick={() => setLocation("/admin")}
                  variant="secondary"
                  className="w-full"
                >
                  Панель администратора
                </Button>
              )}

              <Button
                onClick={() => logout()}
                variant="outline"
                className="w-full"
              >
                Выйти
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
                <p className="text-amber-900 text-sm">
                  Для заполнения опросника необходимо войти в систему. 
                  Это позволит сохранять ваши данные и продолжать заполнение позже.
                </p>
              </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => setLocation("/login")}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
            >
              Войти
            </Button>
            <Button 
              onClick={() => setLocation("/register")}
              size="lg"
              className="text-lg px-8 py-6"
            >
              Регистрация
            </Button>
          </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">О проекте</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Этот опросник создан для сбора и систематизации информации о семейной истории. 
              Ваши воспоминания и знания помогут сохранить память о наших предках для будущих поколений.
			  Если у вас есть дополнительные вопросы, 
              вы можете связаться с организаторами проекта:
			  Михаил Ланин - Telegram: @RobotMurlok / email: hs-mixen@yandex.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
