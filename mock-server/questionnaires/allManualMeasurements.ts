export const getAllManualMeasurements = (baseUrl: any) => {
  return {
    name: 'All manual measurements',
    version: '1.0',
    startNode: '160',
    endNode: '144',
    nodes: [
      {
        HeightManualDeviceNode: {
          nodeName: '157',
          next: 'ANSEV_163_D157',
          nextFail: 'AN_157_CANCEL',
          text: 'Height',
          origin: {
            name: '157.HEIGHT#ORIGIN',
            type: 'Object',
          },
          height: {
            name: '157.HEIGHT',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_157_CANCEL',
          next: 'ANSEV_163_F157',
          variable: {
            name: '157.HEIGHT##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_163_F157',
          next: '163',
          variable: {
            name: '157.HEIGHT##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_163_D157',
          next: '163',
          variable: {
            name: '157.HEIGHT##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        BodyCellMassManualDeviceNode: {
          nodeName: '152',
          next: 'ANSEV_154_D152',
          nextFail: 'AN_152_CANCEL',
          text: 'Body cell mass',
          origin: {
            name: '152.BODY_CELL_MASS#ORIGIN',
            type: 'Object',
          },
          bodyCellMass: {
            name: '152.BODY_CELL_MASS',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_152_CANCEL',
          next: 'ANSEV_154_F152',
          variable: {
            name: '152.BODY_CELL_MASS##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_154_F152',
          next: '154',
          variable: {
            name: '152.BODY_CELL_MASS##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_154_D152',
          next: '154',
          variable: {
            name: '152.BODY_CELL_MASS##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        RespiratoryRateManualDeviceNode: {
          nodeName: '145',
          next: 'ANSEV_146_D145',
          nextFail: 'AN_145_CANCEL',
          text: 'Respiratory rate',
          origin: {
            name: '145.RESPIRATORY_RATE#ORIGIN',
            type: 'Object',
          },
          respiratoryRate: {
            name: '145.RESPIRATORY_RATE',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_145_CANCEL',
          next: 'ANSEV_146_F145',
          variable: {
            name: '145.RESPIRATORY_RATE##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_146_F145',
          next: '146',
          variable: {
            name: '145.RESPIRATORY_RATE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_146_D145',
          next: '146',
          variable: {
            name: '145.RESPIRATORY_RATE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        PainScaleManualDeviceNode: {
          nodeName: '164',
          next: 'ANSEV_165_D164',
          nextFail: 'AN_164_CANCEL',
          text: 'Pain scale',
          origin: {
            name: '164.PAIN_SCALE#ORIGIN',
            type: 'Object',
          },
          painScale: {
            name: '164.PAIN_SCALE',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_164_CANCEL',
          next: 'ANSEV_165_F164',
          variable: {
            name: '164.PAIN_SCALE##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_165_F164',
          next: '165',
          variable: {
            name: '164.PAIN_SCALE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_165_D164',
          next: '165',
          variable: {
            name: '164.PAIN_SCALE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        GlucoseUrineManualDeviceNode: {
          nodeName: '156',
          next: 'ANSEV_157_D156',
          nextFail: 'AN_156_CANCEL',
          text: 'Glucose in urine',
          origin: {
            name: '156.GLUCOSE_URINE#ORIGIN',
            type: 'Object',
          },
          glucoseUrine: {
            name: '156.GLUCOSE_URINE',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_156_CANCEL',
          next: 'ANSEV_157_F156',
          variable: {
            name: '156.GLUCOSE_URINE##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_157_F156',
          next: '157',
          variable: {
            name: '156.GLUCOSE_URINE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_157_D156',
          next: '157',
          variable: {
            name: '156.GLUCOSE_URINE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        BloodUrineManualDeviceNode: {
          nodeName: '161',
          next: 'ANSEV_162_D161',
          nextFail: 'AN_161_CANCEL',
          text: 'Blood in urine',
          origin: {
            name: '161.BLOOD_URINE#ORIGIN',
            type: 'Object',
          },
          bloodUrine: {
            name: '161.BLOOD_URINE',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_161_CANCEL',
          next: 'ANSEV_162_F161',
          variable: {
            name: '161.BLOOD_URINE##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_162_F161',
          next: '162',
          variable: {
            name: '161.BLOOD_URINE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_162_D161',
          next: '162',
          variable: {
            name: '161.BLOOD_URINE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        LeukocytesUrineManualDeviceNode: {
          nodeName: '166',
          next: 'ANSEV_167_D166',
          nextFail: 'AN_166_CANCEL',
          text: 'Leukocytes in urine',
          origin: {
            name: '166.LEUKOCYTES_URINE#ORIGIN',
            type: 'Object',
          },
          leukocytesUrine: {
            name: '166.LEUKOCYTES_URINE',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_166_CANCEL',
          next: 'ANSEV_167_F166',
          variable: {
            name: '166.LEUKOCYTES_URINE##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_167_F166',
          next: '167',
          variable: {
            name: '166.LEUKOCYTES_URINE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_167_D166',
          next: '167',
          variable: {
            name: '166.LEUKOCYTES_URINE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        TemperatureManualDeviceNode: {
          nodeName: '158',
          next: 'ANSEV_159_D158',
          nextFail: 'AN_158_CANCEL',
          text: 'Temperature',
          origin: {
            name: '158.TEMPERATURE#ORIGIN',
            type: 'Object',
          },
          temperature: {
            name: '158.TEMPERATURE',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_158_CANCEL',
          next: 'ANSEV_159_F158',
          variable: {
            name: '158.TEMPERATURE##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_159_F158',
          next: '159',
          variable: {
            name: '158.TEMPERATURE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_159_D158',
          next: '159',
          variable: {
            name: '158.TEMPERATURE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        FatMassManualDeviceNode: {
          nodeName: '155',
          next: 'ANSEV_156_D155',
          nextFail: 'AN_155_CANCEL',
          text: 'Fat mass',
          origin: {
            name: '155.FAT_MASS#ORIGIN',
            type: 'Object',
          },
          fatMass: {
            name: '155.FAT_MASS',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_155_CANCEL',
          next: 'ANSEV_156_F155',
          variable: {
            name: '155.FAT_MASS##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_156_F155',
          next: '156',
          variable: {
            name: '155.FAT_MASS##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_156_D155',
          next: '156',
          variable: {
            name: '155.FAT_MASS##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        SaturationWithoutPulseManualDeviceNode: {
          nodeName: '149',
          next: 'ANSEV_151_D149',
          nextFail: 'AN_149_CANCEL',
          text: 'Saturation without pulse',
          origin: {
            name: '149.SAT#ORIGIN',
            type: 'Object',
          },
          saturation: {
            name: '149.SAT#SATURATION',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_149_CANCEL',
          next: 'ANSEV_151_F149',
          variable: {
            name: '149.SAT##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_151_F149',
          next: '151',
          variable: {
            name: '149.SAT##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_151_D149',
          next: '151',
          variable: {
            name: '149.SAT##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        HemoglobinManualDeviceNode: {
          nodeName: '163',
          next: 'ANSEV_166_D163',
          nextFail: 'AN_163_CANCEL',
          text: 'Hemoglobin',
          origin: {
            name: '163.HEMOGLOBIN#ORIGIN',
            type: 'Object',
          },
          hemoglobin: {
            name: '163.HEMOGLOBIN',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_163_CANCEL',
          next: 'ANSEV_166_F163',
          variable: {
            name: '163.HEMOGLOBIN##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_166_F163',
          next: '166',
          variable: {
            name: '163.HEMOGLOBIN##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_166_D163',
          next: '166',
          variable: {
            name: '163.HEMOGLOBIN##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        ActivityManualDeviceNode: {
          nodeName: '160',
          next: 'ANSEV_161_D160',
          nextFail: 'AN_160_CANCEL',
          text: 'Activity',
          origin: {
            name: '160.ACTIVITY#ORIGIN',
            type: 'Object',
          },
          dailySteps: {
            name: '160.ACTIVITY#DAILY_STEPS',
            type: 'Integer',
          },
          dailyStepsWeeklyAverage: {
            name: '160.ACTIVITY#DAILY_STEPS_WEEKLY_AVERAGE',
            type: 'Integer',
          },
          dailyStepsHistoricalMeasurements: {
            name: '160.ACTIVITY#DAILY_STEPS_HISTORICAL_MEASUREMENTS',
            type: 'Object[]',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_160_CANCEL',
          next: 'ANSEV_161_F160',
          variable: {
            name: '160.ACTIVITY##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_161_F160',
          next: '161',
          variable: {
            name: '160.ACTIVITY##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_161_D160',
          next: '161',
          variable: {
            name: '160.ACTIVITY##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        NitriteUrineManualDeviceNode: {
          nodeName: '167',
          next: 'ANSEV_164_D167',
          nextFail: 'AN_167_CANCEL',
          text: 'Nitrite in urine',
          origin: {
            name: '167.NITRITE_URINE#ORIGIN',
            type: 'Object',
          },
          nitriteUrine: {
            name: '167.NITRITE_URINE',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_167_CANCEL',
          next: 'ANSEV_164_F167',
          variable: {
            name: '167.NITRITE_URINE##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_164_F167',
          next: '164',
          variable: {
            name: '167.NITRITE_URINE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_164_D167',
          next: '164',
          variable: {
            name: '167.NITRITE_URINE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        PhaseAngleManualDeviceNode: {
          nodeName: '147',
          next: 'ANSEV_148_D147',
          nextFail: 'AN_147_CANCEL',
          text: 'Phase angle',
          origin: {
            name: '147.PHASE_ANGLE#ORIGIN',
            type: 'Object',
          },
          phaseAngle: {
            name: '147.PHASE_ANGLE',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_147_CANCEL',
          next: 'ANSEV_148_F147',
          variable: {
            name: '147.PHASE_ANGLE##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_148_F147',
          next: '148',
          variable: {
            name: '147.PHASE_ANGLE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_148_D147',
          next: '148',
          variable: {
            name: '147.PHASE_ANGLE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        BloodSugarManualDeviceNode: {
          nodeName: '150',
          next: 'ANSEV_152_D150',
          nextFail: 'AN_150_CANCEL',
          text: 'Blood sugar',
          origin: {
            name: '150.BS#ORIGIN',
            type: 'Object',
          },
          bloodSugarMeasurements: {
            name: '150.BS#BLOODSUGARMEASUREMENTS',
            type: 'Object[]',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_150_CANCEL',
          next: 'ANSEV_152_F150',
          variable: {
            name: '150.BS##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_152_F150',
          next: '152',
          variable: {
            name: '150.BS##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_152_D150',
          next: '152',
          variable: {
            name: '150.BS##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        PeakFlowManualDeviceNode: {
          nodeName: '165',
          next: 'ANSEV_147_D165',
          nextFail: 'AN_165_CANCEL',
          text: 'Peak flow',
          origin: {
            name: '165.PEAK_FLOW#ORIGIN',
            type: 'Object',
          },
          peakFlow: {
            name: '165.PEAK_FLOW',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_165_CANCEL',
          next: 'ANSEV_147_F165',
          variable: {
            name: '165.PEAK_FLOW##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_147_F165',
          next: '147',
          variable: {
            name: '165.PEAK_FLOW##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_147_D165',
          next: '147',
          variable: {
            name: '165.PEAK_FLOW##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        SitToStandManualDeviceNode: {
          nodeName: '151',
          next: 'ANSEV_153_D151',
          nextFail: 'AN_151_CANCEL',
          text: 'Sit to stand',
          origin: {
            name: '151.SIT_TO_STAND#ORIGIN',
            type: 'Object',
          },
          sitToStand: {
            name: '151.SIT_TO_STAND',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_151_CANCEL',
          next: 'ANSEV_153_F151',
          variable: {
            name: '151.SIT_TO_STAND##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_153_F151',
          next: '153',
          variable: {
            name: '151.SIT_TO_STAND##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_153_D151',
          next: '153',
          variable: {
            name: '151.SIT_TO_STAND##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        UrineManualDeviceNode: {
          nodeName: '148',
          next: 'ANSEV_145_D148',
          nextFail: 'AN_148_CANCEL',
          text: 'Urine',
          origin: {
            name: '148.URINE#ORIGIN',
            type: 'Object',
          },
          urine: {
            name: '148.URINE',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_148_CANCEL',
          next: 'ANSEV_145_F148',
          variable: {
            name: '148.URINE##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_145_F148',
          next: '145',
          variable: {
            name: '148.URINE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_145_D148',
          next: '145',
          variable: {
            name: '148.URINE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        BloodPressureManualDeviceNode: {
          nodeName: '162',
          next: 'ANSEV_150_D162',
          nextFail: 'AN_162_CANCEL',
          text: 'Blood pressure',
          origin: {
            name: '162.BP#ORIGIN',
            type: 'Object',
          },
          systolic: {
            name: '162.BP#SYSTOLIC',
            type: 'Integer',
          },
          diastolic: {
            name: '162.BP#DIASTOLIC',
            type: 'Integer',
          },
          meanArterialPressure: {
            name: '162.BP#MEAN_ARTERIAL_PRESSURE',
            type: 'Integer',
          },
          pulse: {
            name: '162.BP#PULSE',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_162_CANCEL',
          next: 'ANSEV_150_F162',
          variable: {
            name: '162.BP##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_150_F162',
          next: '150',
          variable: {
            name: '162.BP##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_150_D162',
          next: '150',
          variable: {
            name: '162.BP##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        CRPManualDeviceNode: {
          nodeName: '154',
          next: 'ANSEV_155_D154',
          nextFail: 'AN_154_CANCEL',
          text: 'CRP',
          origin: {
            name: '154.CRP#ORIGIN',
            type: 'Object',
          },
          CRP: {
            name: '154.CRP',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_154_CANCEL',
          next: 'ANSEV_155_F154',
          variable: {
            name: '154.CRP##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_155_F154',
          next: '155',
          variable: {
            name: '154.CRP##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_155_D154',
          next: '155',
          variable: {
            name: '154.CRP##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        EndNode: {
          nodeName: '144',
        },
      },
      {
        SaturationManualDeviceNode: {
          nodeName: '146',
          next: 'ANSEV_149_D146',
          nextFail: 'AN_146_CANCEL',
          text: 'Saturation',
          origin: {
            name: '146.SAT#ORIGIN',
            type: 'Object',
          },
          saturation: {
            name: '146.SAT#SATURATION',
            type: 'Integer',
          },
          pulse: {
            name: '146.SAT#PULSE',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_146_CANCEL',
          next: 'ANSEV_149_F146',
          variable: {
            name: '146.SAT##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_149_F146',
          next: '149',
          variable: {
            name: '146.SAT##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_149_D146',
          next: '149',
          variable: {
            name: '146.SAT##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        WeightManualDeviceNode: {
          nodeName: '159',
          next: 'ANSEV_144_D159',
          nextFail: 'AN_159_CANCEL',
          text: 'Weight',
          origin: {
            name: '159.WEIGHT#ORIGIN',
            type: 'Object',
          },
          weight: {
            name: '159.WEIGHT',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_159_CANCEL',
          next: 'ANSEV_144_F159',
          variable: {
            name: '159.WEIGHT##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_144_F159',
          next: '144',
          variable: {
            name: '159.WEIGHT##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_144_D159',
          next: '144',
          variable: {
            name: '159.WEIGHT##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        SpirometerManualDeviceNode: {
          nodeName: '153',
          next: 'ANSEV_158_D153',
          nextFail: 'AN_153_CANCEL',
          text: 'Spirometry',
          origin: {
            name: '153.SPI#ORIGIN',
            type: 'Object',
          },
          fev1: {
            name: '153.SPI#FEV1',
            type: 'Float',
          },
          fev6: {
            name: '153.SPI#FEV6',
            type: 'Float',
          },
          fev1Fev6Ratio: {
            name: '153.SPI#FEV1_FEV6_RATIO',
            type: 'Integer',
          },
          fef2575: {
            name: '153.SPI#FEF25_75',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_153_CANCEL',
          next: 'ANSEV_158_F153',
          variable: {
            name: '153.SPI##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_158_F153',
          next: '158',
          variable: {
            name: '153.SPI##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_158_D153',
          next: '158',
          variable: {
            name: '153.SPI##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
    ],
    output: [
      {
        name: '147.PHASE_ANGLE#ORIGIN',
        type: 'Object',
      },
      {
        name: '150.BS##SEVERITY',
        type: 'String',
      },
      {
        name: '161.BLOOD_URINE#ORIGIN',
        type: 'Object',
      },
      {
        name: '158.TEMPERATURE',
        type: 'Float',
      },
      {
        name: '155.FAT_MASS#ORIGIN',
        type: 'Object',
      },
      {
        name: '146.SAT#PULSE',
        type: 'Integer',
      },
      {
        name: '146.SAT#SATURATION',
        type: 'Integer',
      },
      {
        name: '162.BP#PULSE',
        type: 'Integer',
      },
      {
        name: '160.ACTIVITY#DAILY_STEPS',
        type: 'Integer',
      },
      {
        name: '163.HEMOGLOBIN',
        type: 'Float',
      },
      {
        name: '145.RESPIRATORY_RATE',
        type: 'Integer',
      },
      {
        name: '154.CRP',
        type: 'Integer',
      },
      {
        name: '149.SAT#SATURATION',
        type: 'Integer',
      },
      {
        name: '152.BODY_CELL_MASS',
        type: 'Float',
      },
      {
        name: '161.BLOOD_URINE',
        type: 'Integer',
      },
      {
        name: '157.HEIGHT',
        type: 'Integer',
      },
      {
        name: '165.PEAK_FLOW',
        type: 'Float',
      },
      {
        name: '153.SPI#FEV1_FEV6_RATIO',
        type: 'Integer',
      },
      {
        name: '147.PHASE_ANGLE##CANCEL',
        type: 'Boolean',
      },
      {
        name: '150.BS#ORIGIN',
        type: 'Object',
      },
      {
        name: '163.HEMOGLOBIN#ORIGIN',
        type: 'Object',
      },
      {
        name: '153.SPI#FEF25_75',
        type: 'Float',
      },
      {
        name: '162.BP#DIASTOLIC',
        type: 'Integer',
      },
      {
        name: '158.TEMPERATURE##CANCEL',
        type: 'Boolean',
      },
      {
        name: '147.PHASE_ANGLE##SEVERITY',
        type: 'String',
      },
      {
        name: '149.SAT#ORIGIN',
        type: 'Object',
      },
      {
        name: '152.BODY_CELL_MASS##SEVERITY',
        type: 'String',
      },
      {
        name: '155.FAT_MASS##SEVERITY',
        type: 'String',
      },
      {
        name: '148.URINE#ORIGIN',
        type: 'Object',
      },
      {
        name: '167.NITRITE_URINE#ORIGIN',
        type: 'Object',
      },
      {
        name: '162.BP#SYSTOLIC',
        type: 'Integer',
      },
      {
        name: '167.NITRITE_URINE##SEVERITY',
        type: 'String',
      },
      {
        name: '162.BP#MEAN_ARTERIAL_PRESSURE',
        type: 'Integer',
      },
      {
        name: '151.SIT_TO_STAND#ORIGIN',
        type: 'Object',
      },
      {
        name: '153.SPI##CANCEL',
        type: 'Boolean',
      },
      {
        name: '160.ACTIVITY##SEVERITY',
        type: 'String',
      },
      {
        name: '156.GLUCOSE_URINE##SEVERITY',
        type: 'String',
      },
      {
        name: '167.NITRITE_URINE##CANCEL',
        type: 'Boolean',
      },
      {
        name: '153.SPI#FEV1',
        type: 'Float',
      },
      {
        name: '153.SPI#FEV6',
        type: 'Float',
      },
      {
        name: '153.SPI##SEVERITY',
        type: 'String',
      },
      {
        name: '154.CRP#ORIGIN',
        type: 'Object',
      },
      {
        name: '145.RESPIRATORY_RATE##SEVERITY',
        type: 'String',
      },
      {
        name: '146.SAT##SEVERITY',
        type: 'String',
      },
      {
        name: '166.LEUKOCYTES_URINE##SEVERITY',
        type: 'String',
      },
      {
        name: '151.SIT_TO_STAND',
        type: 'Integer',
      },
      {
        name: '146.SAT#ORIGIN',
        type: 'Object',
      },
      {
        name: '159.WEIGHT#ORIGIN',
        type: 'Object',
      },
      {
        name: '152.BODY_CELL_MASS##CANCEL',
        type: 'Boolean',
      },
      {
        name: '156.GLUCOSE_URINE#ORIGIN',
        type: 'Object',
      },
      {
        name: '149.SAT##SEVERITY',
        type: 'String',
      },
      {
        name: '162.BP##CANCEL',
        type: 'Boolean',
      },
      {
        name: '146.SAT##CANCEL',
        type: 'Boolean',
      },
      {
        name: '166.LEUKOCYTES_URINE#ORIGIN',
        type: 'Object',
      },
      {
        name: '166.LEUKOCYTES_URINE',
        type: 'Integer',
      },
      {
        name: '164.PAIN_SCALE##CANCEL',
        type: 'Boolean',
      },
      {
        name: '148.URINE##CANCEL',
        type: 'Boolean',
      },
      {
        name: '149.SAT##CANCEL',
        type: 'Boolean',
      },
      {
        name: '160.ACTIVITY#ORIGIN',
        type: 'Object',
      },
      {
        name: '158.TEMPERATURE##SEVERITY',
        type: 'String',
      },
      {
        name: '155.FAT_MASS',
        type: 'Float',
      },
      {
        name: '150.BS#BLOODSUGARMEASUREMENTS',
        type: 'Object[]',
      },
      {
        name: '162.BP#ORIGIN',
        type: 'Object',
      },
      {
        name: '160.ACTIVITY#DAILY_STEPS_WEEKLY_AVERAGE',
        type: 'Integer',
      },
      {
        name: '165.PEAK_FLOW##SEVERITY',
        type: 'String',
      },
      {
        name: '150.BS##CANCEL',
        type: 'Boolean',
      },
      {
        name: '163.HEMOGLOBIN##SEVERITY',
        type: 'String',
      },
      {
        name: '160.ACTIVITY##CANCEL',
        type: 'Boolean',
      },
      {
        name: '162.BP##SEVERITY',
        type: 'String',
      },
      {
        name: '157.HEIGHT##CANCEL',
        type: 'Boolean',
      },
      {
        name: '159.WEIGHT##SEVERITY',
        type: 'String',
      },
      {
        name: '157.HEIGHT##SEVERITY',
        type: 'String',
      },
      {
        name: '167.NITRITE_URINE',
        type: 'Integer',
      },
      {
        name: '154.CRP##CANCEL',
        type: 'Boolean',
      },
      {
        name: '163.HEMOGLOBIN##CANCEL',
        type: 'Boolean',
      },
      {
        name: '164.PAIN_SCALE#ORIGIN',
        type: 'Object',
      },
      {
        name: '164.PAIN_SCALE##SEVERITY',
        type: 'String',
      },
      {
        name: '156.GLUCOSE_URINE',
        type: 'Integer',
      },
      {
        name: '166.LEUKOCYTES_URINE##CANCEL',
        type: 'Boolean',
      },
      {
        name: '148.URINE',
        type: 'Integer',
      },
      {
        name: '160.ACTIVITY#DAILY_STEPS_HISTORICAL_MEASUREMENTS',
        type: 'Object[]',
      },
      {
        name: '151.SIT_TO_STAND##SEVERITY',
        type: 'String',
      },
      {
        name: '145.RESPIRATORY_RATE#ORIGIN',
        type: 'Object',
      },
      {
        name: '147.PHASE_ANGLE',
        type: 'Float',
      },
      {
        name: '155.FAT_MASS##CANCEL',
        type: 'Boolean',
      },
      {
        name: '153.SPI#ORIGIN',
        type: 'Object',
      },
      {
        name: '165.PEAK_FLOW#ORIGIN',
        type: 'Object',
      },
      {
        name: '151.SIT_TO_STAND##CANCEL',
        type: 'Boolean',
      },
      {
        name: '164.PAIN_SCALE',
        type: 'Float',
      },
      {
        name: '156.GLUCOSE_URINE##CANCEL',
        type: 'Boolean',
      },
      {
        name: '161.BLOOD_URINE##SEVERITY',
        type: 'String',
      },
      {
        name: '152.BODY_CELL_MASS#ORIGIN',
        type: 'Object',
      },
      {
        name: '161.BLOOD_URINE##CANCEL',
        type: 'Boolean',
      },
      {
        name: '148.URINE##SEVERITY',
        type: 'String',
      },
      {
        name: '145.RESPIRATORY_RATE##CANCEL',
        type: 'Boolean',
      },
      {
        name: '159.WEIGHT',
        type: 'Float',
      },
      {
        name: '157.HEIGHT#ORIGIN',
        type: 'Object',
      },
      {
        name: '154.CRP##SEVERITY',
        type: 'String',
      },
      {
        name: '159.WEIGHT##CANCEL',
        type: 'Boolean',
      },
      {
        name: '165.PEAK_FLOW##CANCEL',
        type: 'Boolean',
      },
      {
        name: '158.TEMPERATURE#ORIGIN',
        type: 'Object',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/18`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/18/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
