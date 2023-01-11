import { Pipe, PipeTransform } from '@angular/core';
import { Severity } from '@app/types/questionnaire-results.type';

@Pipe({ name: 'severity' })
export class SeverityPipe implements PipeTransform {
  transform(severity: Severity | undefined, showSeverity = true) {
    return severity && showSeverity ? `severity-${severity}` : 'severity-none';
  }
}
