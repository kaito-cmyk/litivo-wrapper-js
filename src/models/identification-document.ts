import { z } from 'zod';

// Fixed set of identification document types used across the app.
// Adapt this list to match the application's allowed values.
const IdentificationTypes = [
  'CC', // Cédula de ciudadanía
  'CE', // Cédula de extranjería
  'TI', // Tarjeta de identidad
  'PA', // Pasaporte
  'NIT', // Número de identificación tributaria
  'RC' // Registro civil
] as const;

// Map of possible long labels to canonical codes. Keys are normalized (no diacritics, uppercased).
const LABEL_TO_CODE: Record<string, typeof IdentificationTypes[number]> = {
  'CEDULA DE CIUDADANIA': 'CC',
  'CEDULA DE EXTRANJERIA': 'CE',
  'TARJETA DE IDENTIDAD': 'TI',
  'PASAPORTE': 'PA',
  'NIT': 'NIT',
  'REGISTRO CIVIL': 'RC'
};

// Map canonical codes back to the display labels expected by the UI.
const CODE_TO_LABEL: Record<typeof IdentificationTypes[number], string> = {
  CC: 'CÉDULA DE CIUDADANÍA',
  CE: 'CÉDULA DE EXTRANJERÍA',
  TI: 'TARJETA DE IDENTIDAD',
  PA: 'PASAPORTE',
  NIT: 'NIT',
  RC: 'REGISTRO CIVIL'
};

function normalizeLabel(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase()
    .trim();
}

// Accept either the canonical code (e.g. 'CC') or a long label (e.g. 'CÉDULA DE CIUDADANÍA').
// We preprocess the input mapping long labels to their codes, then validate as enum.
const IdentificationDocumentSchema = z.object({
  type: z.preprocess((val) => {
    if (typeof val !== 'string') return val;
    const n = normalizeLabel(val);
    if (n in LABEL_TO_CODE) return LABEL_TO_CODE[n];
    return val; // will be validated by z.enum afterwards
  }, z.enum(IdentificationTypes, { message: 'Identification type is required' })),
  number: z.string().min(1), // TODO: add pattern/format validation if needed
  issueCity: z.string().min(1),
  filePath: z.string().min(1), // TODO: Has to exist or has to be bytes.
});

type IdentificationDocumentType = z.infer<typeof IdentificationDocumentSchema>;

const IdDocSchema = IdentificationDocumentSchema;
type IdDocType = IdentificationDocumentType;

export { CODE_TO_LABEL, IdDocSchema, IdentificationTypes, type IdDocType };

