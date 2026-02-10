import { z } from 'zod';
import { IdDocSchema, type IdDocType } from './identification-document.js';

const PhoneSchema = z.string().min(1, 'Phone number is required');

const DebtorSchema = z.object({
  // === Identification Data === // NOTE: from originCountry to birthDate may be part of the idDoc as well.
  idDoc: IdDocSchema,
  // NOTE: This info can be found in in a excel file with "Formato de Radicación" in its name.
  originCountry: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1),
  secondLastName: z.string().trim().optional(),
  gender: z.string().trim().min(8), // TODO: "FEMENINO", "MASCULINO", "NO APLICA".
  // NOTE: civilStatus May appear in a excel file with "Formato de Radicación" in its name.
  civilStatus: z.string().trim().min(9).optional(), // TODO: "Casado(a)", "Soltero(a)", "No informa".
  birthDate: z.iso.date(), // TODO: Check if use ISO date or a Date object.
  // NOTE: Idk where to find this information.
  ethnicity: z.string().trim().min(4).optional(), // TODO: "Ninguna", "Indigena", "Afro", "Room".
  disability: z.string().trim().min(4).optional(), // TODO: "Ninguna", "Física", "Sensorial", "Intelectual", "Psíquica", "Visceral", "Múltiple", "Otra".

  // === Contact Information ===
  residenceCountry: z.string().trim().min(1), // Known fixed options
  department: z.string().trim().min(1), // Known fixed options
  city: z.string().trim().min(1), // Known fixed options
  // judicialNotificationAddress
  roadType: z.string().trim().min(1).optional(), // TODO: "Calle", "Carrera", "Avenida", "Avenida carrera", "Avenida calle", "Circular", "Circunvalar", "Diagonal", "Manzana", "Transversal", "Vía".
  roadName: z.string().trim().optional(),
  roadNumber: z.string().trim().min(1).optional(), // Mandatory if roadType, roadName, roadDetail or roadStratum is present.
  roadSubNumber: z.string().trim().min(1).optional(), // Mandatory if roadType, roadName, roadDetail or roadStratum is present.
  roadDetails: z.string().trim().trim().optional(), // TODO: Examples: "apto", "casa", "referencia".
  roadStratum: z.string().trim().min(1).optional(), // TODO: "ESTRATO 1", "ESTRATO 2", ..., "ESTRATO 6", "NO INFORMA".

  telephones: z.array(PhoneSchema).max(3).optional(), // NOTE: Idk phone structure.
  cellphones: z.array(PhoneSchema).max(3).optional(), // NOTE: Idk phone structure.
  emailsOrReason: z.union([z.array(z.email()).min(1).max(3), z.string().trim().min(1)]),
  webPages: z.array(z.url()).max(3).optional(),
  // Natural person type
  isMerchant: z.boolean(),
  hasMultipleDebtCollectionProcedures: z.boolean(), // ¿En contra de usted se han iniciado dos (2) o más procedimientos públicos o privados de cobro de obligaciones dinerarias, de ejecución especial o de restitución de bienes por mora en el pago de cánones?

  /** TODO: Check if the next IA generated fields are ok

  // === Professional information ===  (array of them)
  professionalLicenseNumber: z.string().optional(),
  degreeIssuingEntity: z.string().optional(),
  graduationDate: z.string().optional(), // ISO date (yyyy-mm-dd)

  // === Address ===
  businessName: z.string().optional(),

  // === Income information ===
  hasMonthlyIncome: z.boolean(),
  monthlyIncomeAmount: z.number().optional(),

  hasOtherActivitiesIncome: z.boolean(),

  // === Legal procedures ===
  hasCollectionProcedures: z.boolean(),

  // Employment
  hasEmployment: z.boolean().optional(),


  */
});

type DebtorType = z.infer<typeof DebtorSchema>;

export { DebtorSchema, IdDocSchema };
export type { DebtorType, IdDocType };
