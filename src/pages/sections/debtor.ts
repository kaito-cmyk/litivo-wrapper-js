import type { Locator, Page } from 'playwright';
import { getDateInputSelector, getInputSelector } from '../../helpers.js';
import type { DebtorType, IdDocType } from '../../models/debtor.js';
import BaseSection from '../bases/section.js';

/**
 * TODO: Debtor (feat: extend create insolvency method with debtor section)
 * TODO: check the next BUSINESS LOGIC: Debtors can have just one insolvency application at a time.
 * TODO: Check if it is possible to used a tuple instead of an array.
 */
class DebtorSection extends BaseSection<[DebtorType[]]> {
  private readonly addDebtorButton: Locator;
  private readonly idTypeInput: Locator;
  private readonly idNumberInput: Locator;
  private readonly searchButton: Locator;
  private readonly documentIssueCityInput: Locator;
  private readonly originCountryInput: Locator;
  private readonly firstNameInput: Locator;
  private readonly middleNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly secondLastNameInput: Locator;
  private readonly addIdDocFileButton: Locator;
  private readonly idIdDocFileInput: Locator;
  private readonly uploadIdDocFileButton: Locator;
  private readonly genderInput: Locator;
  private readonly civilStatusInput: Locator;
  private readonly birthDateInput: Locator;
  private readonly ethnicityInput: Locator;
  private readonly disabilityInput: Locator;

