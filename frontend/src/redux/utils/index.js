export function isNumeric(num) {
    return !isNaN(num) && !isNaN(parseFloat(num));
  }
  
  /**
   * A utility function to create a delay promise
   * @param {Number} ms The delay time in millisecond.
   */
  export function sleep(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
  }
  
  export function isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  
  export function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item) && item != null;
  }
  
  /*
   * Recursively merge properties of two objects
   */
  export function mergeObject(target, source) {
    if (typeof Object.assign !== "function") {
      (function () {
        Object.assign = function (target) {
          // We must check against these specific cases.
          if (target === undefined || target === null) {
            throw new TypeError("Cannot convert undefined or null to object");
          }
  
          let output = Object(target);
          for (let index = 1; index < arguments.length; index++) {
            let source = arguments[index];
            if (source !== undefined && source !== null) {
              for (let nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                  output[nextKey] = source[nextKey];
                }
              }
            }
          }
          return output;
        };
      })();
    }
  
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, {
              [key]: source[key],
            });
          } else {
            output[key] = mergeObject(target[key], source[key]);
          }
        } else {
          Object.assign(output, {
            [key]: source[key],
          });
        }
      });
    }
    return output;
  }
  
  /**
   * Check number is Integer or not
   * @param {*} n
   */
  export function isInt(n) {
    return Number(n) === n && n % 1 === 0;
  }
  
  /**
   * Check number is Float or not
   * @param {*} n
   */
  export function isFloat(n) {
    return Number(n) === n && n % 1 === 0;
  }
  
  /**
   * Shuffle an array
   * @param {Array} array
   */
  export function shuffleArray(array) {
    const n = array.length;
    for (let i = n - 1; i > 0; --i) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  /**
   * Capitalize first letter of the string and lower case all other letters
   * @param {String} string
   * @returns A string with first letter is capitalized
   */
  export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
  }
  
  /**
   * Check null address
   * @param {String} address The ethereum address
   * @returns Boolean
   */
  export function isNullAddress(address) {
    return "0x0000000000000000000000000000000000000000" === String(address);
  }
  