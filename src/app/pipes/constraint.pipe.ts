import { Pipe, PipeTransform } from '@angular/core';
import { BloodSugarConstraint } from '@app/types/model.type';
import { graphColors } from 'src/app/product-flavor/colors';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'constraintColor' })
export class ConstraintColorPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null, constraint: BloodSugarConstraint): SafeHtml {
    let color: string;

    switch (constraint) {
      case BloodSugarConstraint.IS_BEFORE_MEAL:
        color = graphColors[0];
        break;

      case BloodSugarConstraint.IS_AFTER_MEAL:
        color = graphColors[1];
        break;

      case BloodSugarConstraint.IS_FASTING:
        color = graphColors[2];
        break;

      default:
        color = graphColors[3];
        break;
    }

    const html = `<span style="color: ${color}">${value}</span>`;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

@Pipe({ name: 'constraintText' })
export class ConstraintTextPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(constraint: BloodSugarConstraint | undefined): string {
    let text: string;

    switch (constraint) {
      case BloodSugarConstraint.IS_BEFORE_MEAL:
        text = this.translate.instant('BEFORE_MEAL');
        break;

      case BloodSugarConstraint.IS_AFTER_MEAL:
        text = this.translate.instant('AFTER_MEAL');
        break;

      case BloodSugarConstraint.IS_FASTING:
        text = this.translate.instant('FASTING');
        break;

      default:
        text = '';
        break;
    }

    return text;
  }
}
