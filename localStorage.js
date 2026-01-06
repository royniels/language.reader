const prefix = 'language.';

function set(id, value) {
  const valueJson = (typeof value === 'object' || Array.isArray(value))
    ? JSON.stringify(value) : value;
  localStorage[prefix + id] = valueJson;
}

function get(id) {
  const value = localStorage[prefix + id];
  try {
    return JSON.parse(value);
  } catch (error) {
    error;
    return value === 'undefined' ? undefined : value;
  }
}

export { get, set };
