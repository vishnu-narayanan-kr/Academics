"use strict";

module.exports = {
  stripAccents(s) {
    if (!s || typeof s !== "string") {
      return s;
    }
    const _s = s.trim();
    const in_chrs = "àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ";
    const out_chrs = "aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY";
    const chars_rgx = new RegExp("[" + in_chrs + "]", "g");
    const transl = {};
    let i;
    const lookup = m => {
      return transl[m] || m;
    };

    for (i = 0; i < in_chrs.length; i++) {
      transl[in_chrs[i]] = out_chrs[i];
    }

    return _s.replace(chars_rgx, lookup);
  },

  stripNonAlphaNumericCharacters(s) {
    if (!s || typeof s !== "string") {
      return s;
    }
    const _s = s.trim();
    return _s.replace(/[^a-zA-Z0-9\s]+/g, " ").trim();
  },

  stripCharacters(s, regex = null) {
    if (!s || typeof s !== "string") {
      return s;
    }
    if (!regex) {
      return s;
    }
    const _s = s.trim();
    return _s.replace(regex, " ").trim();
  },

  mapProvince(province = "") {
    const codes = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YK"];
    const variations = [
      ["ab", "alberta"],
      ["bc", "british columbia"],
      ["mb", "manitoba"],
      ["nb", "new brunswick"],
      ["nl", "nf", "newfoundland & labrador", "newfoundland and labrador", "labrador"],
      ["ns", "nova scotia"],
      ["nt", "nwt", "northwestterritories", "northwest territories", "north west territories"],
      ["nu", "nunavut"],
      ["on", "ontario", "ont"],
      ["pe", "pei", "prince edward island"],
      ["qc", "quebec", "québec", "qc."],
      ["sk", "saskatchewan"],
      ["yk", "yt", "yukon"]
    ];
    let _province = (province || "").trim();
    const found = variations.findIndex(variation => {
      return variation.indexOf(_province.toLowerCase()) > -1;
    });
    return codes[found] || province;
  }
};