  public constructor(page: Page) {
    super(page);
    this.addDebtorButton = page.locator('app-insolvencia-deudor button.btn-guardar');
    this.idTypeInput = page.locator(getInputSelector('tipoDocumento'));
    this.idNumberInput = page.locator('input[formcontrolname="numeroIdentificacion"]');
    this.searchButton = page.locator('span', { hasText: 'Buscar' }); // TODO: Find a better way to get the locator.
    this.documentIssueCityInput = page.locator(getInputSelector('ciudadExpedicion'));
    this.originCountryInput = page.locator(getInputSelector('paisOrigen'));
    this.firstNameInput = page.locator('input[formcontrolname="nombre1"]');
    this.middleNameInput = page.locator('input[formcontrolname="nombre2"]');
    this.lastNameInput = page.locator('input[formcontrolname="apellido1"]');
    this.secondLastNameInput = page.locator('input[formcontrolname="apellido2"]');
    this.addIdDocFileButton = page.locator('span', { hasText: 'ANEXAR COPIA DE LA CÉDULA' }); // TODO: Find a better way to get the locator.
    this.idIdDocFileInput = page.locator('input[type="file"]#undefined');
    this.uploadIdDocFileButton = page.locator('button:not([disabled])', { hasText: 'Subir' }); // TODO: Find a better way to get the locator.
    this.genderInput = page.locator(getInputSelector('genero'));
    this.civilStatusInput = page.locator(getInputSelector('estadoCivil'));
    this.birthDateInput = page.locator(getDateInputSelector('fechaNacimiento'));
    this.ethnicityInput = page.locator(getInputSelector('etnia'));
    this.disabilityInput = page.locator(getInputSelector('discapacidad'));
  }
  public async send(debtors: DebtorType[]): Promise<void> {
    const page = this.page;

    for (const debtor of debtors) {
      const idDoc: IdDocType = debtor.idDoc;
      const docType: string = idDoc.type;
      const docNumber: string = idDoc.number;
      const docFilePath: string = idDoc.filePath;
      const middleName: string | undefined = debtor.middleName;
      const secondLastName: string | undefined = debtor.secondLastName;
      const civilStatus: string | undefined = debtor.civilStatus;
      const ethnicity: string | undefined = debtor.ethnicity;
      const disability: string | undefined = debtor.disability;

      await this.addDebtorButton.click();

      await this.selectOption(this.idTypeInput, docType);
      await this.idNumberInput.fill(docNumber);
      await this.searchButton.click();

      await this.fillInput(this.documentIssueCityInput, idDoc.issueCity);
      await this.fillInput(this.originCountryInput, debtor.originCountry);

      await this.firstNameInput.fill(debtor.firstName);
      if (middleName !== undefined) {
        await this.middleNameInput.fill(middleName);
      }
      await this.lastNameInput.fill(debtor.lastName);
      if (secondLastName !== undefined) {
        await this.secondLastNameInput.fill(secondLastName);
      }

      await this.addIdDocFileButton.click();
      await this.idIdDocFileInput.setInputFiles(docFilePath);
      await this.uploadIdDocFileButton.click();

      await this.selectOption(this.genderInput, debtor.gender);
      if (civilStatus !== undefined) {
        await this.selectOption(this.civilStatusInput, civilStatus);
      }
      await this.fillDateInput(this.birthDateInput, debtor.birthDate);
      if (ethnicity !== undefined) {
        await this.selectOption(this.ethnicityInput, ethnicity);
      }
      if (disability !== undefined) {
        await this.selectDescriptedOption(this.disabilityInput, disability);
      }

      // TODO: Fill up to 3 telephone numbers.
      // TODO: Fill up to 3 cellphone numbers.

      throw new Error('Method not fully implemented.');

      // breakpoint

      // Address fields
      if (debtor.address) {
        if (debtor.address.country) {
          await this.selectOption(
            page.locator(getInputSelector('paisResidencia')),
            debtor.address.country,
          );
        }
        if (debtor.address.department) {
          await this.selectOption(
            page.locator(getInputSelector('departamento')),
            debtor.address.department,
          );
        }
        if (debtor.address.city) {
          await this.selectOption(page.locator(getInputSelector('ciudad')), debtor.address.city);
        }
        if (debtor.address.mainRoad) {
          await page.locator('input[formcontrolname="a1"]').fill(debtor.address.mainRoad);
        }
        if (debtor.address.roadNumber) {
          await page.locator('input[formcontrolname="a2"]').fill(debtor.address.roadNumber);
        }
        if (debtor.address.complement) {
          await page.locator('input[formcontrolname="a3"]').fill(debtor.address.complement);
        }
        if (debtor.address.details) {
          await page
            .locator('input[formcontrolname="detalleDireccion"]')
            .fill(debtor.address.details);
        }
        if (debtor.address.socioeconomicStratum) {
          await this.selectOption(
            page.locator(getInputSelector('estrato')),
            debtor.address.socioeconomicStratum,
          );
        }
      }

      // Contact
      if (debtor.primaryPhone) {
        await page.locator('input[formcontrolname="telefono1"]').fill(debtor.primaryPhone);
      }
      if (debtor.cellPhone) {
        await page.locator('input[formcontrolname="celular1"]').fill(debtor.cellPhone);
      }
      if (typeof debtor.knowsEmail === 'boolean') {
        const checkbox = page.locator(
          'label[formcontrolname="conoceEmail"] input[type="checkbox"]',
        );
        const isChecked = await checkbox.isChecked().catch(() => false);
        if (debtor.knowsEmail !== isChecked) {
          await checkbox.click();
        }
      }
      if (debtor.primaryEmail) {
        await page.locator('input[formcontrolname="email1"]').fill(debtor.primaryEmail);
      }
      if (debtor.webPage1) {
        await page.locator('input[formcontrolname="paginaWeb1"]').fill(debtor.webPage1);
      }

      // Person type (Comerciante checkbox)
      if (typeof debtor.isMerchant === 'boolean') {
        const comercianteLabel = page.locator('label', { hasText: 'Comerciante' });
        if (await comercianteLabel.count()) {
          const comercianteInput = comercianteLabel.locator('input[type="checkbox"]');
          const checked = await comercianteInput.isChecked().catch(() => false);
          if (debtor.isMerchant !== checked) await comercianteInput.click();
        }
      }

      // Legal procedures
      if (typeof debtor.hasCollectionProcedures === 'boolean') {
        const radioLabel = page.locator(
          'nz-radio-group[formcontrolname="tiene_procedimientos"] label',
          {
            hasText: debtor.hasCollectionProcedures ? 'Si' : 'No',
          },
        );
        if (await radioLabel.count()) await radioLabel.click();
      }

      // Employment
      if (typeof debtor.hasEmployment === 'boolean') {
        const empleoLabel = page.locator(
          'label[formcontrolname="tieneEmpleo"] input[type="checkbox"]',
        );
        const checked = await empleoLabel.isChecked().catch(() => false);
        if (debtor.hasEmployment !== checked) await empleoLabel.click();
      }

      // Give a small pause to let UI react
      await page.waitForTimeout(300);
    }
  }
}

export default DebtorSection;
