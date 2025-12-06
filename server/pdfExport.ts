// Простая утилита для генерации PDF из данных опросника
// Использует базовую генерацию текста, так как @react-pdf/renderer требует специальной настройки

export async function generatePDFSimple(data: any): Promise<string> {
  // Функция для форматирования объекта в текст
  const formatObject = (obj: any, indent = 0): string => {
    if (!obj || typeof obj !== 'object') {
      return String(obj || '');
    }

    const spaces = '  '.repeat(indent);
    let result = '';

    for (const [key, value] of Object.entries(obj)) {
      if (!value) continue;

      const label = key
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(/^./, (str) => str.toUpperCase());

      if (typeof value === 'object' && !Array.isArray(value)) {
        result += `${spaces}${label}:\n`;
        result += formatObject(value, indent + 1);
      } else if (Array.isArray(value)) {
        result += `${spaces}${label}: ${value.join(', ')}\n`;
      } else {
        result += `${spaces}${label}: ${value}\n`;
      }
    }

    return result;
  };

  // Формируем текстовое представление
  let pdfContent = '='.repeat(60) + '\n';
  pdfContent += '           СЕМЕЙНЫЙ ОПРОСНИК\n';
  pdfContent += '        Родословные данные\n';
  pdfContent += '='.repeat(60) + '\n\n';

  if (data.consent) {
    pdfContent += '--- СОГЛАСИЕ НА ОБРАБОТКУ ДАННЫХ ---\n';
    pdfContent += formatObject(data.consent);
    pdfContent += '\n';
  }

  if (data.respondent) {
    pdfContent += '--- СВЕДЕНИЯ О РЕСПОНДЕНТЕ ---\n';
    pdfContent += formatObject(data.respondent);
    pdfContent += '\n';
  }

  if (data.parents?.father) {
    pdfContent += '--- ОТЕЦ ---\n';
    pdfContent += formatObject(data.parents.father);
    pdfContent += '\n';
  }

  if (data.parents?.mother) {
    pdfContent += '--- МАТЬ ---\n';
    pdfContent += formatObject(data.parents.mother);
    pdfContent += '\n';
  }

  if (data.siblings) {
    pdfContent += '--- БРАТЬЯ И СЁСТРЫ ---\n';
    pdfContent += formatObject(data.siblings);
    pdfContent += '\n';
  }

  if (data.grandparents?.paternalGrandfather) {
    pdfContent += '--- ДЕДУШКА ПО ОТЦУ ---\n';
    pdfContent += formatObject(data.grandparents.paternalGrandfather);
    pdfContent += '\n';
  }

  if (data.grandparents?.paternalGrandmother) {
    pdfContent += '--- БАБУШКА ПО ОТЦУ ---\n';
    pdfContent += formatObject(data.grandparents.paternalGrandmother);
    pdfContent += '\n';
  }

  if (data.grandparents?.maternalGrandfather) {
    pdfContent += '--- ДЕДУШКА ПО МАТЕРИ ---\n';
    pdfContent += formatObject(data.grandparents.maternalGrandfather);
    pdfContent += '\n';
  }

  if (data.grandparents?.maternalGrandmother) {
    pdfContent += '--- БАБУШКА ПО МАТЕРИ ---\n';
    pdfContent += formatObject(data.grandparents.maternalGrandmother);
    pdfContent += '\n';
  }

  if (data.greatGrandparents) {
    pdfContent += '--- ПРАДЕДУШКИ И ПРАБАБУШКИ ---\n';
    pdfContent += formatObject(data.greatGrandparents);
    pdfContent += '\n';
  }

  if (data.places) {
    pdfContent += '--- МЕСТА ПРОЖИВАНИЯ ---\n';
    pdfContent += formatObject(data.places);
    pdfContent += '\n';
  }

  if (data.traditions) {
    pdfContent += '--- СЕМЕЙНЫЕ ТРАДИЦИИ ---\n';
    pdfContent += formatObject(data.traditions);
    pdfContent += '\n';
  }

  if (data.additionalInfo) {
    pdfContent += '--- ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ ---\n';
    pdfContent += formatObject(data.additionalInfo);
    pdfContent += '\n';
  }

  pdfContent += '='.repeat(60) + '\n';
  pdfContent += `Дата создания: ${new Date().toLocaleString('ru-RU')}\n`;
  pdfContent += '='.repeat(60) + '\n';

  return pdfContent;
}

// Экспорт в CSV формат
export function generateCSV(data: any): string {
  const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    const flattened: Record<string, any> = {};

    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value === null || value === undefined) {
        flattened[newKey] = '';
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(flattened, flattenObject(value, newKey));
      } else if (Array.isArray(value)) {
        flattened[newKey] = value.join('; ');
      } else {
        flattened[newKey] = value;
      }
    }

    return flattened;
  };

  const flat = flattenObject(data);
  const headers = Object.keys(flat);
  const values = Object.values(flat).map(v =>
    typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
  );

  return headers.join(',') + '\n' + values.join(',');
}

