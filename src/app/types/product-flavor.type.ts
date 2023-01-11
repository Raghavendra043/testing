export type GraphColors = [string, string, string, string];

export enum Languages {
  CS_CZ = 'cs-CZ',
  DA_DK = 'da-DK',
  DE_AT = 'de-AT',
  EN_US = 'en-US',
  ES_ES = 'es-ES',
  FI_FI = 'fi-FI',
  FR_FR = 'fr-FR',
  ID_ID = 'id-ID',
  NB_NO = 'nb-NO',
  NO_NO = 'no-NO',
  SL_SI = 'sl-SI',
  SV_SE = 'sv-SE',
  TH_TH = 'th-TH',
}

export const supportedLanguages: any = Object.values(Languages);

export interface Translations {
  [key: string]: string;
}
export type TranslationOverrides = {
  [language in Languages]?: Translations;
};
