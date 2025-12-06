-- Скрипт для очистки дубликатов черновиков
-- Оставляет только самый свежий черновик для каждого пользователя

-- Шаг 1: Посмотреть статистику дубликатов
SELECT 
    userId,
    COUNT(*) as draft_count,
    GROUP_CONCAT(id ORDER BY updatedAt DESC) as draft_ids
FROM submissions
WHERE status = 'draft'
GROUP BY userId
HAVING COUNT(*) > 1;

-- Шаг 2: Удалить старые черновики (оставить только последний)
-- ВНИМАНИЕ: Эта команда удалит данные! Сделайте резервную копию перед выполнением!

DELETE s1 FROM submissions s1
INNER JOIN (
    SELECT 
        userId,
        MAX(updatedAt) as latest_update
    FROM submissions
    WHERE status = 'draft'
    GROUP BY userId
) s2 ON s1.userId = s2.userId
WHERE s1.status = 'draft'
  AND s1.updatedAt < s2.latest_update;

-- Шаг 3: Проверить результат
SELECT 
    userId,
    COUNT(*) as draft_count
FROM submissions
WHERE status = 'draft'
GROUP BY userId;

-- Должно быть: каждый userId имеет максимум 1 черновик
