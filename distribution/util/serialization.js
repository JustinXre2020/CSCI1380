/*
    Checklist:

    1. Serialize strings
    2. Serialize numbers
    3. Serialize booleans
    4. Serialize (non-circular) Objects
    5. Serialize (non-circular) Arrays
    6. Serialize undefined and null
    7. Serialize Date, Error objects
    8. Serialize (non-native) functions
    9. Serialize circular objects and arrays
    10. Serialize native functions
*/ 

const UNDEFINED_SENTINEL = { __isUndefinedSentinel: true };
const isISODateString = (value) =>  typeof value === 'string' &&
     /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value);

function replacer(key, value) {
  if (typeof value === 'function') {
    return { __type: 'function', code: value.toString() };
  }
  if (value === undefined) {
    return { __type: 'undefined' };
  }

  if (isISODateString(value)) {
    return { __type: 'date', value: new String(value) };
  }

  if (value instanceof Error) {
    return {
      __type: 'error',
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }
  return value;
}

function reviver(key, value) {
  const is_date = value instanceof String && !isNaN(new Date(value));
  if (is_date) {
    return new Date(value);
  }
  if (value && typeof value === 'object' && value.__type) {
    switch (value.__type) {
      case 'function':
        try {
          // Wrap the code in parentheses to handle arrow functions and normal functions
          return eval('(' + value.code + ')');
        } catch (e) {
          return value;
        }
      case 'undefined':
        // Instead of returning undefined (which deletes the key), return a sentinel
        return UNDEFINED_SENTINEL;
      case 'date':
        return new Date(value.value);
      case 'error': {
        const err = new Error(value.message);
        err.name = value.name;
        err.stack = value.stack;
        return err;
      }
      default:
        return value;
    }
  }
  return value;
}

function restoreUndefined(obj) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (obj[i] && typeof obj[i] === 'object') {
        if (obj[i].__isUndefinedSentinel) {
          obj[i] = undefined;
        } else {
          restoreUndefined(obj[i]);
        }
      }
    }
  } else if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        if (obj[key].__isUndefinedSentinel) {
          obj[key] = undefined;
        } else {
          restoreUndefined(obj[key]);
        }
      }
    }
  }
}

function serialize(data) {
  return JSON.stringify(data, replacer);
}

function deserialize(serialized) {
  const parsed = JSON.parse(serialized, reviver);
  if (parsed === UNDEFINED_SENTINEL) {
    return undefined;
  }
  restoreUndefined(parsed);
  return parsed;
}

module.exports = {
  serialize: serialize,
  deserialize: deserialize,
};
