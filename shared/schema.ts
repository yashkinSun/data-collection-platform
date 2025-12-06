import { z } from "zod";

// --- Вспомогательные схемы ---

const DateWithApproxSchema = z.object({
  date: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, "Неверный формат даты (ожидается ГГГГ-ММ-ДД или ГГГГ)").optional(), // YYYY-MM-DD or YYYY
  isApproximate: z.boolean().default(false),
  dateRange: z.string().optional(), // Например, 1908–1910
}).refine(data => data.date || data.dateRange, {
  message: "Должна быть указана дата или диапазон",
  path: ["date"]
});

const PlaceSchema = z.object({
  settlementType: z.enum(["город", "село", "деревня", "станица", "другое"]).optional(),
  historicalName: z.string().min(1, "Обязательно укажите историческое название"),
  modernName: z.string().optional(),
  district: z.string().optional(), // Район/уезд
  region: z.string().optional(), // Область/губерния/край
  countryAtTime: z.string().min(1, "Обязательно укажите страну на момент события"),
  countryNow: z.string().optional(),
  address: z.string().optional(), // Адрес/координаты
});

const ContactSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email("Неверный формат email").optional().or(z.literal("")),
  address: z.string().optional(),
});

const ProfessionSchema = z.object({
  mainOccupation: z.string().optional(),
  details: z.string().optional(), // Ремесло / цех / сословие
  workplaces: z.string().optional(),
  positions: z.string().optional(),
  achievements: z.string().optional(),
});

const NamesSchema = z.object({
  lastName: z.string().min(1, "Фамилия обязательна"),
  firstName: z.string().min(1, "Имя обязательно"),
  middleName: z.string().min(1, "Отчество обязательно"),
  maidenName: z.string().optional(),
  marriedName: z.string().optional(),
  otherNames: z.array(z.string()).optional(),
  nicknames: z.array(z.string()).optional(), // Варианты имён / прозвища
});

const LifeYearsSchema = z.object({
  birthDate: DateWithApproxSchema,
  birthPlace: PlaceSchema,
  deathDate: DateWithApproxSchema.optional(),
  deathPlace: PlaceSchema.optional(),
  burialPlace: z.string().optional(),
});

const SocialStatusSchema = z.object({
  nationality: z.string().optional(), // по документам / по традиции
  religion: z.string().optional(),
  languages: z.string().optional(),
  estate: z.string().optional(), // Сословие
  socialPosition: z.string().optional(),
  titles: z.string().optional(),
  possessions: z.string().optional(),
});

const KeyEventsSchema = z.object({
  militaryService: z.string().optional(),
  warParticipation: z.string().optional(),
  repression: z.string().optional(),
  migration: z.string().optional(),
  otherEvents: z.string().optional(),
  source: z.string().optional(), // Источник информации
});

const FamilyMemberSchema = z.object({
  lastName: z.string().min(1, "Фамилия обязательна"),
  firstName: z.string().min(1, "Имя обязательно"),
  middleName: z.string().optional(),
  birthDate: DateWithApproxSchema.optional(),
  deathDate: DateWithApproxSchema.optional(),
  spouse: z.string().optional(),
  notes: z.string().optional(),
});

const MarriageSchema = z.object({
  spouseName: z.string().min(1, "ФИО супруга(и) обязательно"),
  spouseMaidenName: z.string().optional(),
  marriageDate: DateWithApproxSchema.optional(),
  marriagePlace: PlaceSchema.optional(),
  divorceDate: DateWithApproxSchema.optional(),
  children: z.array(FamilyMemberSchema).optional(),
});

const AncestorSpouseSchema = z.object({
  names: NamesSchema.omit({ maidenName: true, marriedName: true }).extend({ maidenName: z.string().optional() }),
  lifeYears: LifeYearsSchema.optional(),
});

const AncestorSchema = z.object({
  names: NamesSchema,
  lifeYears: LifeYearsSchema,
  socialStatus: SocialStatusSchema.optional(),
  profession: ProfessionSchema.optional(),
  keyEvents: KeyEventsSchema.optional(),
  character: z.string().optional(),
  spouse: AncestorSpouseSchema.optional(), // Супруг(а) предка
});

const MigrationPlaceSchema = z.object({
  year: z.string().min(1, "Год обязателен"),
  place: PlaceSchema,
  reason: z.string().optional(),
});

const TraditionSchema = z.object({
  name: z.string().min(1, "Название традиции обязательно"),
  originYear: z.string().optional(),
  initiator: z.string().optional(),
  isPreserved: z.boolean().optional(),
});

