import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Register() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Регистрация успешна!");
      window.location.href = "/";
    },
    onError: (error) => {
      toast.error(error.message || "Ошибка регистрации");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ email, password, name });
  };

  const handleManusOAuth = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          {APP_LOGO && (
            <img src={APP_LOGO} alt={APP_TITLE} className="h-16 mx-auto mb-4" />
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Регистрация</h1>
          <p className="text-gray-600">Создайте аккаунт для доступа к опроснику</p>
        </div>

        {/* Локальная регистрация */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван Иванов"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ivan@example.com"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              required
              minLength={6}
              className="mt-2"
            />
          </div>

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full"
            size="lg"
          >
            {registerMutation.isPending ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </form>

        {/* Разделитель */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">или</span>
          </div>
        </div>

        {/* Manus OAuth */}
        <Button
          onClick={handleManusOAuth}
          variant="outline"
          className="w-full"
          size="lg"
        >
          Войти через Manus OAuth
        </Button>

        {/* Ссылка на вход */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Уже есть аккаунт?{" "}
            <button
              onClick={() => setLocation("/login")}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Войти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

