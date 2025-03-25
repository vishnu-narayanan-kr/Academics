"use strict";

module.exports = {
  post: {
    webhook: {
      target_url: {
        notEmpty: true,
        isValidSecureUrl: {
          errorMessage: "6006"
        },
        errorMessage: "6007"
      },
      event: {
        notEmpty: true,
        errorMessage: "6005"
      }
    }
  },
  patch: {
    porting_request_status: {
      enabled: {
        optional: true,
        isActualBoolean: {
          errorMessage: "6000"
        },
      },
      url: {
        notEmpty: true,
        isValidUrl: {
          errorMessage: "6001"
        },
        errorMessage: "6002"
      },
      token: {
        notEmpty: true,
        errorMessage: "6003"
      },
      header: {
        notEmpty: true,
        errorMessage: "6004"
      }
    }
  },
  patch: {
    webhook: {
      target_url: {
        optional: true,
        isValidSecureUrl: {
          errorMessage: "6006"
        }
      },
      event: {
        optional: true,
        isEmptyString: {
          errorMessage: "6010"
        }
      }
    }
  },
  put: {
    webhook: {
      target_url: {
        optional: true,
        isValidSecureUrl: {
          errorMessage: "6006"
        }
      },
      event: {
        optional: true,
        isEmptyString: {
          errorMessage: "6010"
        }
      }
    }
  }
};