const RelicSchema = z.object({
  name: z.string().min(1, "Название реликвии обязательно"),
  keeper: z.string().min(1, "Хранитель обязателен"),
  canPhotograph: z.boolean().optional(),
  canPublish: z.boolean().optional(),
});

const DocumentSchema = z.object({
  type: z.string().min(1, "Тип документа обязателен"),
  description: z.string().min(1, "Описание обязательно"),
  storageLocation: z.string().optional(),
  pageNumber: z.string().optional(),
  canPublish: z.boolean().optional(),
});

const PhotoSchema = z.object({
  description: z.string().min(1, "Описание фото обязательно"),
  date: DateWithApproxSchema.optional(),
  people: z.string().optional(),
  canPublish: z.boolean().optional(),
});

// --- Основные шаги формы ---

export const AuthSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export const ConsentSchema = z.object({
  fullName: z.string().min(1, "ФИО обязательно для согласия"),
  agreeToProcess: z.boolean().refine(val => val === true, { message: "Согласие на обработку данных обязательно" }),
  agreeToPublishFamilyBook: z.boolean().optional(),
  agreeToShareFamilyMembers: z.boolean().optional(),
  agreeToPublishText: z.boolean().optional(),
  agreeToPublishPhotos: z.boolean().optional(),
  privacyLevel: z.enum(["только для семьи", "для книги", "можно публиковать открыто"]).optional(),
  specialRestrictions: z.string().optional(),
});

export const RespondentSchema = z.object({
  lastName: z.string().min(1, "Фамилия обязательна (★)"),
  firstName: z.string().min(1, "Имя обязательно (★)"),
  middleName: z.string().min(1, "Отчество обязательно (★)"),
  maidenName: z.string().optional(),
  otherNames: z.array(z.string()).optional(),
  nicknames: z.array(z.string()).optional(),
  birthDate: DateWithApproxSchema,
  birthPlace: PlaceSchema,
  contact: ContactSchema.optional(),
  education: z.object({
    school: z.string().optional(),
    secondarySpecial: z.string().optional(),
    higher: z.string().optional(),
    degrees: z.string().optional(),
  }).optional(),
  profession: ProfessionSchema.optional(),
  marriages: z.array(MarriageSchema).optional(),
  children: z.array(FamilyMemberSchema).optional(),
  siblings: z.array(FamilyMemberSchema).optional(),
  source: z.string().optional(),
});

export const ParentsSchema = z.object({
  father: AncestorSchema.optional(),
  mother: AncestorSchema.optional(),
});

export const GrandparentsSchema = z.object({
  paternalGrandfather: AncestorSchema.optional(),
  paternalGrandmother: AncestorSchema.optional(),
  maternalGrandfather: AncestorSchema.optional(),
  maternalGrandmother: AncestorSchema.optional(),
});

export const PlacesSchema = z.object({
  migrationPlaces: z.array(MigrationPlaceSchema).optional(),
});

export const TraditionsDocumentsSchema = z.object({
  traditions: z.array(TraditionSchema).optional(),
  relics: z.array(RelicSchema).optional(),
  documents: z.array(DocumentSchema).optional(),
  photos: z.array(PhotoSchema).optional(),
});

export const MiscellaneousSchema = z.object({
  events: z.string().optional(),
  inconsistencies: z.string().optional(),
  stories: z.string().optional(),
  questions: z.string().optional(),
});

// --- Общая схема формы ---

export const FamilyQuestionnaireSchema = z.object({
  auth: AuthSchema,
  consent: ConsentSchema,
  respondent: RespondentSchema,
  parents: ParentsSchema,
  grandparents: GrandparentsSchema,
  places: PlacesSchema,
  traditionsDocuments: TraditionsDocumentsSchema,
  miscellaneous: MiscellaneousSchema,
});

export type FamilyQuestionnaireData = z.infer<typeof FamilyQuestionnaireSchema>;
export type RespondentData = z.infer<typeof RespondentSchema>;
export type AncestorData = z.infer<typeof AncestorSchema>;
export type PlaceData = z.infer<typeof PlaceSchema>;
export type DateWithApproxData = z.infer<typeof DateWithApproxSchema>;
export type MarriageData = z.infer<typeof MarriageSchema>;
export type FamilyMemberData = z.infer<typeof FamilyMemberSchema>;
export type MigrationPlaceData = z.infer<typeof MigrationPlaceSchema>;
export type TraditionData = z.infer<typeof TraditionSchema>;
export type RelicData = z.infer<typeof RelicSchema>;
export type DocumentData = z.infer<typeof DocumentSchema>;
export type PhotoData = z.infer<typeof PhotoSchema>;

