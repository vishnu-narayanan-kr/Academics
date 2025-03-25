"use strict";

module.exports = {
    post: {
        plan: {
            planCode: {
                notEmpty: true,
                errorMessage: "7000"
            },
            billingType: {
                isValidBillyngType: {
                    errorMessage: "7002"
                },
                notEmpty: true,
                errorMessage: "7001"
            },
            recurringCharge: {
                notEmpty: true,
                errorMessage: "7003",
                isInteger: {
                    errorMessage: "7004"
                }
            },
            billable: {
                notEmpty: true,
                errorMessage: "7005",
                isActualBoolean: {
                    errorMessage: "7006"
                }
            },
            active: {
                optional: true,
                isActualBoolean: {
                    errorMessage: "7007"
                }
            },
            flatRateTariff: {
                notEmpty: true,
                errorMessage: "7008"
            },
            planType: {
                notEmpty: true,
                errorMessage: "7009"
            },
            allotment: {
                optional: true,
                isObject: {
                    errorMessage: "7010"
                }
            },
            broadsoft: {
                optional: true,
                isObject: {
                    errorMessage: "7011"
                }
            },
            ipswitch: {
                optional: true,
                isObject: {
                    errorMessage: "7012"
                }
            },
            huawei: {
                optional: true,
                isObject: {
                    errorMessage: "7013"
                }
            },
            nextologies: {
                optional: true,
                isObject: {
                    errorMessage: "7014"
                }
            }
        }
    },
    patch: {
        plan: {

            billingType: {
                isValidBillyngType: {
                    errorMessage: "7002"
                },
                optional: true
            },
            recurringCharge: {
                optional: true,
                isInteger: {
                    errorMessage: "7004"
                }
            },
            billable: {
                optional: true,
                isActualBoolean: {
                    errorMessage: "7006"
                }
            },
            active: {
                optional: true,
                isActualBoolean: {
                    errorMessage: "7007"
                }
            },
            flatRateTariff: {
                optional: true,
                isNotEmptyString: {
                    errorMessage: "7015"
                }
            },
            planType: {
                optional: true,
                isNotEmptyString: {
                    errorMessage: "7016"
                }
            },
            allotment: {
                optional: true,
                isObject: {
                    errorMessage: "7010"
                }
            },
            broadsoft: {
                optional: true,
                isObject: {
                    errorMessage: "7011"
                }
            },
            ipswitch: {
                optional: true,
                isObject: {
                    errorMessage: "7012"
                }
            },
            huawei: {
                optional: true,
                isObject: {
                    errorMessage: "7013"
                }
            },
            nextologies: {
                optional: true,
                isObject: {
                    errorMessage: "7014"
                }
            }
        }
    }
};