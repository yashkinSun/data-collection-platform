/**
 * Словарь переводов полей опросника с английского на русский
 * Используется для отображения в предпросмотре
 */
export const fieldTranslations: Record<string, string> = {
  // Согласие
  consent: "Согласие на обработку данных",
  agreeToProcess: "Согласие на обработку",
  agreeToPublishFamilyBook: "Согласие на публикацию в семейной книге",
  agreeToShareFamilyMembers: "Согласие на передачу членам семьи",
  agreeToPublishText: "Согласие на публикацию текста",
  agreeToPublishPhotos: "Согласие на публикацию фотографий",
  fullName: "ФИО",
  specialRestrictions: "Особые ограничения",
  privacyLevel: "Уровень конфиденциальности",

  // Респондент
  respondent: "Сведения о респонденте",
  lastName: "Фамилия",
  firstName: "Имя",
  middleName: "Отчество",
  maidenName: "Девичья фамилия",
  nicknames: "Прозвища",
  birthDate: "Дата рождения",
  date: "Дата",
  isApproximate: "Приблизительная дата",
  dateRange: "Диапазон дат",
  birthPlace: "Место рождения",
  settlementType: "Тип населённого пункта",
  historicalName: "Историческое название",
  region: "Регион",
  countryAtTime: "Страна",
  contact: "Контактная информация",
  phone: "Телефон",
  email: "Email",
  address: "Адрес",

  // Родители
  parents: "Родители",
  father: "Отец",
  mother: "Мать",
  names: "ФИО",
  lifeYears: "Годы жизни",
  deathDate: "Дата смерти",
  deathPlace: "Место смерти",
  profession: "Профессия",
  education: "Образование",
  militaryService: "Военная служба",
  awards: "Награды",
  characterTraits: "Черты характера",
  interests: "Интересы",
  importantEvents: "Важные события",

  // Бабушки и дедушки
  grandparents: "Бабушки и дедушки",
  paternalGrandfather: "Дедушка по отцу",
  paternalGrandmother: "Бабушка по отцу",
  maternalGrandfather: "Дедушка по матери",
  maternalGrandmother: "Бабушка по матери",

  // Прабабушки и прадедушки
  greatGrandparents: "Прабабушки и прадедушки",
  paternalGreatGrandfather: "Прадедушка по отцу",
  paternalGreatGrandmother: "Прабабушка по отцу",
  maternalGreatGrandfather: "Прадедушка по матери",
  maternalGreatGrandmother: "Прабабушка по матери",

  // Братья и сёстры
  siblings: "Братья и сёстры",
  name: "Имя",
  relationship: "Родство",
  yearOfBirth: "Год рождения",

  // Места
  places: "Места проживания",
  residencePlaces: "Места жительства",
  period: "Период",
  place: "Место",
  reason: "Причина переезда",

  // Традиции
  traditions: "Семейные традиции",
  familyStories: "Семейные истории",
  recipes: "Рецепты",
  celebrations: "Праздники",
  beliefs: "Верования",

  // Дополнительная информация
  additionalInfo: "Дополнительная информация",
  freeText: "Свободное поле",
  documents: "Документы",
  photos: "Фотографии",
  notes: "Примечания",
};

/**
 * Получить русское название поля с fallback на английское
 */
export function getFieldLabel(key: string): string {
  return fieldTranslations[key] || key;
}

/**
 * Получить двуязычное название поля: "englishKey (Русское название)"
 */
export function getBilingualFieldLabel(key: string): string {
  const translation = fieldTranslations[key];
  if (translation && translation !== key) {
    return `${key} (${translation})`;
  }
  return key;
}
