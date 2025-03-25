"use strict";

module.exports = {
  get: {
    invoices: {
      status: {
        in: "query",
        // notEmpty: true,
        optional: true,
        isInt: {
          errorMessage: "1000"
        },
        isValidInvoiceStatus: {
          errorMessage: "1001"
        }
        // errorMessage: "The Invoice Status is required."
      }
    },
    accounts: {
      status: {
        in: "query",
        optional: true,
        isNotArray: {
          errorMessage: "1044"
        }
      },
      query: {
        in: "query",
        optional: true,
        isNotArray: {
          errorMessage: "1045"
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
      }
    },
    usage: {
      type: {
        in: "query",
        notEmpty: true,
        isValidServiceType: {
          errorMessage: "2077"
        },
        errorMessage: "2076"
      },
      invoiceId: {
        in: "query",
        optional: true,
        isEmptyString: {
          errorMessage: "2074"
        }
      },
      date: {
        in: "query",
        optional: true,
        isValidShortDate: {
          errorMessage: "2079"
        },
        isEmptyString: {
          errorMessage: "2075"
        }
      },
      fromDate: {
        in: "query",
        optional: true,
        isValidDate: {
          errorMessage: "2001"
        },
        isNotArray: {
          errorMessage: "2065"
        }
      },
      toDate: {
        in: "query",
        optional: true,
        isValidDate: {
          errorMessage: "2002"
        },
        isNotArray: {
          errorMessage: "2066"
        }
      }
    }
  },
  patch: {
    account: {
      status: {
        optional: true,
        isValidStatus: {
          errorMessage: "1004"
        }
      },
      language: {
        optional: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "1005"
        },
        isValidLanguageCode: {
          errorMessage: "1006"
        }
      },
      name: {
        optional: true,
        isEmptyString: {
          errorMessage: "1008"
        }
      },
      "contact.fname": {
        optional: true,
        isEmptyString: {
          errorMessage: "1009"
        }
      },
      "contact.lname": {
        optional: true,
        isEmptyString: {
          errorMessage: "1010"
        }
      },
      "contact.address1": {
        optional: true,
        // errorMessage: "1011"
        isEmptyString: {
          errorMessage: "1011"
        }
      },
      "contact.address2": {
        optional: true
      },
      "contact.address3": {
        optional: true
      },
      "contact.city": {
        optional: true,
        isEmptyString: {
          errorMessage: "1014"
        }
      },
      "contact.province": {
        optional: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "1015"
        }
      },
      "contact.country": {
        optional: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "1016"
        }
      },
      "contact.postalCode": {
        optional: true,
        isValidPostalCode: {
          errorMessage: "1017"
        }
      },
      "contact.emailAddress": {
        optional: true,
        isEmail: {
          errorMessage: "1018"
        }
      },
      "contact.phone": {
        optional: true,
        isObject: {
          errorMessage: "1046"
        }
      },
      "contact.phone.home": {
        optional: true,
        isNotObject: {
          errorMessage: "1047"
        }
      },
      "contact.phone.business": {
        optional: true,
        isNotObject: {
          errorMessage: "1048"
        }
      },
      "contact.phone.mobile": {
        optional: true,
        isNotObject: {
          errorMessage: "1049"
        }
      }
    },
    service: {
      status: {
        optional: true,
        isValidStatus: {
          errorMessage: "1004"
        }
      },
      name: {
        optional: true,
        isEmptyString: {
          errorMessage: "1008"
        }
      },
      "contract.length": {
        optional: true,
        // isEmptyString: {
        //   errorMessage: "1052"
        // },
        isInt: {
          options: [
            {
              gt: 0
            }
          ],
          errorMessage: "1053"
        }
      },
      "contract.startDate": {
        optional: true,
        isValidDate: {
          errorMessage: "1055"
        }
      },
      "contact.fname": {
        optional: true,
        isEmptyString: {
          errorMessage: "1009"
        }
      },
      "contact.lname": {
        optional: true,
        isEmptyString: {
          errorMessage: "1010"
        }
      },
      "contact.address1": {
        optional: true,
        // errorMessage: "1030"
        isEmptyString: {
          errorMessage: "1011"
        }
      },
      "contact.address2": {
        optional: true
      },
      "contact.address3": {
        optional: true
      },
      "contact.city": {
        optional: true,
        isEmptyString: {
          errorMessage: "1014"
        }
      },
      "contact.province": {
        optional: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "1015"
        }
      },
      "contact.country": {
        optional: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "1016"
        }
      },
      "contact.postalCode": {
        optional: true,
        isValidPostalCode: {
          errorMessage: "1017"
        }
      },
      "contact.emailAddress": {
        optional: true,
        isEmail: {
          errorMessage: "1018"
        }
      },
      "billing.billParentAccount": {
        optional: true,
        isActualBoolean: {
          errorMessage: "1019"
        }
      },
      "billing.recurringCharge": {
        optional: true,
        isPositive: {
          errorMessage: "1020"
        },
        isValidDecimal2Places: {
          errorMessage: "1020"
        }
      }
    },
    plan: {
      planCode: {
        notEmpty: true,
        errorMessage: "1021"
      }
    },
    telephoneNumber: {
      telephoneNumber: {
        notEmpty: true,
        isValidTelephoneNumber: {
          errorMessage: "1022"
        },
        errorMessage: "1023"
      }
    },
    telephoneNumberDev: {
      telephoneNumber: {
        notEmpty: true,
        isValidTelephoneNumberDev: {
          errorMessage: "1022"
        },
        errorMessage: "1023"
      }
    },
    sim: {
      sim: {
        notEmpty: true,
        isLength: {
          options: [
            {
              min: 19,
              max: 20
            }
          ],
          errorMessage: "1024"
        },
        errorMessage: "1025"
      }
    },
    imei: {
      imei: {
        notEmpty: true,
        isLength: {
          options: [
            {
              min: 15,
              max: 17
            }
          ],
          errorMessage: "1026"
        },
        errorMessage: "1027"
      }
    },
    voicemail: {
      newPin: {
        optional: true,
        isLength: {
          options: [
            {
              min: 4,
              max: 4
            }
          ],
          errorMessage: "1057"
        },
        isNumber: {
          errorMessage: "1058"
        }
      },
      "voicemailToEmail.enabled": {
        optional: true,
        isActualBoolean: {
          errorMessage: "1059"
        }
      },
      "voicemailToEmail.emailAddress": {
        optional: true,
        isEmail: {
          errorMessage: "1018"
        }
      },
      "autoLogin.enabled": {
        optional: true,
        isActualBoolean: {
          errorMessage: "1059"
        }
      }
    },
    callForwarding: {
      "always.enabled": {
        optional: true,
        isActualBoolean: {
          errorMessage: "1059"
        }
      },
      "always.forwardToNumber": {
        optional: true,
        isValidTelephoneNumber: {
          errorMessage: "1063"
        }
      },
      "busy.enabled": {
        optional: true,
        isActualBoolean: {
          errorMessage: "1059"
        }
      },
      "busy.forwardToNumber": {
        optional: true,
        isValidTelephoneNumber: {
          errorMessage: "1063"
        }
      },
      "notReachable.enabled": {
        optional: true,
        isActualBoolean: {
          errorMessage: "1059"
        }
      },
      "notReachable.forwardToNumber": {
        optional: true,
        isValidTelephoneNumber: {
          errorMessage: "1063"
        }
      },
      "noAnswer.enabled": {
        optional: true,
        isActualBoolean: {
          errorMessage: "1059"
        }
      },
      "noAnswer.numberOfRings": {
        optional: true,
        isInt: {
          options: [
            {
              gt: 0
            }
          ],
          errorMessage: "1065"
        }
      },
      "noAnswer.forwardToNumber": {
        optional: true,
        isValidTelephoneNumber: {
          errorMessage: "1063"
        }
      }
    }
  },
  post: {
    account: {
      language: {
        optional: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "1005"
        },
        isValidLanguageCode: {
          errorMessage: "1006"
        }
      },
      "contact.fname": {
        notEmpty: true,
        errorMessage: "1028"
      },
      "contact.lname": {
        notEmpty: true,
        errorMessage: "1029"
      },
      "contact.address1": {
        notEmpty: true,
        errorMessage: "1030"
      },
      "contact.address2": {
        optional: true
      },
      "contact.address3": {
        optional: true
      },
      "contact.city": {
        notEmpty: true,
        errorMessage: "1031"
      },
      "contact.province": {
        notEmpty: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "1015"
        },
        errorMessage: "1032"
      },
      "contact.country": {
        notEmpty: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "1016"
        },
        errorMessage: "1033"
      },
      "contact.postalCode": {
        notEmpty: true,
        isValidPostalCode: {
          errorMessage: "1017"
        },
        errorMessage: "1034"
      },
      "contact.emailAddress": {
        notEmpty: true,
        isEmail: {
          errorMessage: "1018"
        },
        errorMessage: "1035"
      },
      "contact.phone": {
        optional: true,
        isObject: {
          errorMessage: "1046"
        }
      },
      "contact.phone.home": {
        optional: true,
        isNotObject: {
          errorMessage: "1047"
        }
      },
      "contact.phone.business": {
        optional: true,
        isNotObject: {
          errorMessage: "1048"
        }
      },
      "contact.phone.mobile": {
        optional: true,
        isNotObject: {
          errorMessage: "1049"
        }
      }
    },
    service: {
      planCode: {
        notEmpty: true,
        errorMessage: "1021"
      },
      name: {
        optional: true,
        isEmptyString: {
          errorMessage: "1008"
        }
      },
      "contract.length": {
        optional: true,
        // isEmptyString: {
        //   errorMessage: "1052"
        // },
        isInt: {
          options: [
            {
              gt: 0
            }
          ],
          errorMessage: "1053"
        }
      },
      // "contract.startDate": {
      //   optional: true,
      //   isEmptyString: {
      //     errorMessage: "1008"
      //   },
      //   isValidDate: {
      //     errorMessage: "1055"
      //   }
      // },
      "agent.agentId": {
        optional: true,
        isEmptyString: {
          errorMessage: "1036"
        }
      },
      "agent.commissionCode": {
        optional: true,
        isEmptyString: {
          errorMessage: "1050"
        }
      },
      "contact.fname": {
        notEmpty: true,
        errorMessage: "1028"
      },
      "contact.lname": {
        notEmpty: true,
        errorMessage: "1029"
      },
      "contact.address1": {
        notEmpty: true,
        errorMessage: "1030"
      },
      "contact.address2": {
        optional: true
      },
      "contact.address3": {
        optional: true
      },
      "contact.city": {
        notEmpty: true,
        errorMessage: "1031"
      },
      "contact.province": {
        notEmpty: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "1015"
        },
        errorMessage: "1032"
      },
      "contact.country": {
        notEmpty: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "1016"
        },
        errorMessage: "1033"
      },
      "contact.postalCode": {
        notEmpty: true,
        isValidPostalCode: {
          errorMessage: "1017"
        },
        errorMessage: "1034"
      },
      "contact.emailAddress": {
        notEmpty: true,
        isEmail: {
          errorMessage: "1018"
        },
        errorMessage: "1035"
      },
      "billing.billParentAccount": {
        optional: true,
        isActualBoolean: {
          errorMessage: "1019"
        }
      },
      "billing.recurringCharge": {
        optional: true,
        isPositive: {
          errorMessage: "1020"
        },
        isValidDecimal2Places: {
          errorMessage: "1020"
        }
      }
    },
    plan: {
      planCode: {
        optional: true,
        isEmptyString: {
          errorMessage: "1037"
        }
      }
    }
  }
};
