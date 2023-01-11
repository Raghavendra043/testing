import { Component, Input, ApplicationRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DeviceNodeParserService } from 'src/app/services/parser-services/device-node-parser.service';
import {
  NodeComponent,
  ComponentParameters,
  NodeTypeName,
} from 'src/app/types/nodes.type';
import { QuestionnaireScope } from 'src/app/types/model.type';
import {
  AutomaticFormInput,
  AutomaticDeviceNodeParserType,
  NodeModel,
  NodeMap,
  MeasurementNode,
  SpirometerNodeModel,
  Representation,
} from 'src/app/types/parser.type';
import { meterTypes } from 'src/app/types/meter.type';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-automatic-device-node',
  templateUrl: './automatic-device-node.component.html',
  styleUrls: ['./automatic-device-node.component.less'],
})
export class AutomaticDeviceNodeComponent implements NodeComponent {
  @Input() node!: MeasurementNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  //Form
  inputs: AutomaticFormInput[] = [];
  nodeForm: FormGroup = this.formBuilder.group({
    inputControls: this.formBuilder.array([]),
  });
  nodeModel: NodeModel | undefined = undefined;

  // Error
  error: string | undefined = undefined;
  errorTitle: string | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private deviceNodeParserService: DeviceNodeParserService,
    private translate: TranslateService,
    private applicationRef: ApplicationRef
  ) {}

  private isSpirometerNodeModel(
    nodeModel: NodeModel
  ): nodeModel is SpirometerNodeModel {
    const spiNodeModel = nodeModel as SpirometerNodeModel;
    return (
      spiNodeModel.fev1 !== undefined &&
      spiNodeModel.fev6 !== undefined &&
      spiNodeModel.fef2575 !== undefined &&
      spiNodeModel.fev1Fev6Ratio !== undefined
    );
  }

  getRepresentation = (): Representation => {
    const nodeParserType: AutomaticDeviceNodeParserType | undefined =
      this.deviceNodeParserTypes.find(
        (obj: AutomaticDeviceNodeParserType) =>
          obj.nodeTypeName === this.parameters.nodeTypeName
      );

    if (nodeParserType === undefined) {
      this.errorTitle = this.translate.instant('UNSUPPORTED_DEVICE');
      this.error = this.parameters.nodeTypeName;

      throw new Error(
        `Could not find AutomaticDeviceNodeParser for ${this.parameters.nodeTypeName}!`
      );
    }

    const deviceNodeType = nodeParserType.deviceNodeType;
    const parseDeviceNode = this.deviceNodeParserService.create(deviceNodeType);

    const representation = parseDeviceNode(this.node);
    this.nodeModel = representation.nodeModel;

    this.nodeModel.setValue = (key: string, value: any): void => {
      // Bit of a hack we have to use in order to trigger the re-rendering and
      // re-validation of the questionnaire form upon receiving a
      // status/measurement from the native layer.
      if (this.nodeModel !== undefined) {
        this.nodeModel[key] = value;
        this.applicationRef.tick();
      }
    };

    for (const formInput of nodeParserType.formInputs) {
      this.inputs.push(formInput);
      this.inputControls.push(
        this.formBuilder.control(
          { value: '', disabled: true },
          Validators.required
        )
      );
    }

    return representation;
  };

  onSubmit() {
    console.log('automatic-device-node.component.ts->onSubmit');
    console.log(this.nodeForm.value);
  }

  get inputControls() {
    return this.nodeForm.get('inputControls') as FormArray;
  }

  deviceNodeParserTypes: AutomaticDeviceNodeParserType[] = [
    {
      nodeTypeName: NodeTypeName.ACTIVITY_DEVICE_NODE,
      deviceNodeType: {
        meterType: meterTypes.ACTIVITY_TRACKER,
        outputMapper: (measurements, _nodeModel) => measurements,
      },

      formInputs: [
        { translationId: 'DAILY_STEPS', key: 'dailySteps' },
        {
          translationId: 'DAILY_STEPS_WEEKLY_AVERAGE',
          key: 'dailyStepsWeeklyAverage',
        },
      ],
    },
    {
      nodeTypeName: NodeTypeName.BLOOD_PRESSURE_DEVICE_NODE,
      deviceNodeType: {
        meterType: meterTypes.BLOOD_PRESSURE_MONITOR,
        infoText: 'BLOOD_PRESSURE_CONNECT',
        outputMapper: (measurements, _nodeModel) => measurements,
      },
      formInputs: [
        { translationId: 'BLOOD_PRESSURE_SYSTOLIC', key: 'systolic' },
        { translationId: 'BLOOD_PRESSURE_DIASTOLIC', key: 'diastolic' },
        { translationId: 'BLOOD_PRESSURE_PULSE', key: 'pulse' },
      ],
    },
    {
      nodeTypeName: NodeTypeName.BLOOD_SUGAR_DEVICE_NODE,
      deviceNodeType: {
        meterType: meterTypes.GLUCOMETER,
        outputMapper: (measurements, _nodeModel) => measurements,
      },
      formInputs: [],
    },
    {
      nodeTypeName: NodeTypeName.SATURATION_DEVICE_NODE,
      deviceNodeType: {
        meterType: meterTypes.OXIMETER,
        outputMapper: (measurements, _nodeModel) => measurements,
      },
      formInputs: [
        { translationId: 'SATURATION_SATURATION', key: 'saturation' },
        {
          translationId: 'SATURATION_PULSE',
          key: 'pulse',
        },
      ],
    },
    {
      nodeTypeName: NodeTypeName.SATURATION_WITHOUT_PULSE_DEVICE_NODE,
      deviceNodeType: {
        meterType: meterTypes.OXIMETER,
        outputMapper: (measurements, _nodeModel) => measurements,
      },
      formInputs: [
        { translationId: 'SATURATION_SATURATION', key: 'saturation' },
      ],
    },

    {
      nodeTypeName: NodeTypeName.SPIROMETER_DEVICE_NODE,
      deviceNodeType: {
        meterType: meterTypes.SPIROMETER,
        outputMapper: (_measurements, nodeModel: NodeModel) => {
          if (this.isSpirometerNodeModel(nodeModel)) {
            nodeModel.fef2575 = nodeModel['fef25-75%'];
            nodeModel.fev1Fev6Ratio = nodeModel['fev1/fev6'];
            return ['fev1', 'fev6', 'fev1Fev6Ratio', 'fef2575', 'origin'];
          } else {
            return [];
          }
        },
      },
      formInputs: [
        { translationId: 'SPIROMETER_FEV1', key: 'fev1' },
        { translationId: 'SPIROMETER_FEV6', key: 'fev6' },
        { translationId: 'SPIROMETER_FEV1_FEV6_RATIO', key: 'fev1/fev6' },
        { translationId: 'SPIROMETER_FEF25_75', key: 'fef25-75%' },
      ],
    },
    {
      nodeTypeName: NodeTypeName.TEMPERATURE_DEVICE_NODE,
      deviceNodeType: {
        meterType: meterTypes.THERMOMETER,
        outputMapper: (measurements, _nodeModel) => measurements,
      },
      formInputs: [{ translationId: 'TEMPERATURE', key: 'temperature' }],
    },

    {
      nodeTypeName: NodeTypeName.WEIGHT_DEVICE_NODE,
      deviceNodeType: {
        meterType: meterTypes.WEIGHT_SCALE,
        outputMapper: (measurements, _nodeModel) => measurements,
      },
      formInputs: [{ translationId: 'WEIGHT', key: 'weight' }],
    },

    {
      nodeTypeName: NodeTypeName.OXYGEN_FLOW_DEVICE_NODE,
      deviceNodeType: {
        meterType: meterTypes.OXYGEN_FLOW,
        outputMapper: (measurements, _nodeModel) => measurements,
      },
      formInputs: [{ translationId: 'OXYGEN_FLOW', key: 'oxygenFlow' }],
    },
  ];
}
