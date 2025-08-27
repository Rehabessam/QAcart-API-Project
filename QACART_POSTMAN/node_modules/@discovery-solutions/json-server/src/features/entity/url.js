const test = (key, getValue) => {
  return req => {
    const splitted = req.url.splitted.filter(item => item.length > 0);

    return req.method === CONSTANTS.SERVER.METHODS[key] && getValue(splitted.length);
  }
}

const URL = {
  delete: test("DELETE", url => url === 2),
  update: test("UPDATE", url => url === 2),
  insert: test("INSERT", url => url === 1),
  list: test("LIST", url => url === 1),
  get: test("GET", url => url === 2),

  oldest: req => req?.url?.value?.search("oldest") > -1 && req?.method === CONSTANTS.SERVER.METHODS.GET,
  latest: req => req?.url?.value?.search("latest") > -1 && req?.method === CONSTANTS.SERVER.METHODS.GET,
}

export default URL;
