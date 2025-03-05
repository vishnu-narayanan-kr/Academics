"use strict";

module.exports = {
  get: {
    invoices: {
      status: {
        in: "query",
        optional: true,
        isValidInvoiceStatus: {
          errorMessage: "1001"
        },
        isNotArray: {
          errorMessage: "1044"
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
    },
    payments: {
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
      },
      reference: {
        in: "query",
        optional: true,
        isNotArray: {
          errorMessage: "2067"
        }
      }
    },
    adjustments: {
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
    },
    deposits: {
      status: {
        in: "query",
        optional: true,
        isNotArray: {
          errorMessage: "1044"
        }
      },
      paymentId: {
        in: "query",
        optional: true,
        isNotArray: {
          errorMessage: "2068"
        }
      },
      refundId: {
        in: "query",
        optional: true,
        isNotArray: {
          errorMessage: "2069"
        }
      },
      type: {
        in: "query",
        optional: true,
        isNotArray: {
          errorMessage: "2070"
        }
      },
      productCode: {
        in: "query",
        optional: true,
        isNotArray: {
          errorMessage: "2071"
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
    deposit: {
      note: {
        notEmpty: true,
        errorMessage: "2004"
      }
    },
    creditCard: {
      "creditCard.cardType": {
        notEmpty: true,
        isValidCreditCardType: {
          errorMessage: "2005"
        },
        errorMessage: "2006"
      },
      "creditCard.number": {
        notEmpty: true,
        isLength: {
          options: [
            {
              min: 15,
              max: 16
            }
          ],
          errorMessage: "2007"
        },
        isValidCreditCardNumber: {
          errorMessage: "2008"
        },
        errorMessage: "2009"
      },
      "creditCard.holder": {
        notEmpty: true,
        errorMessage: "2010"
      },
      "creditCard.expMonth": {
        notEmpty: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "2011"
        },
        isValidCreditCardExpiryMonth: {
          errorMessage: "2012"
        },
        errorMessage: "2013"
      },
      "creditCard.expYear": {
        notEmpty: true,
        isLength: {
          options: [
            {
              min: 4,
              max: 4
            }
          ],
          errorMessage: "2014"
        },
        isValidCreditCardExpiryYear: {
          errorMessage: "2015"
        },
        errorMessage: "2016"
      },
      "creditCard.CVV": {
        notEmpty: true,
        isValidCreditCardCVV: {
          errorMessage: "2017"
        },
        errorMessage: "2018"
      }
    },
    onlyCreditCard: {
      cardType: {
        notEmpty: true,
        isValidCreditCardType: {
          errorMessage: "2005"
        },
        errorMessage: "2006"
      },
      number: {
        notEmpty: true,
        isLength: {
          options: [
            {
              min: 15,
              max: 16
            }
          ],
          errorMessage: "2007"
        },
        isValidCreditCardNumber: {
          errorMessage: "2008"
        },
        errorMessage: "2009"
      },
      holder: {
        notEmpty: true,
        errorMessage: "2010"
      },
      expMonth: {
        notEmpty: true,
        isLength: {
          options: [
            {
              min: 2,
              max: 2
            }
          ],
          errorMessage: "2011"
        },
        isValidCreditCardExpiryMonth: {
          errorMessage: "2012"
        },
        errorMessage: "2013"
      },
      expYear: {
        notEmpty: true,
        isLength: {
          options: [
            {
              min: 4,
              max: 4
            }
          ],
          errorMessage: "2014"
        },
        isValidCreditCardExpiryYear: {
          errorMessage: "2015"
        },
        errorMessage: "2016"
      },
      CVV: {
        notEmpty: true,
        isValidCreditCardCVV: {
          errorMessage: "2017"
        },
        errorMessage: "2018"
      }
    },
    automaticPayment: {
      body: {
        enabled: {
          notEmpty: true,
          isActualBoolean: {
            errorMessage: "2019"
          },
          errorMessage: "2020"
        },
        onDeclineSuspend: {
          optional: true,
          isActualBoolean: {
            errorMessage: "2021"
          }
        },
        paymentSource: {
          notEmpty: true,
          isValidPaymentSource: {
            errorMessage: "2022"
          },
          errorMessage: "2023"
        }
      },
      onDaysAvailable: {
        "onDaysAvailable.enabled": {
          notEmpty: true,
          isActualBoolean: {
            errorMessage: "2024"
          },
          errorMessage: "2025"
        },
        "onDaysAvailable.trigger": {
          notEmpty: true,
          isInt: {
            options: [
              {
                gt: 0
              }
            ],
            errorMessage: "2026"
          },
          errorMessage: "2027"
        },
        "onDaysAvailable.amount": {
          notEmpty: true,
          isPositive: {
            errorMessage: "2028"
          },
          isValidDecimal2Places: {
            errorMessage: "2028"
          },
          errorMessage: "2029"
        }
      },
      onDayOfMonth: {
        "onDayOfMonth.enabled": {
          notEmpty: true,
          isActualBoolean: {
            errorMessage: "2030"
          },
          errorMessage: "2031"
        },
        "onDayOfMonth.trigger": {
          notEmpty: true,
          isInt: {
            options: [
              {
                min: 1,
                max: 28
              }
            ],
            errorMessage: "2032"
          },
          errorMessage: "2033"
        },
        "onDayOfMonth.amount": {
          notEmpty: true,
          isPositive: {
            errorMessage: "2034"
          },
          isValidDecimal2Places: {
            errorMessage: "2034"
          },
          errorMessage: "2035"
        }
      },
      onBalanceBelow: {
        "onBalanceBelow.enabled": {
          notEmpty: true,
          isActualBoolean: {
            errorMessage: "2036"
          },
          errorMessage: "2037"
        },
        "onBalanceBelow.trigger": {
          notEmpty: true,
          isInt: {
            options: [
              {
                gt: 0
              }
            ],
            errorMessage: "2038"
          },
          errorMessage: "2039"
        },
        "onBalanceBelow.amount": {
          notEmpty: true,
          isPositive: {
            errorMessage: "2040"
          },
          isValidDecimal2Places: {
            errorMessage: "2040"
          },
          errorMessage: "2041"
        }
      }
    }
  },
  post: {
    deposit: {
      type: {
        notEmpty: true,
        isValidDepositType: {
          errorMessage: "2042"
        },
        errorMessage: "2043"
      },
      currency: {
        notEmpty: true,
        isValidCurrency: {
          errorMessage: "2044"
        },
        errorMessage: "2045"
      },
      amount: {
        notEmpty: true,
        isNumber: {
          errorMessage: "2046"
        },
        isPositive: {
          errorMessage: "2046"
        },
        errorMessage: "2047"
      },
      note: {
        optional: true,
        isEmptyString: {
          errorMessage: "2048"
        }
      }
    },
    invoice: {
      adjustments: {
        notEmpty: true,
        isArray: {
          errorMessage: "2049"
        },
        errorMessage: "2064"
      }
    },
    package: {
      code: {
        notEmpty: true,
        errorMessage: "10038"
      }
    },
    payment: {
      amount: {
        notEmpty: true,
        isDecimal: {
          errorMessage: "2051"
        },
        isPositive: {
          errorMessage: "2046"
        },
        errorMessage: "2047"
      },
      paymentMethod: {
        notEmpty: true,
        isValidPaymentMethod: {
          errorMessage: "2052"
        },
        errorMessage: "2053"
      },
      isServicePayment: {
        optional: true,
        isActualBoolean: {
          errorMessage: "2080"
        }
      },
      currency: {
        notEmpty: true,
        isValidCurrency: {
          errorMessage: "2044"
        },
        errorMessage: "2045"
      },
      paymentSource: {
        optional: true,
        isValidPaymentSource: {
          errorMessage: "2022"
        }
      },
      reference: {
        optional: true,
        isEmptyString: {
          errorMessage: "2003"
        }
      },
      remark: {
        optional: true,
        isEmptyString: {
          errorMessage: "2054"
        }
      }
    },
    adjustment: {
      type: {
        notEmpty: true,
        isValidAdjustmentType: {
          errorMessage: "2055"
        },
        errorMessage: "2043"
      },
      amount: {
        notEmpty: true,
        isDecimal: {
          errorMessage: "2051"
        },
        errorMessage: "2047"
      },
      currency: {
        notEmpty: true,
        isValidCurrency: {
          errorMessage: "2044"
        },
        errorMessage: "2045"
      },
      // taxIncluded: {
      //   optional: true,
      //   isActualBoolean: {
      //     errorMessage: "taxIncluded flag must be a boolean: true or false."
      //   }
      // },
      // taxGroup: {
      //   optional: true
      // },
      // balanceType: {
      //   optional: true,
      //   isValidBalanceType: {
      //     errorMessage: "balanceType must one of 'account', 'tab' or 'money_wallet'."
      //   }
      // },
      reference: {
        optional: true,
        isEmptyString: {
          errorMessage: "2003"
        }
      }
      // date: {
      //   optional: true,
      //   isValidDate: {
      //     errorMessage: "date is invalid. Must be in format YYYY-MM-DD."
      //   }
      // },
      // immediate: {
      //   optional: true,
      //   isActualBoolean: {
      //     errorMessage: "immediate flag must be a boolean: true or false."
      //   }
      // },
      // bypassValidations: {
      //   optional: true,
      //   isActualBoolean: {
      //     errorMessage: "bypassValidations flag must be a boolean: true or false."
      //   }
      // }
    }
  }
};
