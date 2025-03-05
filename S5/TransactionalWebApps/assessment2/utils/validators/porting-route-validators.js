"use strict";

module.exports = {
  get: {
    check: {
      areaCode: { in: "query",
        notEmpty: true,
        isLength: {
          options: [{
            min: 3,
            max: 3
          }],
          errorMessage: "3000"
        },
        isValidAreaCode: {
          errorMessage: "3001"
        },
        isNotArray: {
          errorMessage: "5012"
        },
        errorMessage: "3002"
      },
      exchangeCode: { in: "query",
        notEmpty: true,
        isLength: {
          options: [{
            min: 3,
            max: 3
          }],
          errorMessage: "3003"
        },
        isValidExchangeCode: {
          errorMessage: "3004"
        },
        isNotArray: {
          errorMessage: "5013"
        },
        errorMessage: "3005"
      }
    },
    requests: {
      serviceId: { in: "query",
        optional: true,
        // isEmptyString: {
        //   errorMessage: "3006"
        // },
        isNotArray: {
          errorMessage: "3034"
        }
      },
      accountId: { in: "query",
        optional: true,
        // isEmptyString: {
        //   errorMessage: "3007"
        // },
        isNotArray: {
          errorMessage: "3035"
        }
      },
      telephoneNumber: { in: "query",
        optional: true,
        isValidTelephoneNumber: {
          errorMessage: "3008"
        },
        // isEmptyString: {
        //   errorMessage: "3009"
        // },
        isNotArray: {
          errorMessage: "3036"
        }
      },
      requestDate: { in: "query",
        optional: true,
        isValidDate: {
          errorMessage: "3010"
        },
        // isEmptyString: {
        //   errorMessage: "3011"
        // },
        isNotArray: {
          errorMessage: "3037"
        }
      },
      desiredDueDate: { in: "query",
        optional: true,
        isValidDate: {
          errorMessage: "3012"
        },
        // isEmptyString: {
        //   errorMessage: "3013"
        // },
        isNotArray: {
          errorMessage: "3038"
        }
      }
    }
  },
  patch: {
    request: {
      // telephoneNumber: {
      //   optional: true,
      //   isValidTelephoneNumber: {
      //     errorMessage: "telephoneNumber is not valid. Must have length 11 and start with a '1'."
      //   },
      //   isEmptyString: {
      //     errorMessage: "telephoneNumber cannot be empty."
      //   }
      // },
      providerName: {
        optional: true,
        // isAlphaNumericWithSpace: {
        //   errorMessage: "3040"
        // },        
        isEmptyString: {
          errorMessage: "3014"
        }
      },
      providerAccountNumber: {
        optional: true,
        isEmptyString: {
          errorMessage: "3015"
        }
      },
      desiredDueDate: {
        optional: true,
        isValidDate: {
          errorMessage: "3012"
        },
        isEmptyString: {
          errorMessage: "3013"
        }
      },
      serviceType: {
        optional: true,
        isValidPortingServiceType: {
          errorMessage: "3016"
        },
        isEmptyString: {
          errorMessage: "3017"
        }
      },
      fullName: {
        optional: true,
        isEmptyString: {
          errorMessage: "3018"
        }
      },
      streetNumber: {
        optional: true,
        isEmptyString: {
          errorMessage: "3019"
        }
      },
      streetName: {
        optional: true,
        // isValidStreetName: {
        //   errorMessage: "3020"
        // },
        isEmptyString: {
          errorMessage: "3021"
        }
      },
      // streetSuffix: {
      //   optional: true,
      //   isValidStreetSuffix: {
      //     errorMessage: "streetSuffix must contain only letters and/or numbers and spaces."
      //   },
      //   isEmptyString: {
      //     errorMessage: "streetSuffix cannot be empty."
      //   }
      // },
      unitNumber: {
        optional: true,
        isValidUnitNumber: {
          errorMessage: "3022"
        }
      },
      city: {
        optional: true,
        // isAlphaNumericWithSpace: {
        //   errorMessage: "3039"
        // },
        isEmptyString: {
          errorMessage: "1014"
        }
      },
      province: {
        optional: true,
        isLength: {
          options: [{
            min: 2,
            max: 2
          }],
          errorMessage: "1015"
        }
      },
      postalCode: {
        optional: true,
        isValidPostalCode: {
          errorMessage: "1017"
        }
      },
      comments: {
        optional: true,
        isEmptyString: {
          errorMessage: "3033"
        }
      },
      serviceId: {
        optional: true,
        isEmptyString: {
          errorMessage: "3006"
        }
      }
    }
  },
  post: {
    request: {
      telephoneNumber: {
        notEmpty: true,
        isValidTelephoneNumber: {
          errorMessage: "3008"
        },
        errorMessage: "3023"
      },
      providerName: {
        notEmpty: true,
        // isAlphaNumericWithSpace: {
        //   errorMessage: "3040"
        // },
        errorMessage: "3024"
      },
      providerAccountNumber: {
        notEmpty: true,
        errorMessage: "3025"
      },
      desiredDueDate: {
        notEmpty: true,
        isValidDate: {
          errorMessage: "3012"
        },
        errorMessage: "3026"
      },
      serviceType: {
        notEmpty: true,
        isValidPortingServiceType: {
          errorMessage: "3016"
        },
        errorMessage: "3027"
      },
      fullName: {
        notEmpty: true,
        errorMessage: "3028"
      },
      streetNumber: {
        notEmpty: true,
        errorMessage: "3029"
      },
      // streetSuffix: {
      //   notEmpty: true,
      //   isValidStreetSuffix: {
      //     errorMessage: "streetSuffix must contain only letters and/or numbers and spaces."
      //   },
      //   errorMessage: "streetSuffix is required."
      // },
      streetName: {
        notEmpty: true,
        // isValidStreetName: {
        //   errorMessage: "3020"
        // },
        errorMessage: "3030"
      },
      unitNumber: {
        optional: true,
        isValidUnitNumber: {
          errorMessage: "3022"
        }
      },
      city: {
        notEmpty: true,
        // isAlphaNumericWithSpace: {
        //   errorMessage: "3039"
        // },
        errorMessage: "3031"
      },
      province: {
        notEmpty: true,
        isLength: {
          options: [{
            min: 2,
            max: 2
          }],
          errorMessage: "1015"
        },
        errorMessage: "1032"
      },
      postalCode: {
        notEmpty: true,
        isValidPostalCode: {
          errorMessage: "1017"
        },
        errorMessage: "1034"
      },
      comments: {
        optional: true
        // isEmptyString: {
        //   errorMessage: "3033"
        // }
      },
      serviceId: {
        notEmpty: true,
        errorMessage: "3032"
      }
    }
  }
};