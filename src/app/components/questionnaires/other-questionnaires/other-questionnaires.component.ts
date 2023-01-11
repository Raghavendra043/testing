import { Component, ElementRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingState } from '@app/types/loading.type';
import { User } from '@app/types/user.type';
import { TranslateService } from '@ngx-translate/core';
import { QuestionnaireGroupsService } from '@services/rest-api-services/questionnaire-groups.service';
import { QuestionnairesService } from '@services/rest-api-services/questionnaires.service';
import { StatePassingService } from '@services/state-services/state-passing.service';
import { Utils } from '@services/util-services/util.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-other-questionnaires',
  templateUrl: './other-questionnaires.component.html',
  styleUrls: ['./other-questionnaires.component.less'],
})
export class OtherQuestionnairesComponent implements OnInit {
  model: {
    state: LoadingState;
    questionnaires: any[] | undefined;
  } = {
    state: 'Initial',
    questionnaires: undefined,
  };

  searchQuestionnairesForm: FormGroup = this.formBuilder.group({
    questionnaireGroups: [''],
  });
  questionnaireGroupList: any[] = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'link',
    textField: 'name',
    searchPlaceholderText: this.translate.instant('SEARCH'),
    noDataAvailablePlaceholderText: this.translate.instant('NO_DATA_AVAILABLE'),
    enableCheckAll: false,
    allowSearchFilter: true,
  };

  user: any;
  title: string = '';
  searchText: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private appContext: StatePassingService,
    private translate: TranslateService,
    private questionnaires: QuestionnairesService,
    private questionnaireGroupsService: QuestionnaireGroupsService,
    private router: Router,
    private utils: Utils,
    private translateService: TranslateService,
    private elementRef: ElementRef
  ) {
    this.appContext.requestParams.set('useDefaultAuth', true);
    this.user = this.appContext.currentUser.get()!;
    const patient: User = this.appContext.getUser();
    this.title = `${patient.firstName} ${patient.lastName}`;
    this.searchText = translateService.instant('SEARCH_ALL');
    this.searchQuestionnairesForm
      .get('questionnaireGroups')
      ?.valueChanges.subscribe((value: any) => {
        this.searchText =
          value?.length > 0
            ? this.translateService.instant('SEARCH')
            : this.translateService.instant('SEARCH_ALL');
      });
  }

  async ngOnInit() {
    await this.renderQuestionnaireGroups();
  }

  async renderQuestionnaireGroups(): Promise<any> {
    const params = { max: 10000 };
    try {
      const response = await this.questionnaireGroupsService.list(params);
      const questionnaireGroupList = response.results;
      const groupList = [];
      for (const questionnaireGroup of questionnaireGroupList) {
        groupList.push({
          name: questionnaireGroup.name,
          link: questionnaireGroup.links.questionnaireGroup,
        });
      }
      this.questionnaireGroupList = groupList;
    } catch (e) {
      this.model.state = 'Failed';
      console.error(`Failed to fetch questionnaireGroups due to error: ${e}`);
    }
  }

  async search() {
    this.model.state = 'Loading';
    this.model.questionnaires = [];
    const params = { max: 10000 };
    const questionnaireGroups =
      this.searchQuestionnairesForm.value.questionnaireGroups;
    try {
      if (questionnaireGroups?.length > 0) {
        let questionnaires: any[] = [];
        for (const group of questionnaireGroups) {
          const response =
            await this.questionnaireGroupsService.getQuestionnaires(
              group.link,
              params
            );
          questionnaires = questionnaires.concat(response);
        }
        this.model.questionnaires = questionnaires;
      } else {
        const response: any = await this.questionnaires.list(this.user, params);
        this.model.questionnaires = response.results;
      }
      this.model.state = 'Loaded';
    } catch (e) {
      this.model.state = 'Failed';
      console.error(`Failed to fetch questionnaires due to error: ${e}`);
    }
  }

  async chooseQuestionnaire(questionnaireRef: any) {
    questionnaireRef.marked = false;
    this.appContext.requestParams.set(
      'selectedQuestionnaire',
      questionnaireRef
    );
    const selected = this.utils.urlToId(questionnaireRef.links.questionnaire);
    this.appContext.requestParams.set('questionnaireId', selected);
    this.router.navigate(['questionnaires', selected, 'questionnaire']);
  }

  closeMultiselect() {
    this.elementRef.nativeElement
      .querySelector('#questionnaire-groups-label')
      .click();
  }

  get questionnaireGroups(): FormControl {
    return this.searchQuestionnairesForm.get(
      'questionnaireGroups'
    ) as FormControl;
  }
}
