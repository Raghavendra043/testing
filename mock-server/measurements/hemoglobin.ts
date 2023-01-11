export const getHemoglobin = (baseUrl: any) => {
  var typeName = 'hemoglobin';
  const obj: any = {
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
    },
    results: [],
  };
  return obj;
};
