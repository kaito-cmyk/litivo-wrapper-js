// TODO: Check if this can be placed into SectionBase instead of being a helper
function getInputSelector(id: string): string {
  return `nz-select[formcontrolname="${id}"] input`;
}
function getDateInputSelector(id: string): string {
  return `nz-date-picker[formcontrolname="${id}"] input`;
}

export { getDateInputSelector, getInputSelector };
