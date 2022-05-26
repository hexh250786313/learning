const findKeyValuePairsPath: (
  keyToFind: string | undefined,
  valueToFind: any,
  element: any
) => Array<string> = function (keyToFind, valueToFind, element) {
  function _isObject(elem: any) {
    return elem && typeof elem === "object" && elem.constructor === Object;
  }

  function _isArray(elem: any) {
    return Array.isArray(elem);
  }

  function _checkObj(
    obj: any,
    keyToFind: string | undefined,
    valueToFind: any,
    path: string,
    paths: Array<string>
  ) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (undefined === keyToFind && valueToFind === value && path) {
        paths.push(`${path}.${key}`);
      } else if (undefined === valueToFind && keyToFind === key) {
        paths.push(`${path}.${key}`);
      } else if (key === keyToFind && value === valueToFind) {
        paths.push(`${path}.${key}`);
      }
      checkObjOrArr(value, keyToFind, valueToFind, `${path}.${key}`, paths);
    });
  }

  function _checkArr(
    array: Array<any>,
    keyToFind: string | undefined,
    valueToFind: any,
    path: string,
    paths: Array<string>
  ) {
    array.forEach((elem, i) => {
      if (!keyToFind && valueToFind === elem && path) {
        paths.push(`${path}[${i}]`);
      }
      checkObjOrArr(elem, keyToFind, valueToFind, `${path}[${i}]`, paths);
    });
  }

  function checkObjOrArr(
    elem: any,
    keyToFind: string | undefined,
    valueToFind: any,
    path: string,
    paths: Array<string>
  ) {
    if (_isObject(elem)) {
      _checkObj(elem, keyToFind, valueToFind, path, paths);
    } else if (_isArray(elem)) {
      _checkArr(elem, keyToFind, valueToFind, path, paths);
    }
  }

  if (
    (keyToFind === undefined || keyToFind === null) &&
    (valueToFind === undefined || valueToFind === null)
  ) {
    return [];
  }

  const parsedElement = JSON.parse(JSON.stringify(element));
  const paths: Array<any> = [];

  if (_isObject(parsedElement) || _isArray(parsedElement)) {
    checkObjOrArr(parsedElement, keyToFind, valueToFind, "baseElement", paths);
  }

  paths.forEach((str, idx, self) => {
    self[idx] = str.replace(/baseElement\.{0,1}/g, "");
  });

  return paths;
};

const test1 = {
  a1: {
    b: {
      c: [3, 4, 5, 6],
    },
  },
  a2: 4,
  c3: [4],
};

const test2 = [
  {
    a1: {
      b: {
        c: [3, 4, 5, 6],
      },
    },
    a2: 4,
    c3: [4],
  },
  {
    a1: {
      b: {
        c: [3, 4, 5, 6],
      },
    },
    a2: 4,
    c3: [4],
  },
];

console.log("test1");
console.log(findKeyValuePairsPath(undefined, 4, test1));
console.log(findKeyValuePairsPath("c", undefined, test1));
console.log(findKeyValuePairsPath("1", undefined, test1)); // @todo: can not find by array index
console.log(findKeyValuePairsPath("1", 4, test1)); // @todo: can not find by array index
console.log(findKeyValuePairsPath("a2", 4, test1));
console.log(findKeyValuePairsPath("a2", [4], test1)); // @todo: can not find value that is an object type

console.log("test2");
console.log(findKeyValuePairsPath(undefined, 4, test2));
console.log(findKeyValuePairsPath("c", undefined, test2));
console.log(findKeyValuePairsPath("1", undefined, test2)); // @todo: can not find by array index
console.log(findKeyValuePairsPath("1", 4, test2)); // @todo: can not find by array index
console.log(findKeyValuePairsPath("a2", 4, test2));
console.log(findKeyValuePairsPath("a2", [4], test2)); // @todo: can not find value that is an object type
