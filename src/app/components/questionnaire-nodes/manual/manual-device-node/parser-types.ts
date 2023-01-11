import { ManualDeviceNodeParserType } from '@app/types/parser.type';

export { ManualDeviceNodeParserType } from '@app/types/parser.type';

export const PARSER_TYPES: ReadonlyArray<ManualDeviceNodeParserType> = [
  {
    typeName: 'bodyCellMass',
    typeValue: 'float',
    translationId: 'BODY_CELL_MASS',
  },
  {
    typeName: 'fatMass',
    typeValue: 'float',
    translationId: 'FAT_MASS',
  },
  {
    typeName: 'hemoglobin',
    typeValue: 'float',
    translationId: 'HAEMOGLOBIN',
  },
  {
    typeName: 'height',
    typeValue: 'integer',
    translationId: 'HEIGHT',
  },
  {
    typeName: 'peakFlow',
    typeValue: 'integer',
    translationId: 'PEAK_FLOW',
  },
  {
    typeName: 'phaseAngle',
    typeValue: 'float',
    translationId: 'PHASE_ANGLE',
  },
  {
    typeName: 'pulse',
    typeValue: 'integer',
    translationId: 'PULSE',
  },
  {
    typeName: 'respiratoryRate',
    typeValue: 'integer',
    translationId: 'RESPIRATORY_RATE',
  },
  {
    typeName: 'sitToStand',
    typeValue: 'integer',
    translationId: 'SIT_TO_STAND',
  },
  {
    typeName: 'temperature',
    typeValue: 'float',
    translationId: 'TEMPERATURE',
  },
  {
    typeName: 'temperatureFahrenheit',
    typeValue: 'float',
    translationId: 'TEMPERATURE_FAHRENHEIT',
  },
  {
    typeName: 'weight',
    typeValue: 'float',
    translationId: 'WEIGHT',
  },
  {
    typeName: 'weightPound',
    typeValue: 'float',
    translationId: 'WEIGHT_POUND',
  },
  {
    typeName: 'oxygenFlow',
    typeValue: 'float',
    translationId: 'OXYGEN_FLOW',
  },
];
