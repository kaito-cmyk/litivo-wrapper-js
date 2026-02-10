import type { Locator, Page } from 'playwright';
import { getDateInputSelector, getInputSelector } from '../../helpers.js';
import type { DebtorType, IdDocType } from '../../models/debtor.js';
import BaseSection from '../bases/section.js';

const plusSpanSelector: string = '+ span.ant-input-suffix';

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
  private readonly residenceCountryInput: Locator;
  private readonly departmentInput: Locator;
  private readonly cityInput: Locator;
  private readonly roadTypeInput: Locator;
  private readonly roadNameInput: Locator;
  private readonly roadNumberInput: Locator;
  private readonly roadSubNumberInput: Locator;
  private readonly roadDetailsInput: Locator;
  private readonly roadStratumInput: Locator;

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
    this.residenceCountryInput = page.locator(getInputSelector('paisResidencia'));
    this.departmentInput = page.locator(getInputSelector('departamento'));
    this.cityInput = page.locator(getInputSelector('ciudad'));
    this.roadTypeInput = page.locator(getInputSelector('razonSocial'));
    this.roadNameInput = page.locator('input[formcontrolname="a1"]');
    this.roadNumberInput = page.locator('input[formcontrolname="a2"]');
    this.roadSubNumberInput = page.locator('input[formcontrolname="a3"]');
    this.roadDetailsInput = page.locator('input[formcontrolname="detalleDireccion"]');
    this.roadStratumInput = page.locator(getInputSelector('estrato'));
  }
  public async send(debtors: DebtorType[]): Promise<void> {
    const page = this.page;

    for (const debtor of debtors) {
      const idDoc: IdDocType = debtor.idDoc;
      const docType: string = idDoc.type;
      const docNumber: string = idDoc.number;
      const docFilePath: string = idDoc.filePath;
      const middleName: string = debtor.middleName || '';
      const secondLastName: string = debtor.secondLastName || '';
      const civilStatus: string | undefined = debtor.civilStatus;
      const ethnicity: string | undefined = debtor.ethnicity;
      const disability: string | undefined = debtor.disability;
      const residenceCountry: string = debtor.residenceCountry;
      const roadType: string | undefined = debtor.roadType;
      const roadName: string = debtor.roadName || '';
      const roadNumber: string | undefined = debtor.roadNumber;
      const roadSubNumber: string | undefined = debtor.roadSubNumber;
      const roadDetails: string = debtor.roadDetails || '';
      const roadStratum: string | undefined = debtor.roadStratum;

      const hasJudicialNotificationAddress: boolean =
        roadType !== undefined ||
        roadName !== '' ||
        roadDetails !== '' ||
        roadStratum !== undefined;
      if (hasJudicialNotificationAddress) {
        if (roadNumber === undefined) {
          throw new Error('roadNumber is required when hasJudicialNotificationAddress is true');
        }
        if (roadSubNumber === undefined) {
          throw new Error('subNumber is required when hasJudicialNotificationAddress is true');
        }
      }
      const telephones: string[] = debtor.telephones || [];
      const cellphones: string[] = debtor.cellphones || [];
      const emailsOrReason: string | string[] = debtor.emailsOrReason;
      const webPages: string[] = debtor.webPages || [];

      await this.addDebtorButton.click();

      await this.selectOption(this.idTypeInput, docType);
      await this.idNumberInput.fill(docNumber);
      await this.searchButton.click();

      await this.fillInput(this.documentIssueCityInput, idDoc.issueCity);
      await this.fillInput(this.originCountryInput, debtor.originCountry);

      await this.firstNameInput.fill(debtor.firstName);
      if (middleName !== '') {
        await this.middleNameInput.fill(middleName);
      }
      await this.lastNameInput.fill(debtor.lastName);
      if (secondLastName !== '') {
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
      const residenceCountryInputValue = await this.residenceCountryInput.innerText();
      if (residenceCountryInputValue !== residenceCountry) {
        await this.fillInput(this.residenceCountryInput, residenceCountry);
      }
      await this.fillInput(this.departmentInput, debtor.department);
      await this.fillInput(this.cityInput, debtor.city);

      if (roadType !== undefined) {
        await this.selectOption(this.roadTypeInput, roadType);
      }
      if (roadName !== '') {
        await this.roadNameInput.fill(roadName);
      }
      if (roadNumber !== undefined) {
        await this.roadNumberInput.fill(roadNumber);
      }
      if (roadSubNumber !== undefined) {
        await this.roadSubNumberInput.fill(roadSubNumber);
      }
      if (roadStratum !== '') {
        await this.roadDetailsInput.fill(roadDetails);
      }
      if (roadStratum !== undefined) {
        await this.selectOption(this.roadStratumInput, roadStratum);
      }
      let telephoneIndex: number = 0; // TODO: Up to 3.
      for (const telephone of telephones) {
        telephoneIndex++;
        const telephoneInput: Locator = page.locator(
          `[formcontrolname="telefono${telephoneIndex}"]`,
        );
        await telephoneInput.fill(telephone);
        if (telephoneIndex === 1) {
          await telephoneInput.locator(plusSpanSelector).click();
        }
      }
      let cellphoneIndex: number = 0; // TODO: Up to 3.
      for (const cellphone of cellphones) {
        cellphoneIndex++;
        const cellphoneInput: Locator = page.locator(
          `[formcontrolname="celular${cellphoneIndex}"]`,
        );
        await cellphoneInput.fill(cellphone);
        if (cellphoneIndex === 1) {
          await cellphoneInput.locator(plusSpanSelector).click();
        }
      }
      if (Array.isArray(emailsOrReason)) {
        // value is string[]
        let emailIndex: number = 0; // TODO: Up to 3.
        for (const email of emailsOrReason) {
          emailIndex++;
          const emailInput: Locator = page.locator(`[formcontrolname="email${emailIndex}"]`);
          await emailInput.fill(email);
          if (emailIndex === 1) {
            await emailInput.locator(plusSpanSelector).click();
          }
        }
      } else {
        // value is string
        const unknownEmailButton: Locator = page.locator('label[formcontrolname="conoceEmail"]');
        await unknownEmailButton.click();
        const textareaReason = page.locator('textarea[formcontrolname="razonDesconoceEmail"]');
        await textareaReason.fill(emailsOrReason);
      }
      let webPageIndex: number = 0;
      for (const webPage of webPages) {
        webPageIndex++;
        const webPageInput: Locator = page.locator(`[formcontrolname="paginaWeb${webPageIndex}"]`);
        await webPageInput.fill(webPage);
        if (webPageIndex === 1) {
          await webPageInput.locator(plusSpanSelector).click();
        }
      }

      const merchantNzText: string = 'Seleccione el tipo de persona natural:';
      const merchantNzFormItem: Locator = page.locator('nz-form-item', { hasText: merchantNzText });
      const merchantText: string = `${debtor.isMerchant ? '' : 'NO '}Comerciante`;
      const merchantRadio: Locator = merchantNzFormItem.locator('label', { hasText: merchantText });
      await merchantRadio.click();

      const hasProceduresNzRadioGroup: Locator = page.locator(
        'nz-radio-group[formcontrolname="tiene_procedimientos"]',
      );
      const hasProceduresLabel: Locator = hasProceduresNzRadioGroup.locator('label', {
        hasText: debtor.hasMultipleDebtCollectionProcedures ? 'Si' : 'No',
      });
      await hasProceduresLabel.click();

      // TODO: Fill up to 3 telephone numbers.
      // TODO: Fill up to 3 cellphone numbers.

      throw new Error('Method not fully implemented.');

      // breakpoint

      await page.waitForTimeout(1000);

      /** 
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

      */
    }
  }
}

export default DebtorSection;
