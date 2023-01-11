export interface AcknowledgementsResult {
  acknowledgements: ApiAcknowledgement[];
}

export type ApiAcknowledgement = ApiTimestamps<Acknowledgement>;

type ApiTimestamps<T> = {
  [P in keyof T]: T[P] extends Date ? string : T[P];
};

export type Acknowledgement =
  | QuestionnaireAcknowledgement
  | ExternalAcknowledgement;

interface BaseAcknowledgement {
  uploadTimestamp: Date;
  acknowledgementTimestamp: Date;
  message?: string; // Composed in the component
}

// Investigate if we can use type guards to get rid of the hardcoded 'type'
// property for the two acknowledgement types.
export interface QuestionnaireAcknowledgement extends BaseAcknowledgement {
  type: 'questionnaire';
  name: string;
  links: {
    questionnaire: string;
  };
}

export interface ExternalAcknowledgement extends BaseAcknowledgement {
  type: 'externalMeasurement';
  system: string;
}
