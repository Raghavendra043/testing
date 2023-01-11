import { Component, OnInit } from '@angular/core';
import { AcknowledgementsService } from 'src/app/services/rest-api-services/acknowledgements.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { Acknowledgement } from 'src/app/types/acknowledgements.type';
import { TranslateService } from '@ngx-translate/core';
import { LoadingState } from '@app/types/loading.type';
import { User } from '@app/types/user.type';
import moment from 'moment';

@Component({
  selector: 'app-acknowledgements',
  templateUrl: './acknowledgements.component.html',
  styleUrls: ['./acknowledgements.component.less'],
})
export class AcknowledgementsComponent implements OnInit {
  model: {
    state: LoadingState;
    acknowledgements: Acknowledgement[];
  } = {
    state: 'Loading',
    acknowledgements: [],
  };
  user: User;

  constructor(
    private appContext: StatePassingService,
    private acknowledgements: AcknowledgementsService,
    private translateService: TranslateService
  ) {
    this.user = this.appContext.getUser();
  }

  async ngOnInit() {
    try {
      const acknowledgements = await this.acknowledgements.list(this.user);
      acknowledgements.map(this.formatTexts);
      this.model.state = 'Loaded';
      this.model.acknowledgements = acknowledgements;
    } catch (e) {
      this.model.state = 'Failed';
      console.error(`Failed to load acknowledgements due to error: ${e}`);
    }
  }

  private formatTexts = (acknowledgement: Acknowledgement): void => {
    const uploadDate: string = moment(acknowledgement.uploadTimestamp).format(
      'LL'
    );
    const uploadTime: string = moment(acknowledgement.uploadTimestamp).format(
      'LT'
    );
    const ackDate: string = moment(
      acknowledgement.acknowledgementTimestamp
    ).format('LL');
    const ackTime: string = moment(
      acknowledgement.acknowledgementTimestamp
    ).format('LT');

    switch (acknowledgement.type) {
      case 'questionnaire':
        acknowledgement.message = this.translateService
          .instant('ACKNOWLEDGEMENTS_COMPLETED_QUESTIONNAIRE')
          .replace('{0}', acknowledgement.name)
          .replace('{1}', uploadDate)
          .replace('{2}', uploadTime)
          .replace('{3}', ackDate)
          .replace('{4}', ackTime);
        break;

      case 'externalMeasurement':
        acknowledgement.message = this.translateService
          .instant('ACKNOWLEDGEMENTS_EXTERNAL_MEASUREMENT')
          .replace('{0}', uploadDate)
          .replace('{1}', uploadTime)
          .replace('{2}', ackDate)
          .replace('{3}', ackTime);
        break;
    }
  };
}
