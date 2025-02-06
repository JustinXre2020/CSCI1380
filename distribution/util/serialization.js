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
const isISODateString = (value) => typeof value === 'string' &&
     /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value);

function replacer(key, value) {
  // Serialize functions as objects with their code as a string
  if (typeof value === 'function') {
    return { __type: 'function', code: value.toString() };
  }
  
  // Serialize undefined values explicitly
  if (value === undefined) {
    return { __type: 'undefined' };
  }

  // Convert ISO date strings into a structured date object
  if (isISODateString(value)) {
    return { __type: 'date', value: new String(value) };
  }

  // Serialize Error objects with their name, message, and stack trace
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
  // Handle custom types serialized using the replacer function
  if (value && typeof value === 'object' && value.__type) {
    switch (value.__type) {
      case 'function':
        // Wrap the code in parentheses to handle different function formats
        return eval('(' + value.code + ')');
      case 'undefined':
        // Use a sentinel to track undefined values
        return UNDEFINED_SENTINEL;
      case 'date':
        return new Date(value.value);
      case 'error': {
        // Reconstruct an Error object
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
  // Recursively restore undefined values in arrays
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
    // Recursively restore undefined values in objects
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
  // Convert data to a JSON string using the custom replacer function
  return JSON.stringify(data, replacer);
}

function deserialize(serialized) {
  // Parse the JSON string back into an object using the reviver function
  const parsed = JSON.parse(serialized, reviver);
  
  // Handle cases where the root object itself was an undefined sentinel
  if (parsed === UNDEFINED_SENTINEL) {
    return undefined;
  }
  
  // Restore undefined values recursively
  restoreUndefined(parsed);
  return parsed;
}
    

module.exports = {
  serialize: serialize,
  deserialize: deserialize,
};
