import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.less"],
})
export class TimerComponent implements OnChanges, OnDestroy {
  @Input() count: any = undefined;
  @Input() countUp: any = undefined;
  @Input() countTime: any = undefined;
  @Input() onTimerStopped: any = undefined;
  @Output() timerStoppedChange = new EventEmitter();
  constructor(private translate: TranslateService) {}
  interval = 1000;
  stopTicking: any = undefined;
  stopWatching: any = undefined;
  timerDescription: any = undefined;

  stopTimer = () => {
    this.count = this.countUp === true ? 0 : this.countTime;

    if (this.stopTicking) {
      clearInterval(this.stopTicking);
      this.stopTicking = undefined;
    }
  };

  nextNode = () => {
    this.stopTimer();
    this.timerStoppedChange.emit(undefined);
  };

  updateDescription = () => {
    let descriptionLeft = this.translate.instant(
      "DELAY_NODE_DESCRIPTION_LEFT_DOWN"
    );

    const descriptionCenter = this.translate.instant(
      "DELAY_NODE_DESCRIPTION_CENTER"
    );

    const descriptionRight = this.translate.instant(
      "DELAY_NODE_DESCRIPTION_RIGHT"
    );

    if (this.countUp === true) {
      descriptionLeft = this.translate.instant(
        "DELAY_NODE_DESCRIPTION_LEFT_UP"
      );
    }

    this.timerDescription =
      descriptionLeft +
      " " +
      this.count +
      " " +
      descriptionCenter +
      " " +
      this.countTime +
      " " +
      descriptionRight;
  };

  tick = () => {
    if (this.countUp === true) {
      this.count++;
      this.updateDescription();

      if (this.count >= this.countTime) {
        return this.nextNode();
      }
    } else {
      this.count--;
      this.updateDescription();

      if (this.count <= 0) {
        return this.nextNode();
      }
    }

    return undefined;
  };

  ngOnChanges(changes: any) {
    if (changes.count.currentValue === undefined) {
      this.stopTimer();
      this.stopWatching();
    }

    this.updateDescription();

    const wrapTick = () => this.tick();
    this.stopTicking = setInterval(wrapTick, this.interval, this.countTime);
  }

  ngOnDestroy() {
    console.debug('Timer component onDestroy');
    if (this.stopTicking) {
      clearInterval(this.stopTicking);
      this.stopTicking = undefined;
    }
  }
}
