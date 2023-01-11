export const getAllAutomaticMeasurements = (baseUrl: any) => {
  return {
    name: 'All automatic measurements',
    version: '1.0',
    startNode: '200',
    endNode: '192',
    nodes: [
      {
        EcgDeviceNode: {
          nodeName: '195',
          next: 'ANSEV_196_D195',
          nextFail: 'AN_195_CANCEL',
          text: 'ECG',
          origin: {
            name: '195.ECG#ORIGIN',
            type: 'Object',
          },
          startTime: {
            name: '195.ECG#START_TIME',
            type: 'String',
          },
          duration: {
            name: '195.ECG#DURATION',
            type: 'Object',
          },
          frequency: {
            name: '195.ECG#FREQUENCY',
            type: 'Object',
          },
          rrIntervals: {
            name: '195.ECG#RR_INTERVALS',
            type: 'Object',
          },
          samples: {
            name: '195.ECG#SAMPLES',
            type: 'Object',
          },
          sampleTimeInSeconds: 30,
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_195_CANCEL',
          next: 'ANSEV_196_F195',
          variable: {
            name: '195.ECG##CANCEL',
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
          nodeName: 'ANSEV_196_F195',
          next: '196',
          variable: {
            name: '195.ECG##SEVERITY',
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
          nodeName: 'ANSEV_196_D195',
          next: '196',
          variable: {
            name: '195.ECG##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        SpirometerDeviceNode: {
          nodeName: '198',
          next: 'ANSEV_194_D198',
          nextFail: 'AN_198_CANCEL',
          text: 'Spirometry',
          origin: {
            name: '198.SPI#ORIGIN',
            type: 'Object',
          },
          fev1: {
            name: '198.SPI#FEV1',
            type: 'Float',
          },
          fev6: {
            name: '198.SPI#FEV6',
            type: 'Float',
          },
          fev1Fev6Ratio: {
            name: '198.SPI#FEV1_FEV6_RATIO',
            type: 'Integer',
          },
          fef2575: {
            name: '198.SPI#FEF25_75',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_198_CANCEL',
          next: 'ANSEV_194_F198',
          variable: {
            name: '198.SPI##CANCEL',
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
          nodeName: 'ANSEV_194_F198',
          next: '194',
          variable: {
            name: '198.SPI##SEVERITY',
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
          nodeName: 'ANSEV_194_D198',
          next: '194',
          variable: {
            name: '198.SPI##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        WeightDeviceNode: {
          nodeName: '199',
          next: 'ANSEV_192_D199',
          nextFail: 'AN_199_CANCEL',
          text: 'Weight',
          origin: {
            name: '199.WEIGHT#ORIGIN',
            type: 'Object',
          },
          weight: {
            name: '199.WEIGHT',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_199_CANCEL',
          next: 'ANSEV_192_F199',
          variable: {
            name: '199.WEIGHT##CANCEL',
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
          nodeName: 'ANSEV_192_F199',
          next: '192',
          variable: {
            name: '199.WEIGHT##SEVERITY',
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
          nodeName: 'ANSEV_192_D199',
          next: '192',
          variable: {
            name: '199.WEIGHT##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        TemperatureDeviceNode: {
          nodeName: '194',
          next: 'ANSEV_199_D194',
          nextFail: 'AN_194_CANCEL',
          text: 'Temperature',
          origin: {
            name: '194.TEMPERATURE#ORIGIN',
            type: 'Object',
          },
          temperature: {
            name: '194.TEMPERATURE',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_194_CANCEL',
          next: 'ANSEV_199_F194',
          variable: {
            name: '194.TEMPERATURE##CANCEL',
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
          nodeName: 'ANSEV_199_F194',
          next: '199',
          variable: {
            name: '194.TEMPERATURE##SEVERITY',
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
          nodeName: 'ANSEV_199_D194',
          next: '199',
          variable: {
            name: '194.TEMPERATURE##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        SaturationWithoutPulseDeviceNode: {
          nodeName: '197',
          next: 'ANSEV_198_D197',
          nextFail: 'AN_197_CANCEL',
          text: 'Saturation without pulse',
          origin: {
            name: '197.SAT#ORIGIN',
            type: 'Object',
          },
          saturation: {
            name: '197.SAT#SATURATION',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_197_CANCEL',
          next: 'ANSEV_198_F197',
          variable: {
            name: '197.SAT##CANCEL',
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
          nodeName: 'ANSEV_198_F197',
          next: '198',
          variable: {
            name: '197.SAT##SEVERITY',
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
          nodeName: 'ANSEV_198_D197',
          next: '198',
          variable: {
            name: '197.SAT##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        ActivityDeviceNode: {
          nodeName: '200',
          next: 'ANSEV_201_D200',
          nextFail: 'AN_200_CANCEL',
          text: 'Activity',
          origin: {
            name: '200.ACTIVITY#ORIGIN',
            type: 'Object',
          },
          dailySteps: {
            name: '200.ACTIVITY#DAILY_STEPS',
            type: 'Integer',
          },
          dailyStepsWeeklyAverage: {
            name: '200.ACTIVITY#DAILY_STEPS_WEEKLY_AVERAGE',
            type: 'Integer',
          },
          dailyStepsHistoricalMeasurements: {
            name: '200.ACTIVITY#DAILY_STEPS_HISTORICAL_MEASUREMENTS',
            type: 'Object[]',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_200_CANCEL',
          next: 'ANSEV_201_F200',
          variable: {
            name: '200.ACTIVITY##CANCEL',
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
          nodeName: 'ANSEV_201_F200',
          next: '201',
          variable: {
            name: '200.ACTIVITY##SEVERITY',
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
          nodeName: 'ANSEV_201_D200',
          next: '201',
          variable: {
            name: '200.ACTIVITY##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        SaturationDeviceNode: {
          nodeName: '196',
          next: 'ANSEV_197_D196',
          nextFail: 'AN_196_CANCEL',
          text: 'Saturation',
          origin: {
            name: '196.SAT#ORIGIN',
            type: 'Object',
          },
          saturation: {
            name: '196.SAT#SATURATION',
            type: 'Integer',
          },
          pulse: {
            name: '196.SAT#PULSE',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_196_CANCEL',
          next: 'ANSEV_197_F196',
          variable: {
            name: '196.SAT##CANCEL',
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
          nodeName: 'ANSEV_197_F196',
          next: '197',
          variable: {
            name: '196.SAT##SEVERITY',
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
          nodeName: 'ANSEV_197_D196',
          next: '197',
          variable: {
            name: '196.SAT##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        BloodPressureDeviceNode: {
          nodeName: '201',
          next: 'ANSEV_202_D201',
          nextFail: 'AN_201_CANCEL',
          text: 'Blood pressure',
          origin: {
            name: '201.BP#ORIGIN',
            type: 'Object',
          },
          systolic: {
            name: '201.BP#SYSTOLIC',
            type: 'Integer',
          },
          diastolic: {
            name: '201.BP#DIASTOLIC',
            type: 'Integer',
          },
          meanArterialPressure: {
            name: '201.BP#MEAN_ARTERIAL_PRESSURE',
            type: 'Integer',
          },
          pulse: {
            name: '201.BP#PULSE',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_201_CANCEL',
          next: 'ANSEV_202_F201',
          variable: {
            name: '201.BP##CANCEL',
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
          nodeName: 'ANSEV_202_F201',
          next: '202',
          variable: {
            name: '201.BP##SEVERITY',
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
          nodeName: 'ANSEV_202_D201',
          next: '202',
          variable: {
            name: '201.BP##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        BloodSugarDeviceNode: {
          nodeName: '202',
          next: 'ANSEV_193_D202',
          nextFail: 'AN_202_CANCEL',
          text: 'Blood sugar',
          origin: {
            name: '202.BS#ORIGIN',
            type: 'Object',
          },
          bloodSugarMeasurements: {
            name: '202.BS#BLOODSUGARMEASUREMENTS',
            type: 'Object[]',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_202_CANCEL',
          next: 'ANSEV_193_F202',
          variable: {
            name: '202.BS##CANCEL',
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
          nodeName: 'ANSEV_193_F202',
          next: '195',
          variable: {
            name: '202.BS##SEVERITY',
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
          nodeName: 'ANSEV_193_D202',
          next: '195',
          variable: {
            name: '202.BS##SEVERITY',
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
          nodeName: '192',
        },
      },
    ],
    output: [
      {
        name: '197.SAT#SATURATION',
        type: 'Integer',
      },
      {
        name: '200.ACTIVITY##CANCEL',
        type: 'Boolean',
      },
      {
        name: '202.BS#ORIGIN',
        type: 'Object',
      },
      {
        name: '195.ECG#MEASUREMENTS',
        type: 'Float[]',
      },
      {
        name: '198.SPI#FEV6',
        type: 'Float',
      },
      {
        name: '194.TEMPERATURE##CANCEL',
        type: 'Boolean',
      },
      {
        name: '201.BP##SEVERITY',
        type: 'String',
      },
      {
        name: '198.SPI#FEV1',
        type: 'Float',
      },
      {
        name: '198.SPI#FEV1_FEV6_RATIO',
        type: 'Integer',
      },
      {
        name: '195.ECG#ORIGIN',
        type: 'Object',
      },
      {
        name: '195.ECG#START_TIME',
        type: 'String',
      },
      {
        name: '195.ECG#DURATION',
        type: 'Object',
      },
      {
        name: '195.ECG#FREQUENCY',
        type: 'Object',
      },
      {
        name: '195.ECG#RR_INTERVALS',
        type: 'Object',
      },
      {
        name: '195.ECG#SAMPLES',
        type: 'Object',
      },
      {
        name: '198.SPI#FEF25_75',
        type: 'Float',
      },
      {
        name: '199.WEIGHT##CANCEL',
        type: 'Boolean',
      },
      {
        name: '194.TEMPERATURE',
        type: 'Float',
      },
      {
        name: '197.SAT#ORIGIN',
        type: 'Object',
      },
      {
        name: '196.SAT##SEVERITY',
        type: 'String',
      },
      {
        name: '200.ACTIVITY#DAILY_STEPS_WEEKLY_AVERAGE',
        type: 'Integer',
      },
      {
        name: '199.WEIGHT#ORIGIN',
        type: 'Object',
      },
      {
        name: '202.BS##CANCEL',
        type: 'Boolean',
      },
      {
        name: '198.SPI##SEVERITY',
        type: 'String',
      },
      {
        name: '196.SAT##CANCEL',
        type: 'Boolean',
      },
      {
        name: '197.SAT##SEVERITY',
        type: 'String',
      },
      {
        name: '197.SAT##CANCEL',
        type: 'Boolean',
      },
      {
        name: '199.WEIGHT',
        type: 'Float',
      },
      {
        name: '194.TEMPERATURE##SEVERITY',
        type: 'String',
      },
      {
        name: '201.BP#MEAN_ARTERIAL_PRESSURE',
        type: 'Integer',
      },
      {
        name: '195.ECG##SEVERITY',
        type: 'String',
      },
      {
        name: '201.BP#ORIGIN',
        type: 'Object',
      },
      {
        name: '196.SAT#ORIGIN',
        type: 'Object',
      },
      {
        name: '200.ACTIVITY#ORIGIN',
        type: 'Object',
      },
      {
        name: '202.BS#BLOODSUGARMEASUREMENTS',
        type: 'Object[]',
      },
      {
        name: '196.SAT#SATURATION',
        type: 'Integer',
      },
      {
        name: '194.TEMPERATURE#ORIGIN',
        type: 'Object',
      },
      {
        name: '196.SAT#PULSE',
        type: 'Integer',
      },
      {
        name: '201.BP##CANCEL',
        type: 'Boolean',
      },
      {
        name: '201.BP#PULSE',
        type: 'Integer',
      },
      {
        name: '198.SPI##CANCEL',
        type: 'Boolean',
      },
      {
        name: '200.ACTIVITY##SEVERITY',
        type: 'String',
      },
      {
        name: '198.SPI#ORIGIN',
        type: 'Object',
      },
      {
        name: '201.BP#SYSTOLIC',
        type: 'Integer',
      },
      {
        name: '200.ACTIVITY#DAILY_STEPS',
        type: 'Integer',
      },
      {
        name: '202.BS##SEVERITY',
        type: 'String',
      },
      {
        name: '199.WEIGHT##SEVERITY',
        type: 'String',
      },
      {
        name: '201.BP#DIASTOLIC',
        type: 'Integer',
      },
      {
        name: '195.ECG##CANCEL',
        type: 'Boolean',
      },
      {
        name: '200.ACTIVITY#DAILY_STEPS_HISTORICAL_MEASUREMENTS',
        type: 'Object[]',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/19`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/19/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
