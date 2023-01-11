import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '@services/util-services/util.service';
import {
  InputReply,
  Measurement,
  MeasurementsReply,
  MeasurementValue,
  Reply,
  SimpleValue,
} from '../types/questionnaire-results.type';

@Directive({
  selector: '[prettyReply]',
})
export class PrettyReplyDirective implements OnInit {
  @Input() reply: any;

  constructor(
    private translate: TranslateService,
    private utils: Utils,
    private sanitizer: DomSanitizer,
    private element: ElementRef
  ) {}

  ngOnInit() {
    if (this.reply) {
      this.element.nativeElement.innerHTML = this.generateHtml(this.reply);
    }
  }

  private wrapInSpan(html: number | string): string {
    return `<span class="reply-table-value">${html}</span>`;
  }

  private sanitize(value: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, value) ?? '';
  }

  handleInputReply(reply: InputReply): string {
    if (this.utils.exists(reply.patientAnswer)) {
      return this.wrapInSpan(this.sanitize(reply.patientAnswer));
    }
    if (typeof reply.answer === 'boolean') {
      const answer = reply.answer
        ? this.translate.instant('YES')
        : this.translate.instant('NO');
      return this.wrapInSpan(this.sanitize(answer));
    }
    return this.wrapInSpan(this.sanitize(String(reply.answer)));
  }

  handleOmittedReply() {
    return this.wrapInSpan(this.translate.instant('OMITTED'));
  }

  static toDecimals(value: number, decimals: number): string {
    return (Math.round(value * 100) / 100).toFixed(decimals);
  }

  handleMeasurementsReply = (reply: MeasurementsReply) =>
    reply.measurements
      .filter((measurementObj: Measurement) =>
        this.utils.exists(measurementObj.measurement)
      )
      .map((measurementObj: Measurement) => {
        const measurementValue: MeasurementValue = measurementObj.measurement;

        const prettyType = `${this.translate.instant(
          `MEASUREMENT_TYPE_${measurementObj.type.toUpperCase()}`
        )}:`;

        let prettyUnit: string =
          measurementValue.unit !== '-' ? measurementValue.unit : '';
        let prettyValue = '';
        let prettyExtra = '';

        switch (measurementObj.type) {
          case 'copd_prediction':
            return '';

          case 'blood_pressure':
            if ('systolic' in measurementValue) {
              prettyValue = `${measurementValue.systolic}/${measurementValue.diastolic}`;
            }
            break;

          case 'bloodsugar':
          case 'bloodsugar_mg_dl':
            if ('isAfterMeal' in measurementValue) {
              prettyValue = PrettyReplyDirective.toDecimals(
                measurementValue.value,
                1
              );

              if (measurementValue.isAfterMeal === true) {
                prettyExtra = `<br/>(${this.translate.instant('AFTER_MEAL')})`;
              }
              if (measurementValue.isBeforeMeal === true) {
                prettyExtra = `<br/>(${this.translate.instant('BEFORE_MEAL')})`;
              }
              if (measurementValue.isFasting === true) {
                prettyExtra = `<br/>(${this.translate.instant('FASTING')})`;
              }
            }
            break;

          case 'ecg':
            prettyValue = '-';
            prettyUnit = '';
            break;

          default:
            if ('value' in measurementValue) {
              const simpleValue: SimpleValue = measurementValue;
              prettyValue = `${simpleValue.value}`;
            } else {
              prettyValue = this.translate.instant('NO_VALUE');
              prettyUnit = '';
            }
            break;
        }
        return `${prettyType} ${prettyValue} ${prettyUnit} ${prettyExtra}`.trim();
      })
      .join('<br/>');

  generateHtml(input: Reply): string {
    if (!this.utils.exists(input)) {
      return this.wrapInSpan('');
    } else if ('omitted' in input) {
      return this.handleOmittedReply();
    } else if ('answer' in input) {
      return this.handleInputReply(input);
    } else if ('measurements' in input) {
      return this.handleMeasurementsReply(input);
    } else {
      return this.wrapInSpan('-');
    }
  }
}
