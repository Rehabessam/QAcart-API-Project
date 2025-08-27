export function validateByEntityModel(data, { fields }) {
  const modelRequiredTypes = Object.keys(fields).map(key => ({
    type: fields[key]?.type || typeof fields[key],
    required: !!fields[key]?.required,
    key: key,
  })).filter(item => item.required).reduce((obj, item) => {
    if (item.required)
      obj[item.key] = item.type;

    return obj;
  }, {});

  for (let field in modelRequiredTypes) {
    if (typeof data[field] !== modelRequiredTypes[field])
      return false;
  }

  return true;
}

export function getID(url) {
  return url.splitted[1];
}
