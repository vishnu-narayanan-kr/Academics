"use strict";

module.exports = {
  get: {
    catalogue: {
      country: {
        in: "query",
        optional: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "1016"
        },
        isNotArray: {
          errorMessage: "5009"
        }
      },
      city: {
        in: "query",
        optional: true,
        isNotArray: {
          errorMessage: "5010"
        }
      },
      province: {
        in: "query",
        optional: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "1015"
        },
        isNotArray: {
          errorMessage: "5011"
        }
      },
      areaCode: {
        in: "query",
        optional: true,
        isLength: {
          options: [
            {
              min: 3,
              max: 3
            }
          ],
          errorMessage: "3000"
        },
        isValidAreaCode: {
          errorMessage: "3001"
        },
        isNotArray: {
          errorMessage: "5012"
        }
      },
      page: {
        in: "query",
        optional: true,
        isInt: {
          options: [
            {
              gt: 0
            }
          ],
          errorMessage: "1066"
        }
      },
      pageLimit: {
        in: "query",
        optional: true,
        isInt: {
          options: [
            {
              gt: 0
            }
          ],
          errorMessage: "1067"
        }
      },
      exchangeCode: {
        in: "query",
        optional: true,
        isLength: {
          options: [
            {
              min: 3,
              max: 3
            }
          ],
          errorMessage: "3003"
        },
        isValidExchangeCode: {
          errorMessage: "3004"
        },
        isNotArray: {
          errorMessage: "5013"
        }
      },
      lineNumber: {
        in: "query",
        optional: true,
        isLength: {
          options: [
            {
              min: 4,
              max: 4
            }
          ],
          errorMessage: "5000"
        },
        isValidLineNumber: {
          errorMessage: "5001"
        },
        isNotArray: {
          errorMessage: "5014"
        }
      },
      fullNumber: {
        in: "query",
        optional: true,
        isLength: {
          options: [
            {
              min: 11,
              max: 11
            }
          ],
          errorMessage: "5002"
        },
        isValidFullNumber: {
          errorMessage: "5003"
        },
        isNotArray: {
          errorMessage: "5015"
        }
      },
      inUse: {
        in: "query",
        optional: true,
        isBooleanString: {
          errorMessage: "5004"
        },
        isNotArray: {
          errorMessage: "5016"
        }
      },
      checkLastUsed: {
        in: "query",
        optional: true,
        isBooleanString: {
          errorMessage: "5017"
        },
        isNotArray: {
          errorMessage: "5018"
        }
      },
      lastUsed: {
        in: "query",
        optional: true,
        isValidDate: {
          errorMessage: "5019"
        },
        isEmptyString: {
          errorMessage: "5020"
        }
      },
      lat: {
        in: "query",
        optional: true,
        isNumber: {
          errorMessage: "5020"
        },
        isEmptyString: {
          errorMessage: "5021"
        }
      },
      lng: {
        in: "query",
        optional: true,
        isNumber: {
          errorMessage: "5022"
        },
        isEmptyString: {
          errorMessage: "5023"
        }
      }
    }
  },
  post: {
    reserve: {
      telephoneNumbers: {
        notEmpty: true,
        isArray: {
          errorMessage: "5005"
        },
        arrayNotEmpty: {
          errorMessage: "5006"
        },
        isValidTelephoneNumberArray: {
          errorMessage: "5007"
        },
        errorMessage: "5008"
      }
    }
  }
};
