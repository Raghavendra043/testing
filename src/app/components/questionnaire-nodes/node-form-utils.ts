import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { NodeModel } from '@app/types/parser.type';

export const floatRegex = '([0-9]*[.,])?[0-9]+';
export const positiveIntegerRegex = '[0-9]+';

export function isInteger(control: AbstractControl): ValidationErrors | null {
  const value = control.value === '' ? undefined : Number(control.value);
  if (exists(value) && Number.isInteger(value)) {
    return null;
  } else {
    return {
      must_be_integer: `${value} is not an Integer`,
    };
  }
}

export function exists<T>(obj: T | null | undefined): obj is T {
  return typeof obj !== 'undefined' && obj !== null;
}

export function stringToNumber(string: string) {
  const value = string === '' ? undefined : Number(string);
  return value ? value : undefined;
}

export function getAllFormValues(nodeForm: FormGroup): object {
  const object: object = {};
  for (const field in nodeForm.controls) {
    object[field] = nodeForm.controls[field].value;
  }
  return object;
}

export function getAllFormFields(nodeForm: FormGroup) {
  const list: string[] = [];
  for (const field in nodeForm.controls) {
    list.push(field);
  }
  return list;
}
