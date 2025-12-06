# Патч: Привязка черновиков к userId

## Что исправляет

**Проблема:** При закрытии браузера прогресс заполнения опросника теряется, создаются дубликаты черновиков в БД.

**Решение:** Черновики теперь привязаны к userId вместо localStorage token. Прогресс сохраняется между сессиями браузера.

---

## Измененные файлы

1. **server/db.ts** - добавлена функция `getDraftByUserId()`
2. **server/routers.ts** - добавлен endpoint `questionnaire.getMyDraft`
3. **client/src/pages/Questionnaire.tsx** - изменена логика загрузки черновика
4. **cleanup_duplicate_drafts.sql** - SQL скрипт для очистки дубликатов

---

## Применение на VPS

### Шаг 1: Загрузка патча

```bash
# На локальной машине
scp userid_draft_patch.tar.gz ubuntu@your_vps_ip:/home/ubuntu/apps/heritage/
```

### Шаг 2: Резервная копия

```bash
# На VPS
cd /home/ubuntu/apps/heritage/
cp server/db.ts server/db.ts.backup
cp server/routers.ts server/routers.ts.backup
cp client/src/pages/Questionnaire.tsx client/src/pages/Questionnaire.tsx.backup
```

### Шаг 3: Применение патча

```bash
cd /home/ubuntu/apps/heritage/
tar -xzf userid_draft_patch.tar.gz
rm userid_draft_patch.tar.gz
```

### Шаг 4: Пересборка

```bash
pnpm build
```

### Шаг 5: Перезапуск

```bash
pm2 restart heritage-questionnaire
```

### Шаг 6: Очистка дубликатов (опционально)

**ВНИМАНИЕ:** Этот шаг удалит старые черновики! Сделайте резервную копию БД перед выполнением!

```bash
# Резервная копия БД
mysqldump -u questionnaire_user -p family_questionnaire > /tmp/backup_before_cleanup_$(date +%Y%m%d_%H%M%S).sql

# Применение SQL скрипта
mysql -u questionnaire_user -p family_questionnaire < cleanup_duplicate_drafts.sql
```

**Что делает скрипт:**
1. Показывает статистику дубликатов
2. Удаляет старые черновики (оставляет только последний для каждого пользователя)
3. Показывает результат

---

## Проверка

### 1. Проверить логи

```bash
pm2 logs heritage-questionnaire --lines 50
```

Не должно быть ошибок TypeScript или runtime ошибок.

### 2. Тест в браузере

1. Войдите в аккаунт
2. Откройте `/questionnaire`
3. Заполните 1-2 поля
4. **Закройте браузер полностью**
5. Откройте браузер снова
6. Войдите в тот же аккаунт
7. Откройте `/questionnaire`

**Ожидаемо:** Прогресс восстановлен, заполненные поля на месте.

### 3. Проверить БД

```bash
mysql -u questionnaire_user -p family_questionnaire
```

```sql
-- Проверить, что у каждого пользователя максимум 1 черновик
SELECT 
    userId,
    COUNT(*) as draft_count
FROM submissions
WHERE status = 'draft'
GROUP BY userId;
```

**Ожидаемо:** Каждый userId имеет максимум 1 черновик.

---

## Откат (если что-то пошло не так)

```bash
cd /home/ubuntu/apps/heritage/
cp server/db.ts.backup server/db.ts
cp server/routers.ts.backup server/routers.ts
cp client/src/pages/Questionnaire.tsx.backup client/src/pages/Questionnaire.tsx
pnpm build
pm2 restart heritage-questionnaire
```

---

## Что изменилось в коде

### Backend (server/db.ts)

**Добавлено:**
```typescript
export async function getDraftByUserId(userId: number) {
  // Возвращает последний черновик пользователя
}
```

### Backend (server/routers.ts)

**Добавлено:**
```typescript
questionnaire.getMyDraft: protectedProcedure.query(async ({ ctx }) => {
  // Проверяет наличие черновика у пользователя
  // Если есть - возвращает, если нет - создает новый
})
```

### Frontend (client/src/pages/Questionnaire.tsx)

**Было:**
- Создание нового опросника при каждом входе
- Токен хранится в localStorage
- При закрытии браузера токен теряется

**Стало:**
- Загрузка существующего черновика по userId
- Токен хранится в БД
- Прогресс сохраняется между сессиями

---

## Поддержка

Если возникли проблемы:
1. Проверьте логи: `pm2 logs heritage-questionnaire`
2. Проверьте БД на дубликаты
3. Откатите изменения (см. раздел "Откат")
4. Обратитесь к разработчику
