import { z } from 'zod';
import { IdDocSchema, type IdDocType } from './identification-document.js';

const DebtorSchema = z.object({
  // Identification Data
  idDoc: IdDocSchema,
  // === Personal information === // NOTE: from originCountry to birthDate may be part of the idDoc as well.
  // NOTE: This info can be found in in a excel file with "Formato de Radicación" in its name.
  originCountry: z.string().min(1),
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
  secondLastName: z.string().optional(),
  gender: z.string().min(8), // TODO: "FEMENINO", "MASCULINO", "NO APLICA".
  // NOTE: civilStatus May appear in a excel file with "Formato de Radicación" in its name.
  civilStatus: z.string().min(9).optional(), // TODO: "Casado(a)", "Soltero(a)", "No informa".
  birthDate: z.iso.date(), // TODO: Check if use ISO date or a Date object.

  // NOTE: Idk where to find this information.
  ethnicity: z.string().min(4).optional(), // TODO: "Ninguna", "Indigena", "Afro", "Room".
  disability: z.string().min(4).optional(), // TODO: "Ninguna", "Física", "Sensorial", "Intelectual", "Psíquica", "Visceral", "Múltiple", "Otra".

  // === Contact ===
  // judicialNotificationAddress
  roadType: z.string().min(1).optional(),
  roadName: z.string().min(1).optional(),
  roadNumber: z.string().min(1).optional(),
  roadSubNumber: z.string().min(1).optional(),
  roadDetails: z.string().min(1).optional(),
  roadStratum: z.string().min(1).optional(), // TODO: "ESTRADO 1", "ESTRATO 2", ..., "ESTRATO 6", "NO INFORMA".

  primaryEmail: z.email(),
  secondaryEmail: z.email().optional(),

  primaryPhone: z.string().optional(),
  secondaryPhone: z.string().optional(),
  cellPhone: z.string().optional(),

  knowsEmail: z.boolean().optional(),

  webPage1: z.string().optional(),

  // TODO: Check if the next IA generated fields are ok

  // === Professional information ===  (array of them)
  professionalLicenseNumber: z.string().optional(),
  degreeIssuingEntity: z.string().optional(),
  graduationDate: z.string().optional(), // ISO date (yyyy-mm-dd)

  // === Address ===
  businessName: z.string().optional(),

  address: z.object({
    country: z.string().optional(),
    department: z.string().optional(),
    city: z.string().optional(),
    mainRoad: z.string().optional(),
    roadNumber: z.string().optional(),
    complement: z.string().optional(),
    details: z.string().optional(),
    socioeconomicStratum: z.string().optional(),
  }),

  // === Income information ===
  hasMonthlyIncome: z.boolean(),
  monthlyIncomeAmount: z.number().optional(),

  hasOtherActivitiesIncome: z.boolean(),

  // === Legal procedures ===
  hasCollectionProcedures: z.boolean(),

  // Employment
  hasEmployment: z.boolean().optional(),

  // Person type
  isMerchant: z.boolean().optional(),
});

type DebtorType = z.infer<typeof DebtorSchema>;

export { DebtorSchema, IdDocSchema };
export type { DebtorType, IdDocType };
