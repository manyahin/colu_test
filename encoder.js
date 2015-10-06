var table = [
  {
    bytes: 2,
    digits: 2,
    mantissa: 9,
    exponent: 4
  },
  {
    bytes: 3,
    digits: 5,
    mantissa: 17,
    exponent: 4
  },
  {
    bytes: 4,
    digits: 7,
    mantissa: 25,
    exponent: 4
  },
  {
    bytes: 5,
    digits: 10,
    mantissa: 34,
    exponent: 3
  },
  {
    bytes: 6,
    digits: 12,
    mantissa: 42,
    exponent: 3
  },
  {
    bytes: 7,
    digits: 16,
    mantissa: 54,
    exponent: 0
  }  
]

var findSchemeByDigits = function(digitsCount) {
  for (var i = 0; i < table.length; i++) {
    if (digitsCount <= table[i].digits) {
      return table[i];
    }
    if (digitsCount > table[i].digits) {
      continue;
    }
  }
} 

var genTypeBits = function(scheme) {  
  var bin = parseInt(scheme.bytes - 1, 10).toString(2);
  var diff = 3 - bin.length;
  if (diff === 2) {
    bin = '00' + bin;
  } 
  else if (diff === 1) {
    bin = '0' + bin;
  }
  if (scheme.bytes === 7) {
    bin = bin.slice(0, -1);
  }
  return bin; 
}

var genMantissaBits = function(number, scheme) {
  var bin = parseInt(number, 10).toString(2);
  if (bin.length > scheme.mantissa) {
    return false;
  } else if (bin.length != scheme.mantissa) {
    var diff = scheme.mantissa - bin.length;
    bin = Array(diff + 1).join('0') + bin;
  }
  return bin;
}

var genExponentBits = function(exponent, scheme) {
  if (scheme.exponent == 0) {
    return false;
  }
  var bin = parseInt(exponent, 10).toString(2);
  if (bin.length != scheme.exponent) {
    var diff = scheme.exponent - bin.length;
    bin = Array(diff + 1).join('0') + bin;
  }
  return bin;
}

function binaryToHex(s) {
  var i, k, part, accum, ret = '';
  for (i = s.length-1; i >= 3; i -= 4) {
    // extract out in substrings of 4 and convert to hex
    part = s.substr(i+1-4, 4);
    accum = 0;
    for (k = 0; k < 4; k += 1) {
      if (part[k] !== '0' && part[k] !== '1') {
        // invalid character
        return { valid: false };
      }
      // compute the length 4 substring
      accum = accum * 2 + parseInt(part[k], 10);
    }
    if (accum >= 10) {
      // 'A' to 'F'
      ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;
    } else {
      // '0' to '9'
      ret = String(accum) + ret;
    }
  }
  // remaining characters, i = 0, 1, or 2
  if (i >= 0) {
    accum = 0;
    // convert from front
    for (k = 0; k <= i; k += 1) {
      if (s[k] !== '0' && s[k] !== '1') {
        return { valid: false };
      }
      accum = accum * 2 + parseInt(s[k], 10);
    }
    // 3 bits, value cannot exceed 2^3 - 1 = 7, just convert
    ret = String(accum) + ret;
  }
  return { valid: true, result: ret };
}

module.exports = {
  encode: function(number) {
    if (number < 1) {
      return;
    }
    if (number < 32) {
      return new Buffer([number]);
    }
    significantFigures = parseFloat('0.' + number).toString().slice(2)
    if (significantFigures.length > 16) {
      return;
    }
    if (number > 10000000000000000) {
      return;
    }
    var scheme = findSchemeByDigits(significantFigures.length);
    var typeBits = genTypeBits(scheme);

    var mantissaBits = genMantissaBits(significantFigures, scheme);
    var zerosCount = number.toString().length - significantFigures.length;

    var tmpSignificantFigures = significantFigures;
    var tmpMantissa = mantissaBits;
    var tmpZerosCount = zerosCount; 

    // Strange it's looking like optimisation when we try to fill all mantisa
    while(true) {
      if (tmpZerosCount > 0) {
        // try move zero to mantissa
        tmpZerosCount = tmpZerosCount - 1;
        tmpSignificantFigures = tmpSignificantFigures + '0';
        tmpMantissa = genMantissaBits(tmpSignificantFigures, scheme);
        if (tmpMantissa) {
          mantissaBits = tmpMantissa;
          zerosCount = tmpZerosCount;
          // try to add next zero from exponent
          continue;
        }
      }
      break;
    }
    
    exponentBits = genExponentBits(zerosCount, scheme);
    if (!exponentBits) {
      var composite = typeBits + mantissaBits;
    } else {
      var composite = typeBits + mantissaBits + exponentBits;
    }
    
    return new Buffer(binaryToHex(composite).result, 'hex');
  }
};