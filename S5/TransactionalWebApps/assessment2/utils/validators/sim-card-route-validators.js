"use strict";

module.exports = {
  get: {
    simcards: {
      iccid: {
        optional: true,
        isNotArray: {
          errorMessage: "4003"
        }
      },
      imsi: {
        optional: true,
        isNotArray: {
          errorMessage: "4004"
        }
      },
      puk: {
        optional: true,
        isNotArray: {
          errorMessage: "4005"
        }
      },
      udf1: {
        optional: true,
        isNotArray: {
          errorMessage: "4006"
        }
      },
      udf2: {
        optional: true,
        isNotArray: {
          errorMessage: "4007"
        }
      },
      udf3: {
        optional: true,
        isNotArray: {
          errorMessage: "4008"
        }
      }
    }
  }
};