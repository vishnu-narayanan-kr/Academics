"use strict";

// const {
//   transform,
//   isEqual,
//   isObject
// } = require("lodash");

module.exports = {
  compareJSON(obj1, obj2) {
    const ret = {};
    for (let i in obj2) {
      if (!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
        ret[i] = obj2[i];
      }
    }
    return ret;
  }

  // compareJSON(object, base) {
  //   return transform(object, (result, value, key) => {
  //     if (!isEqual(value, base[key])) {
  //       result[key] = isObject(value) && isObject(base[key]) ? this.compareJSON(value, base[key]) : value;
  //     }
  //   });
  // }
};