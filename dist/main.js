(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["KSI"] = factory();
	else
		root["KSI"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var bigInt = (function (undefined) {
    "use strict";

    var BASE = 1e7,
        LOG_BASE = 7,
        MAX_INT = 9007199254740992,
        MAX_INT_ARR = smallToArray(MAX_INT),
        LOG_MAX_INT = Math.log(MAX_INT);

    function Integer(v, radix) {
        if (typeof v === "undefined") return Integer[0];
        if (typeof radix !== "undefined") return +radix === 10 ? parseValue(v) : parseBase(v, radix);
        return parseValue(v);
    }

    function BigInteger(value, sign) {
        this.value = value;
        this.sign = sign;
        this.isSmall = false;
    }
    BigInteger.prototype = Object.create(Integer.prototype);

    function SmallInteger(value) {
        this.value = value;
        this.sign = value < 0;
        this.isSmall = true;
    }
    SmallInteger.prototype = Object.create(Integer.prototype);

    function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
    }

    function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
        if (n < 1e7)
            return [n];
        if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
    }

    function arrayToSmall(arr) { // If BASE changes this function may need to change
        trim(arr);
        var length = arr.length;
        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length) {
                case 0: return 0;
                case 1: return arr[0];
                case 2: return arr[0] + arr[1] * BASE;
                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
        }
        return arr;
    }

    function trim(v) {
        var i = v.length;
        while (v[--i] === 0);
        v.length = i + 1;
    }

    function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
        var x = new Array(length);
        var i = -1;
        while (++i < length) {
            x[i] = 0;
        }
        return x;
    }

    function truncate(n) {
        if (n > 0) return Math.floor(n);
        return Math.ceil(n);
    }

    function add(a, b) { // assumes a and b are arrays with a.length >= b.length
        var l_a = a.length,
            l_b = b.length,
            r = new Array(l_a),
            carry = 0,
            base = BASE,
            sum, i;
        for (i = 0; i < l_b; i++) {
            sum = a[i] + b[i] + carry;
            carry = sum >= base ? 1 : 0;
            r[i] = sum - carry * base;
        }
        while (i < l_a) {
            sum = a[i] + carry;
            carry = sum === base ? 1 : 0;
            r[i++] = sum - carry * base;
        }
        if (carry > 0) r.push(carry);
        return r;
    }

    function addAny(a, b) {
        if (a.length >= b.length) return add(a, b);
        return add(b, a);
    }

    function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
        var l = a.length,
            r = new Array(l),
            base = BASE,
            sum, i;
        for (i = 0; i < l; i++) {
            sum = a[i] - base + carry;
            carry = Math.floor(sum / base);
            r[i] = sum - carry * base;
            carry += 1;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    BigInteger.prototype.add = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.subtract(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall) {
            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
        }
        return new BigInteger(addAny(a, b), this.sign);
    };
    BigInteger.prototype.plus = BigInteger.prototype.add;

    SmallInteger.prototype.add = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.subtract(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            if (isPrecise(a + b)) return new SmallInteger(a + b);
            b = smallToArray(Math.abs(b));
        }
        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
    };
    SmallInteger.prototype.plus = SmallInteger.prototype.add;

    function subtract(a, b) { // assumes a and b are arrays with a >= b
        var a_l = a.length,
            b_l = b.length,
            r = new Array(a_l),
            borrow = 0,
            base = BASE,
            i, difference;
        for (i = 0; i < b_l; i++) {
            difference = a[i] - borrow - b[i];
            if (difference < 0) {
                difference += base;
                borrow = 1;
            } else borrow = 0;
            r[i] = difference;
        }
        for (i = b_l; i < a_l; i++) {
            difference = a[i] - borrow;
            if (difference < 0) difference += base;
            else {
                r[i++] = difference;
                break;
            }
            r[i] = difference;
        }
        for (; i < a_l; i++) {
            r[i] = a[i];
        }
        trim(r);
        return r;
    }

    function subtractAny(a, b, sign) {
        var value;
        if (compareAbs(a, b) >= 0) {
            value = subtract(a, b);
        } else {
            value = subtract(b, a);
            sign = !sign;
        }
        value = arrayToSmall(value);
        if (typeof value === "number") {
            if (sign) value = -value;
            return new SmallInteger(value);
        }
        return new BigInteger(value, sign);
    }

    function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
        var l = a.length,
            r = new Array(l),
            carry = -b,
            base = BASE,
            i, difference;
        for (i = 0; i < l; i++) {
            difference = a[i] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            r[i] = difference < 0 ? difference + base : difference;
        }
        r = arrayToSmall(r);
        if (typeof r === "number") {
            if (sign) r = -r;
            return new SmallInteger(r);
        } return new BigInteger(r, sign);
    }

    BigInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.add(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall)
            return subtractSmall(a, Math.abs(b), this.sign);
        return subtractAny(a, b, this.sign);
    };
    BigInteger.prototype.minus = BigInteger.prototype.subtract;

    SmallInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.add(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            return new SmallInteger(a - b);
        }
        return subtractSmall(b, Math.abs(a), a >= 0);
    };
    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

    BigInteger.prototype.negate = function () {
        return new BigInteger(this.value, !this.sign);
    };
    SmallInteger.prototype.negate = function () {
        var sign = this.sign;
        var small = new SmallInteger(-this.value);
        small.sign = !sign;
        return small;
    };

    BigInteger.prototype.abs = function () {
        return new BigInteger(this.value, false);
    };
    SmallInteger.prototype.abs = function () {
        return new SmallInteger(Math.abs(this.value));
    };

    function multiplyLong(a, b) {
        var a_l = a.length,
            b_l = b.length,
            l = a_l + b_l,
            r = createArray(l),
            base = BASE,
            product, carry, i, a_i, b_j;
        for (i = 0; i < a_l; ++i) {
            a_i = a[i];
            for (var j = 0; j < b_l; ++j) {
                b_j = b[j];
                product = a_i * b_j + r[i + j];
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
                r[i + j + 1] += carry;
            }
        }
        trim(r);
        return r;
    }

    function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
        var l = a.length,
            r = new Array(l),
            base = BASE,
            carry = 0,
            product, i;
        for (i = 0; i < l; i++) {
            product = a[i] * b + carry;
            carry = Math.floor(product / base);
            r[i] = product - carry * base;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    function shiftLeft(x, n) {
        var r = [];
        while (n-- > 0) r.push(0);
        return r.concat(x);
    }

    function multiplyKaratsuba(x, y) {
        var n = Math.max(x.length, y.length);

        if (n <= 30) return multiplyLong(x, y);
        n = Math.ceil(n / 2);

        var b = x.slice(n),
            a = x.slice(0, n),
            d = y.slice(n),
            c = y.slice(0, n);

        var ac = multiplyKaratsuba(a, c),
            bd = multiplyKaratsuba(b, d),
            abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim(product);
        return product;
    }

    // The following function is derived from a surface fit of a graph plotting the performance difference
    // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
    function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
    }

    BigInteger.prototype.multiply = function (v) {
        var n = parseValue(v),
            a = this.value, b = n.value,
            sign = this.sign !== n.sign,
            abs;
        if (n.isSmall) {
            if (b === 0) return Integer[0];
            if (b === 1) return this;
            if (b === -1) return this.negate();
            abs = Math.abs(b);
            if (abs < BASE) {
                return new BigInteger(multiplySmall(a, abs), sign);
            }
            b = smallToArray(abs);
        }
        if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
            return new BigInteger(multiplyKaratsuba(a, b), sign);
        return new BigInteger(multiplyLong(a, b), sign);
    };

    BigInteger.prototype.times = BigInteger.prototype.multiply;

    function multiplySmallAndArray(a, b, sign) { // a >= 0
        if (a < BASE) {
            return new BigInteger(multiplySmall(b, a), sign);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
    }
    SmallInteger.prototype._multiplyBySmall = function (a) {
        if (isPrecise(a.value * this.value)) {
            return new SmallInteger(a.value * this.value);
        }
        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
    };
    BigInteger.prototype._multiplyBySmall = function (a) {
        if (a.value === 0) return Integer[0];
        if (a.value === 1) return this;
        if (a.value === -1) return this.negate();
        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
    };
    SmallInteger.prototype.multiply = function (v) {
        return parseValue(v)._multiplyBySmall(this);
    };
    SmallInteger.prototype.times = SmallInteger.prototype.multiply;

    function square(a) {
        //console.assert(2 * BASE * BASE < MAX_INT);
        var l = a.length,
            r = createArray(l + l),
            base = BASE,
            product, carry, i, a_i, a_j;
        for (i = 0; i < l; i++) {
            a_i = a[i];
            carry = 0 - a_i * a_i;
            for (var j = i; j < l; j++) {
                a_j = a[j];
                product = 2 * (a_i * a_j) + r[i + j] + carry;
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
            }
            r[i + l] = carry;
        }
        trim(r);
        return r;
    }

    BigInteger.prototype.square = function () {
        return new BigInteger(square(this.value), false);
    };

    SmallInteger.prototype.square = function () {
        var value = this.value * this.value;
        if (isPrecise(value)) return new SmallInteger(value);
        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
    };

    function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
        var a_l = a.length,
            b_l = b.length,
            base = BASE,
            result = createArray(b.length),
            divisorMostSignificantDigit = b[b_l - 1],
            // normalization
            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
            remainder = multiplySmall(a, lambda),
            divisor = multiplySmall(b, lambda),
            quotientDigit, shift, carry, borrow, i, l, q;
        if (remainder.length <= a_l) remainder.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base - 1;
            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
                quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            // quotientDigit <= base - 1
            carry = 0;
            borrow = 0;
            l = divisor.length;
            for (i = 0; i < l; i++) {
                carry += quotientDigit * divisor[i];
                q = Math.floor(carry / base);
                borrow += remainder[shift + i] - (carry - q * base);
                carry = q;
                if (borrow < 0) {
                    remainder[shift + i] = borrow + base;
                    borrow = -1;
                } else {
                    remainder[shift + i] = borrow;
                    borrow = 0;
                }
            }
            while (borrow !== 0) {
                quotientDigit -= 1;
                carry = 0;
                for (i = 0; i < l; i++) {
                    carry += remainder[shift + i] - base + divisor[i];
                    if (carry < 0) {
                        remainder[shift + i] = carry + base;
                        carry = 0;
                    } else {
                        remainder[shift + i] = carry;
                        carry = 1;
                    }
                }
                borrow += carry;
            }
            result[shift] = quotientDigit;
        }
        // denormalization
        remainder = divModSmall(remainder, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder)];
    }

    function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
        // Performs faster than divMod1 on larger input sizes.
        var a_l = a.length,
            b_l = b.length,
            result = [],
            part = [],
            base = BASE,
            guess, xlen, highx, highy, check;
        while (a_l) {
            part.unshift(a[--a_l]);
            trim(part);
            if (compareAbs(part, b) < 0) {
                result.push(0);
                continue;
            }
            xlen = part.length;
            highx = part[xlen - 1] * base + part[xlen - 2];
            highy = b[b_l - 1] * base + b[b_l - 2];
            if (xlen > b_l) {
                highx = (highx + 1) * base;
            }
            guess = Math.ceil(highx / highy);
            do {
                check = multiplySmall(b, guess);
                if (compareAbs(check, part) <= 0) break;
                guess--;
            } while (guess);
            result.push(guess);
            part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
    }

    function divModSmall(value, lambda) {
        var length = value.length,
            quotient = createArray(length),
            base = BASE,
            i, q, remainder, divisor;
        remainder = 0;
        for (i = length - 1; i >= 0; --i) {
            divisor = remainder * base + value[i];
            q = truncate(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i] = q | 0;
        }
        return [quotient, remainder | 0];
    }

    function divModAny(self, v) {
        var value, n = parseValue(v);
        var a = self.value, b = n.value;
        var quotient;
        if (b === 0) throw new Error("Cannot divide by zero");
        if (self.isSmall) {
            if (n.isSmall) {
                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [Integer[0], self];
        }
        if (n.isSmall) {
            if (b === 1) return [self, Integer[0]];
            if (b == -1) return [self.negate(), Integer[0]];
            var abs = Math.abs(b);
            if (abs < BASE) {
                value = divModSmall(a, abs);
                quotient = arrayToSmall(value[0]);
                var remainder = value[1];
                if (self.sign) remainder = -remainder;
                if (typeof quotient === "number") {
                    if (self.sign !== n.sign) quotient = -quotient;
                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
                }
                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs);
        }
        var comparison = compareAbs(a, b);
        if (comparison === -1) return [Integer[0], self];
        if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

        // divMod1 is faster on smaller input sizes
        if (a.length + b.length <= 200)
            value = divMod1(a, b);
        else value = divMod2(a, b);

        quotient = value[0];
        var qSign = self.sign !== n.sign,
            mod = value[1],
            mSign = self.sign;
        if (typeof quotient === "number") {
            if (qSign) quotient = -quotient;
            quotient = new SmallInteger(quotient);
        } else quotient = new BigInteger(quotient, qSign);
        if (typeof mod === "number") {
            if (mSign) mod = -mod;
            mod = new SmallInteger(mod);
        } else mod = new BigInteger(mod, mSign);
        return [quotient, mod];
    }

    BigInteger.prototype.divmod = function (v) {
        var result = divModAny(this, v);
        return {
            quotient: result[0],
            remainder: result[1]
        };
    };
    SmallInteger.prototype.divmod = BigInteger.prototype.divmod;

    BigInteger.prototype.divide = function (v) {
        return divModAny(this, v)[0];
    };
    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

    BigInteger.prototype.mod = function (v) {
        return divModAny(this, v)[1];
    };
    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

    BigInteger.prototype.pow = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value,
            value, x, y;
        if (b === 0) return Integer[1];
        if (a === 0) return Integer[0];
        if (a === 1) return Integer[1];
        if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.sign) {
            return Integer[0];
        }
        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
        if (this.isSmall) {
            if (isPrecise(value = Math.pow(a, b)))
                return new SmallInteger(truncate(value));
        }
        x = this;
        y = Integer[1];
        while (true) {
            if (b & 1 === 1) {
                y = y.times(x);
                --b;
            }
            if (b === 0) break;
            b /= 2;
            x = x.square();
        }
        return y;
    };
    SmallInteger.prototype.pow = BigInteger.prototype.pow;

    BigInteger.prototype.modPow = function (exp, mod) {
        exp = parseValue(exp);
        mod = parseValue(mod);
        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
        var r = Integer[1],
            base = this.mod(mod);
        while (exp.isPositive()) {
            if (base.isZero()) return Integer[0];
            if (exp.isOdd()) r = r.multiply(base).mod(mod);
            exp = exp.divide(2);
            base = base.square().mod(mod);
        }
        return r;
    };
    SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

    function compareAbs(a, b) {
        if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
        }
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    }

    BigInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) return 1;
        return compareAbs(a, b);
    };
    SmallInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = Math.abs(this.value),
            b = n.value;
        if (n.isSmall) {
            b = Math.abs(b);
            return a === b ? 0 : a > b ? 1 : -1;
        }
        return -1;
    };

    BigInteger.prototype.compare = function (v) {
        // See discussion about comparison with Infinity:
        // https://github.com/peterolson/BigInteger.js/issues/61
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (this.sign !== n.sign) {
            return n.sign ? 1 : -1;
        }
        if (n.isSmall) {
            return this.sign ? -1 : 1;
        }
        return compareAbs(a, b) * (this.sign ? -1 : 1);
    };
    BigInteger.prototype.compareTo = BigInteger.prototype.compare;

    SmallInteger.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) {
            return a == b ? 0 : a > b ? 1 : -1;
        }
        if (a < 0 !== n.sign) {
            return a < 0 ? -1 : 1;
        }
        return a < 0 ? 1 : -1;
    };
    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

    BigInteger.prototype.equals = function (v) {
        return this.compare(v) === 0;
    };
    SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

    BigInteger.prototype.notEquals = function (v) {
        return this.compare(v) !== 0;
    };
    SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

    BigInteger.prototype.greater = function (v) {
        return this.compare(v) > 0;
    };
    SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

    BigInteger.prototype.lesser = function (v) {
        return this.compare(v) < 0;
    };
    SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

    BigInteger.prototype.greaterOrEquals = function (v) {
        return this.compare(v) >= 0;
    };
    SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

    BigInteger.prototype.lesserOrEquals = function (v) {
        return this.compare(v) <= 0;
    };
    SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

    BigInteger.prototype.isEven = function () {
        return (this.value[0] & 1) === 0;
    };
    SmallInteger.prototype.isEven = function () {
        return (this.value & 1) === 0;
    };

    BigInteger.prototype.isOdd = function () {
        return (this.value[0] & 1) === 1;
    };
    SmallInteger.prototype.isOdd = function () {
        return (this.value & 1) === 1;
    };

    BigInteger.prototype.isPositive = function () {
        return !this.sign;
    };
    SmallInteger.prototype.isPositive = function () {
        return this.value > 0;
    };

    BigInteger.prototype.isNegative = function () {
        return this.sign;
    };
    SmallInteger.prototype.isNegative = function () {
        return this.value < 0;
    };

    BigInteger.prototype.isUnit = function () {
        return false;
    };
    SmallInteger.prototype.isUnit = function () {
        return Math.abs(this.value) === 1;
    };

    BigInteger.prototype.isZero = function () {
        return false;
    };
    SmallInteger.prototype.isZero = function () {
        return this.value === 0;
    };
    BigInteger.prototype.isDivisibleBy = function (v) {
        var n = parseValue(v);
        var value = n.value;
        if (value === 0) return false;
        if (value === 1) return true;
        if (value === 2) return this.isEven();
        return this.mod(n).equals(Integer[0]);
    };
    SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

    function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit()) return false;
        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
        if (n.lesser(49)) return true;
        // we don't know if it's prime: let the other functions figure it out
    }
    
    function millerRabinTest(n, a) {
        var nPrev = n.prev(),
            b = nPrev,
            r = 0,
            d, t, i, x;
        while (b.isEven()) b = b.divide(2), r++;
        next : for (i = 0; i < a.length; i++) {
            if (n.lesser(a[i])) continue;
            x = bigInt(a[i]).modPow(b, n);
            if (x.equals(Integer[1]) || x.equals(nPrev)) continue;
            for (d = r - 1; d != 0; d--) {
                x = x.square().mod(n);
                if (x.isUnit()) return false;    
                if (x.equals(nPrev)) continue next;
            }
            return false;
        }
        return true;
    }
    
// Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
    BigInteger.prototype.isPrime = function (strict) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined) return isPrime;
        var n = this.abs();
        var bits = n.bitLength();
        if(bits <= 64)
            return millerRabinTest(n, [2, 325, 9375, 28178, 450775, 9780504, 1795265022]);
        var logN = Math.log(2) * bits;
        var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt(i + 2));
        }
        return millerRabinTest(n, a);
    };
    SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

    BigInteger.prototype.isProbablePrime = function (iterations) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined) return isPrime;
        var n = this.abs();
        var t = iterations === undefined ? 5 : iterations;
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt.randBetween(2, n.minus(2)));
        }
        return millerRabinTest(n, a);
    };
    SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

    BigInteger.prototype.modInv = function (n) {
        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.equals(bigInt.zero)) {
            q = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q.multiply(newT));
            newR = lastR.subtract(q.multiply(newR));
        }
        if (!r.equals(1)) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t.compare(0) === -1) {
            t = t.add(n);
        }
        if (this.isNegative()) {
            return t.negate();
        }
        return t;
    };

    SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

    BigInteger.prototype.next = function () {
        var value = this.value;
        if (this.sign) {
            return subtractSmall(value, 1, this.sign);
        }
        return new BigInteger(addSmall(value, 1), this.sign);
    };
    SmallInteger.prototype.next = function () {
        var value = this.value;
        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
        return new BigInteger(MAX_INT_ARR, false);
    };

    BigInteger.prototype.prev = function () {
        var value = this.value;
        if (this.sign) {
            return new BigInteger(addSmall(value, 1), true);
        }
        return subtractSmall(value, 1, this.sign);
    };
    SmallInteger.prototype.prev = function () {
        var value = this.value;
        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
        return new BigInteger(MAX_INT_ARR, true);
    };

    var powersOfTwo = [1];
    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

    function shift_isSmall(n) {
        return ((typeof n === "number" || typeof n === "string") && +Math.abs(n) <= BASE) ||
            (n instanceof BigInteger && n.value.length <= 1);
    }

    BigInteger.prototype.shiftLeft = function (n) {
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        n = +n;
        if (n < 0) return this.shiftRight(-n);
        var result = this;
        if (result.isZero()) return result;
        while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
    };
    SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

    BigInteger.prototype.shiftRight = function (n) {
        var remQuo;
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        n = +n;
        if (n < 0) return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
            if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
    };
    SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

    function bitwise(x, y, fn) {
        y = parseValue(y);
        var xSign = x.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x.not() : x,
            yRem = ySign ? y.not() : y;
        var xDigit = 0, yDigit = 0;
        var xDivMod = null, yDivMod = null;
        var result = [];
        while (!xRem.isZero() || !yRem.isZero()) {
            xDivMod = divModAny(xRem, highestPower2);
            xDigit = xDivMod[1].toJSNumber();
            if (xSign) {
                xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
            }

            yDivMod = divModAny(yRem, highestPower2);
            yDigit = yDivMod[1].toJSNumber();
            if (ySign) {
                yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
            }

            xRem = xDivMod[0];
            yRem = yDivMod[0];
            result.push(fn(xDigit, yDigit));
        }
        var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
        for (var i = result.length - 1; i >= 0; i -= 1) {
            sum = sum.multiply(highestPower2).add(bigInt(result[i]));
        }
        return sum;
    }

    BigInteger.prototype.not = function () {
        return this.negate().prev();
    };
    SmallInteger.prototype.not = BigInteger.prototype.not;

    BigInteger.prototype.and = function (n) {
        return bitwise(this, n, function (a, b) { return a & b; });
    };
    SmallInteger.prototype.and = BigInteger.prototype.and;

    BigInteger.prototype.or = function (n) {
        return bitwise(this, n, function (a, b) { return a | b; });
    };
    SmallInteger.prototype.or = BigInteger.prototype.or;

    BigInteger.prototype.xor = function (n) {
        return bitwise(this, n, function (a, b) { return a ^ b; });
    };
    SmallInteger.prototype.xor = BigInteger.prototype.xor;

    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
    function roughLOB(n) { // get lowestOneBit (rough)
        // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
        // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
        var v = n.value, x = typeof v === "number" ? v | LOBMASK_I : v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
    }

    function integerLogarithm(value, base) {
        if (base.compareTo(value) <= 0) {
            var tmp = integerLogarithm(value, base.square(base));
            var p = tmp.p;
            var e = tmp.e;
            var t = p.multiply(base);
            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
        }
        return { p: bigInt(1), e: 0 };
    }

    BigInteger.prototype.bitLength = function () {
        var n = this;
        if (n.compareTo(bigInt(0)) < 0) {
            n = n.negate().subtract(bigInt(1));
        }
        if (n.compareTo(bigInt(0)) === 0) {
            return bigInt(0);
        }
        return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
    }
    SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

    function max(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
    }
    function min(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
    }
    function gcd(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b)) return a;
        if (a.isZero()) return b;
        if (b.isZero()) return a;
        var c = Integer[1], d, t;
        while (a.isEven() && b.isEven()) {
            d = Math.min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
        }
        while (a.isEven()) {
            a = a.divide(roughLOB(a));
        }
        do {
            while (b.isEven()) {
                b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
                t = b; b = a; a = t;
            }
            b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
    }
    function lcm(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
    }
    function randBetween(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low).add(1);
        if (range.isSmall) return low.add(Math.floor(Math.random() * range));
        var length = range.value.length - 1;
        var result = [], restricted = true;
        for (var i = length; i >= 0; i--) {
            var top = restricted ? range.value[i] : BASE;
            var digit = truncate(Math.random() * top);
            result.unshift(digit);
            if (digit < top) restricted = false;
        }
        result = arrayToSmall(result);
        return low.add(typeof result === "number" ? new SmallInteger(result) : new BigInteger(result, false));
    }
    var parseBase = function (text, base) {
        var length = text.length;
        var i;
        var absBase = Math.abs(base);
        for (var i = 0; i < length; i++) {
            var c = text[i].toLowerCase();
            if (c === "-") continue;
            if (/[a-z0-9]/.test(c)) {
                if (/[0-9]/.test(c) && +c >= absBase) {
                    if (c === "1" && absBase === 1) continue;
                    throw new Error(c + " is not a valid digit in base " + base + ".");
                } else if (c.charCodeAt(0) - 87 >= absBase) {
                    throw new Error(c + " is not a valid digit in base " + base + ".");
                }
            }
        }
        if (2 <= base && base <= 36) {
            if (length <= LOG_MAX_INT / Math.log(base)) {
                var result = parseInt(text, base);
                if (isNaN(result)) {
                    throw new Error(c + " is not a valid digit in base " + base + ".");
                }
                return new SmallInteger(parseInt(text, base));
            }
        }
        base = parseValue(base);
        var digits = [];
        var isNegative = text[0] === "-";
        for (i = isNegative ? 1 : 0; i < text.length; i++) {
            var c = text[i].toLowerCase(),
                charCode = c.charCodeAt(0);
            if (48 <= charCode && charCode <= 57) digits.push(parseValue(c));
            else if (97 <= charCode && charCode <= 122) digits.push(parseValue(c.charCodeAt(0) - 87));
            else if (c === "<") {
                var start = i;
                do { i++; } while (text[i] !== ">");
                digits.push(parseValue(text.slice(start + 1, i)));
            }
            else throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
    };

    function parseBaseFromArray(digits, base, isNegative) {
        var val = Integer[0], pow = Integer[1], i;
        for (i = digits.length - 1; i >= 0; i--) {
            val = val.add(digits[i].times(pow));
            pow = pow.times(base);
        }
        return isNegative ? val.negate() : val;
    }

    function stringify(digit) {
        if (digit <= 35) {
            return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(digit);
        }
        return "<" + digit + ">";
    }

    function toBase(n, base) {
        base = bigInt(base);
        if (base.isZero()) {
            if (n.isZero()) return { value: [0], isNegative: false };
            throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
            if (n.isZero()) return { value: [0], isNegative: false };
            if (n.isNegative())
                return {
                    value: [].concat.apply([], Array.apply(null, Array(-n))
                        .map(Array.prototype.valueOf, [1, 0])
                    ),
                    isNegative: false
                };

            var arr = Array.apply(null, Array(+n - 1))
                .map(Array.prototype.valueOf, [0, 1]);
            arr.unshift([1]);
            return {
                value: [].concat.apply([], arr),
                isNegative: false
            };
        }

        var neg = false;
        if (n.isNegative() && base.isPositive()) {
            neg = true;
            n = n.abs();
        }
        if (base.equals(1)) {
            if (n.isZero()) return { value: [0], isNegative: false };

            return {
                value: Array.apply(null, Array(+n))
                    .map(Number.prototype.valueOf, 1),
                isNegative: neg
            };
        }
        var out = [];
        var left = n, divmod;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
            divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
                digit = base.minus(digit).abs();
                left = left.next();
            }
            out.push(digit.toJSNumber());
        }
        out.push(left.toJSNumber());
        return { value: out.reverse(), isNegative: neg };
    }

    function toBaseString(n, base) {
        var arr = toBase(n, base);
        return (arr.isNegative ? "-" : "") + arr.value.map(stringify).join('');
    }

    BigInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    SmallInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    BigInteger.prototype.toString = function (radix) {
        if (radix === undefined) radix = 10;
        if (radix !== 10) return toBaseString(this, radix);
        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
        while (--l >= 0) {
            digit = String(v[l]);
            str += zeros.slice(digit.length) + digit;
        }
        var sign = this.sign ? "-" : "";
        return sign + str;
    };

    SmallInteger.prototype.toString = function (radix) {
        if (radix === undefined) radix = 10;
        if (radix != 10) return toBaseString(this, radix);
        return String(this.value);
    };
    BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); }

    BigInteger.prototype.valueOf = function () {
        return parseInt(this.toString(), 10);
    };
    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

    SmallInteger.prototype.valueOf = function () {
        return this.value;
    };
    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;

    function parseStringValue(v) {
        if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
                return new SmallInteger(x);
            throw new Error("Invalid integer: " + v);
        }
        var sign = v[0] === "-";
        if (sign) v = v.slice(1);
        var split = v.split(/e/i);
        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
            var exp = split[1];
            if (exp[0] === "+") exp = exp.slice(1);
            exp = +exp;
            if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            var text = split[0];
            var decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
                exp -= text.length - decimalPlace - 1;
                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
            text += (new Array(exp + 1)).join("0");
            v = text;
        }
        var isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid) throw new Error("Invalid integer: " + v);
        var r = [], max = v.length, l = LOG_BASE, min = max - l;
        while (max > 0) {
            r.push(+v.slice(min, max));
            min -= l;
            if (min < 0) min = 0;
            max -= l;
        }
        trim(r);
        return new BigInteger(r, sign);
    }

    function parseNumberValue(v) {
        if (isPrecise(v)) {
            if (v !== truncate(v)) throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
    }

    function parseValue(v) {
        if (typeof v === "number") {
            return parseNumberValue(v);
        }
        if (typeof v === "string") {
            return parseStringValue(v);
        }
        return v;
    }
    // Pre-define numbers in range [-999,999]
    for (var i = 0; i < 1000; i++) {
        Integer[i] = new SmallInteger(i);
        if (i > 0) Integer[-i] = new SmallInteger(-i);
    }
    // Backwards compatibility
    Integer.one = Integer[1];
    Integer.zero = Integer[0];
    Integer.minusOne = Integer[-1];
    Integer.max = max;
    Integer.min = min;
    Integer.gcd = gcd;
    Integer.lcm = lcm;
    Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger; };
    Integer.randBetween = randBetween;

    Integer.fromArray = function (digits, base, isNegative) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
    };

    return Integer;
})();

// Node.js check
if (typeof module !== "undefined" && module.hasOwnProperty("exports")) {
    module.exports = bigInt;
}

//amd check
if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
        return bigInt;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/big-integer/BigInteger.js
var BigInteger = __webpack_require__(1);
var BigInteger_default = /*#__PURE__*/__webpack_require__.n(BigInteger);

// CONCATENATED MODULE: ./node_modules/gt-js-common/lib/coders/UnsignedLongCoder.js

class UnsignedLongCoder_UnsignedLongCoder {
    /**
     * Convert bytes to unsigned long
     * @param {Uint8Array} data byte array
     * @param {Number} offset read offset
     * @param {Number} length read length
     * @returns {BigInteger} long value
     */
    static decode(data, offset, length) {
        if (offset < 0 || length < 0 || (offset + length) > data.length) {
            throw new Error('Index out of bounds');
        }
        if (length > 8) {
            throw new Error('Integers of at most 63 unsigned bits supported by this implementation.');
        }
        let t = BigInteger_default.a.zero;
        for (let i = 0; i < length; ++i) {
            t = t.shiftLeft(8).or((data[offset + i] & 0xFF));
        }
        return t;
    }
    /**
     * Convert long to byte array
     * @param {BigInteger} value long value
     * @returns {Uint8Array} Array byte array
     */
    static encode(value) {
        let t;
        let n = 0;
        // @ts-ignore
        for (t = value; t > 0; t = t.shiftRight(8)) {
            ++n;
        }
        const result = new Array(n);
        // @ts-ignore
        for (t = value; t > 0; t = t.shiftRight(8)) {
            result[--n] = t.and(0xFF).toJSNumber();
        }
        return new Uint8Array(result);
    }
}

// CONCATENATED MODULE: ./src/parser/TlvTag.ts
var TlvTag = /** @class */ (function () {
    function TlvTag(type, nonCriticalFlag, forwardFlag, bytes) {
        var _newTarget = this.constructor;
        this.type = type;
        this.nonCriticalFlag = nonCriticalFlag;
        this.forwardFlag = forwardFlag;
        var valueBytes = new Uint8Array(bytes);
        this.getValueBytes = function () { return new Uint8Array(valueBytes); };
        if (_newTarget === TlvTag) {
            Object.freeze(this);
        }
    }
    return TlvTag;
}());
/* harmony default export */ var parser_TlvTag = (TlvTag);

// CONCATENATED MODULE: ./src/parser/IntegerTag.ts
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var IntegerTag_IntegerTag = /** @class */ (function (_super) {
    __extends(IntegerTag, _super);
    function IntegerTag(tlvTag) {
        var _this = this;
        var bytes = tlvTag.getValueBytes();
        _this = _super.call(this, tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, bytes) || this;
        _this.value = UnsignedLongCoder_UnsignedLongCoder.decode(bytes, 0, bytes.length);
        Object.freeze(_this);
        return _this;
    }
    IntegerTag.create = function (type, nonCriticalFlag, forwardFlag, value) {
        return new IntegerTag(new parser_TlvTag(type, nonCriticalFlag, forwardFlag, UnsignedLongCoder_UnsignedLongCoder.encode(BigInteger_default()(value))));
    };
    IntegerTag.prototype.getValue = function () {
        return this.value;
    };
    IntegerTag.prototype.toString = function () {
        var result = "TLV[0x" + this.type.toString(16);
        if (this.nonCriticalFlag) {
            result += ",N";
        }
        if (this.forwardFlag) {
            result += ",F";
        }
        result += "]:";
        result += "i" + this.value;
        return result;
    };
    return IntegerTag;
}(parser_TlvTag));
/* harmony default export */ var parser_IntegerTag = (IntegerTag_IntegerTag);

// CONCATENATED MODULE: ./node_modules/gt-js-common/lib/strings/ASCIIConverter.js
class ASCIIConverter {
    /**
     * Convert string to bytes
     * @param asciiString string
     * @returns {Uint8Array} byte array
     */
    static ToBytes(asciiString) {
        if (typeof asciiString !== 'string') {
            throw new Error('Invalid string');
        }
        const bytes = [];
        for (let i = 0; i < asciiString.length; i++) {
            bytes.push(asciiString.charCodeAt(i));
        }
        return new Uint8Array(bytes);
    }
    /**
     * Convert bytes to string
     * @param {Uint8Array} bytes
     * @returns string
     */
    static ToString(bytes) {
        if (!(bytes instanceof Uint8Array)) {
            throw new Error('Invalid byte array');
        }
        return String.fromCharCode.apply(null, bytes.subarray(0, bytes.length));
    }
}

// CONCATENATED MODULE: ./node_modules/gt-js-common/lib/coders/HexCoder.js

const BYTE_HEX_MAP = '0123456789ABCDEF';
const HEX_BYTE_MAP = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
};
class HexCoder_HexCoder {
    /**
     * Convert byte array to hex
     * @param {Uint8Array} data byte array
     * @returns string hex string
     */
    static encode(data) {
        if (!(data instanceof Uint8Array)) {
            throw new Error('Invalid array for converting to hex');
        }
        let hex = '';
        for (let i = 0; i < data.length; i++) {
            if (data[i] > 0xFF) {
                throw new Error('Invalid byte');
            }
            hex += BYTE_HEX_MAP[(data[i] & 0xF0) >> 4];
            hex += BYTE_HEX_MAP[data[i] & 0x0F];
        }
        return hex;
    }
    /**
     * Convert hex string to bytes
     * @param value hex string
     * @returns {Uint8Array} byte array
     */
    static decode(value) {
        if (typeof value !== 'string') {
            throw new Error('Invalid hex string');
        }
        if (value.length % 2 !== 0) {
            throw new Error('Octet string should have equal amount of characters');
        }
        const hex = value.toUpperCase();
        const result = [];
        for (let i = 0; i < hex.length; i += 2) {
            // @ts-ignore
            if (typeof HEX_BYTE_MAP[hex[i]] === 'undefined' || typeof HEX_BYTE_MAP[hex[i + 1]] === 'undefined') {
                throw new Error('Invalid HEX');
            }
            // @ts-ignore
            result.push((HEX_BYTE_MAP[hex[i]] << 4) + HEX_BYTE_MAP[hex[i + 1]]);
        }
        return new Uint8Array(result);
    }
    static encodeByteString(byteString) {
        return HexCoder_HexCoder.encode(ASCIIConverter.ToBytes(byteString));
    }
    static decodeToByteString(value) {
        return ASCIIConverter.ToString(HexCoder_HexCoder.decode(value));
    }
}

// CONCATENATED MODULE: ./src/parser/RawTag.ts
var RawTag_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var RawTag_RawTag = /** @class */ (function (_super) {
    RawTag_extends(RawTag, _super);
    function RawTag(tlvTag) {
        var _this = _super.call(this, tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes()) || this;
        _this.getValue = function () { return tlvTag.getValueBytes(); };
        Object.freeze(_this);
        return _this;
    }
    RawTag.create = function (type, nonCriticalFlag, forwardFlag, value) {
        return new RawTag(new parser_TlvTag(type, nonCriticalFlag, forwardFlag, value));
    };
    RawTag.prototype.toString = function () {
        var result = "TLV[0x" + this.type.toString(16);
        if (this.nonCriticalFlag) {
            result += ",N";
        }
        if (this.forwardFlag) {
            result += ",F";
        }
        result += "]:";
        result += HexCoder_HexCoder.encode(this.getValue());
        return result;
    };
    return RawTag;
}(parser_TlvTag));
/* harmony default export */ var parser_RawTag = (RawTag_RawTag);

// CONCATENATED MODULE: ./src/Constants.ts
var TlvStreamConstants = {
    ForwardFlagBit: 32,
    MaxType: 0x1fff,
    NonCriticalFlagBit: 64,
    Tlv16BitFlagBit: 128,
    TypeMask: 31,
};
var CertificateRecordConstants = {
    TagType: 0x702,
    CertificateIdTagType: 0x1,
    X509CertificateTagType: 0x2,
};
var PublicationDataConstants = {
    TagType: 0x10,
    PublicationHashTagType: 0x4,
    PublicationTimeTagType: 0x2,
};
var PublicationRecordConstants = {
    PublicationReferencesTagType: 0x9,
    PublicationRepositoryUriTagType: 0xa,
};
var PublicationsFileHeaderConstants = {
    TagType: 0x701,
    CreationTimeTagType: 0x2,
    RepositoryUriTagType: 0x3,
    VersionTagType: 0x1,
};
var PublicationsFileConstants = {
    CmsSignatureTagType: 0x704,
    PublicationRecordTagType: 0x703,
};

// CONCATENATED MODULE: ./node_modules/gt-js-common/lib/strings/StringUtils.js
/**
 * Add tab prefix to each line of string
 * @param value string
 * @returns string prefixed string
 */
const tabPrefix = (value) => {
    if (typeof (value) !== 'string') {
        throw new Error('Value not string');
    }
    let result = '';
    const lines = value.split('\n');
    for (let i = 0; i < lines.length; i++) {
        result += '    ';
        result += lines[i];
        if (i !== (lines.length - 1)) {
            result += '\n';
        }
    }
    return result;
};

// CONCATENATED MODULE: ./src/parser/TlvError.ts
var TlvError_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TlvError = /** @class */ (function (_super) {
    TlvError_extends(TlvError, _super);
    function TlvError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "TlvError";
        Object.setPrototypeOf(_this, TlvError.prototype);
        return _this;
    }
    return TlvError;
}(Error));
/* harmony default export */ var parser_TlvError = (TlvError);

// CONCATENATED MODULE: ./src/parser/TlvInputStream.ts



var TlvInputStream_TlvInputStream = /** @class */ (function () {
    function TlvInputStream(bytes) {
        this.data = new Uint8Array(bytes);
        this.position = 0;
        this.length = bytes.length;
    }
    TlvInputStream.prototype.getPosition = function () {
        return this.position;
    };
    TlvInputStream.prototype.getLength = function () {
        return this.length;
    };
    TlvInputStream.prototype.readTag = function () {
        var firstByte = this.readByte();
        var tlv16BitFlag = (firstByte & TlvStreamConstants.Tlv16BitFlagBit) !== 0;
        var forwardFlag = (firstByte & TlvStreamConstants.ForwardFlagBit) !== 0;
        var nonCriticalFlag = (firstByte & TlvStreamConstants.NonCriticalFlagBit) !== 0;
        var type = (firstByte & TlvStreamConstants.TypeMask) & 0xFF;
        var length;
        if (tlv16BitFlag) {
            type = (type << 8) | this.readByte();
            length = this.readShort();
        }
        else {
            length = this.readByte();
        }
        var data = this.read(length);
        return new parser_TlvTag(type, nonCriticalFlag, forwardFlag, data);
    };
    TlvInputStream.prototype.readByte = function () {
        if (this.length <= this.position) {
            throw new parser_TlvError("Could not read byte: Premature end of data");
        }
        return this.data[this.position++] & 0xFF;
    };
    TlvInputStream.prototype.readShort = function () {
        return (this.readByte() << 8) | this.readByte();
    };
    TlvInputStream.prototype.read = function (length) {
        if (this.length < (this.position + length)) {
            throw new parser_TlvError("Could not read " + length + " bytes: Premature end of data");
        }
        var data = this.data.subarray(this.position, this.position + length);
        this.position += length;
        return data;
    };
    return TlvInputStream;
}());
/* harmony default export */ var parser_TlvInputStream = (TlvInputStream_TlvInputStream);

// CONCATENATED MODULE: ./src/parser/TlvOutputStream.ts


var TlvOutputStream_TlvOutputStream = /** @class */ (function () {
    function TlvOutputStream() {
        this.data = new Uint8Array(0);
    }
    TlvOutputStream.prototype.getData = function () {
        return new Uint8Array(this.data);
    };
    TlvOutputStream.prototype.writeTag = function (tlvTag) {
        if (tlvTag.type > TlvStreamConstants.MaxType) {
            throw new parser_TlvError("Could not write TlvTag: Type is larger than max type");
        }
        var valueBytes = tlvTag.getValueBytes();
        if (valueBytes.length > 0xFFFF) {
            throw new parser_TlvError("Could not write TlvTag: Data length is too large");
        }
        var tlv16BitFlag = tlvTag.type > TlvStreamConstants.TypeMask || valueBytes.length > 0XFF;
        var firstByte = (tlv16BitFlag && TlvStreamConstants.Tlv16BitFlagBit)
            + (tlvTag.nonCriticalFlag && TlvStreamConstants.NonCriticalFlagBit)
            + (tlvTag.forwardFlag && TlvStreamConstants.ForwardFlagBit);
        if (tlv16BitFlag) {
            firstByte |= (tlvTag.type >> 8) & TlvStreamConstants.TypeMask;
            this.write(new Uint8Array([
                firstByte & 0xFF,
                tlvTag.type & 0xFF,
                (valueBytes.length >> 8) & 0xFF,
                valueBytes.length & 0xFF,
            ]));
        }
        else {
            firstByte |= (tlvTag.type & TlvStreamConstants.TypeMask);
            this.write(new Uint8Array([firstByte, valueBytes.length & 0xFF]));
        }
        this.write(valueBytes);
    };
    TlvOutputStream.prototype.write = function (data) {
        var combinedData = new Uint8Array(this.data.length + data.length);
        combinedData.set(this.data);
        combinedData.set(data, this.data.length);
        this.data = combinedData;
    };
    return TlvOutputStream;
}());
/* harmony default export */ var parser_TlvOutputStream = (TlvOutputStream_TlvOutputStream);

// CONCATENATED MODULE: ./src/parser/CompositeTag.ts
var CompositeTag_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var CompositeTag_CompositeTag = /** @class */ (function (_super) {
    CompositeTag_extends(CompositeTag, _super);
    function CompositeTag(tlvTag) {
        var _this = _super.call(this, tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes()) || this;
        _this.value = [];
        return _this;
    }
    CompositeTag.createCompositeTagTlv = function (type, nonCriticalFlag, forwardFlag, value) {
        var stream = new parser_TlvOutputStream();
        for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
            var tlvTag = value_1[_i];
            stream.writeTag(tlvTag);
        }
        return new parser_TlvTag(type, nonCriticalFlag, forwardFlag, stream.getData());
    };
    CompositeTag.parseTlvTag = function (tlvTag) {
        if (!tlvTag.nonCriticalFlag) {
            throw new parser_TlvError("Unknown TLV tag: " + tlvTag.type.toString(16));
        }
        return tlvTag;
    };
    CompositeTag.prototype.toString = function () {
        var result = "TLV[0x" + this.type.toString(16);
        if (this.nonCriticalFlag) {
            result += ",N";
        }
        if (this.forwardFlag) {
            result += ",F";
        }
        result += "]:\n";
        for (var i = 0; i < this.value.length; i++) {
            result += tabPrefix(this.value[i].toString());
            if (i < (this.value.length - 1)) {
                result += "\n";
            }
        }
        return result;
    };
    CompositeTag.prototype.decodeValue = function (create) {
        var valueBytes = this.getValueBytes();
        var stream = new parser_TlvInputStream(valueBytes);
        var position = 0;
        while (stream.getPosition() < stream.getLength()) {
            var tlvTag = create(stream.readTag(), position++);
            this.value.push(tlvTag);
            if (!this.tlvCount.hasOwnProperty(tlvTag.type)) {
                this.tlvCount[tlvTag.type] = 0;
            }
            this.tlvCount[tlvTag.type]++;
        }
    };
    CompositeTag.prototype.validateValue = function (validate) {
        validate(Object.assign({}, this.tlvCount));
    };
    return CompositeTag;
}(parser_TlvTag));
/* harmony default export */ var parser_CompositeTag = (CompositeTag_CompositeTag);

// CONCATENATED MODULE: ./src/publication/CertificateRecord.ts
var CertificateRecord_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var CertificateRecord_CertificateRecord = /** @class */ (function (_super) {
    CertificateRecord_extends(CertificateRecord, _super);
    function CertificateRecord(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.decodeValue(_this.create.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        Object.freeze(_this);
        return _this;
    }
    Object.defineProperty(CertificateRecord.prototype, "x509Certificate", {
        get: function () {
            return this._x509Certificate.getValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CertificateRecord.prototype, "certificateId", {
        get: function () {
            return this._certificateId.getValue();
        },
        enumerable: true,
        configurable: true
    });
    CertificateRecord.prototype.create = function (tlvTag) {
        switch (tlvTag.type) {
            case CertificateRecordConstants.CertificateIdTagType:
                return this._certificateId = new parser_RawTag(tlvTag);
            case CertificateRecordConstants.X509CertificateTagType:
                return this._x509Certificate = new parser_RawTag(tlvTag);
            default:
                return parser_CompositeTag.parseTlvTag(tlvTag);
        }
    };
    CertificateRecord.prototype.validate = function (tagCount) {
        if (tagCount[CertificateRecordConstants.CertificateIdTagType] !== 1) {
            throw new parser_TlvError("Certificate Id is missing.");
        }
        if (tagCount[CertificateRecordConstants.X509CertificateTagType] !== 1) {
            throw new parser_TlvError("Exactly one certificate must exist in certificate record.");
        }
    };
    return CertificateRecord;
}(parser_CompositeTag));
/* harmony default export */ var publication_CertificateRecord = (CertificateRecord_CertificateRecord);

// CONCATENATED MODULE: ./src/parser/StringTag.ts
var StringTag_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var StringTag_StringTag = /** @class */ (function (_super) {
    StringTag_extends(StringTag, _super);
    function StringTag(tlvTag) {
        var _this = this;
        var valueBytes = tlvTag.getValueBytes();
        if (valueBytes.length < 2) {
            throw new parser_TlvError("Invalid null terminated string length: " + valueBytes.length);
        }
        if (valueBytes[valueBytes.length - 1] !== 0) {
            throw new parser_TlvError("String must be null terminated");
        }
        _this = _super.call(this, tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, valueBytes) || this;
        _this.value = ASCIIConverter.ToString(valueBytes.slice(0, valueBytes.length - 1));
        Object.freeze(_this);
        return _this;
    }
    StringTag.create = function (type, nonCriticalFlag, forwardFlag, value) {
        return new StringTag(new parser_TlvTag(type, nonCriticalFlag, forwardFlag, ASCIIConverter.ToBytes(value + "\0")));
    };
    StringTag.prototype.getValue = function () {
        return this.value;
    };
    StringTag.prototype.toString = function () {
        var result = "TLV[0x" + this.type.toString(16);
        if (this.nonCriticalFlag) {
            result += ",N";
        }
        if (this.forwardFlag) {
            result += ",F";
        }
        result += "]:";
        result += "\"" + this.value + "\"";
        return result;
    };
    return StringTag;
}(parser_TlvTag));
/* harmony default export */ var parser_StringTag = (StringTag_StringTag);

// CONCATENATED MODULE: ./node_modules/gt-js-common/lib/hash/HashAlgorithm.js
class HashAlgorithm {
    /**
     * SHA1 HashAlgorithm instance
     * @return HashAlgorithm
     */
    static get SHA1() {
        return SHA1;
    }
    /**
     * SHA2_256 HashAlgorithm instance
     * @return HashAlgorithm
     */
    static get SHA2_256() {
        return SHA2_256;
    }
    /**
     * RIPEMD160 HashAlgorithm instance
     * @return HashAlgorithm
     */
    static get RIPEMD160() {
        return RIPEMD160;
    }
    /**
     * SHA2_224 HashAlgorithm instance
     * @return HashAlgorithm
     */
    static get SHA2_224() {
        return SHA2_224;
    }
    /**
     * SHA2_384 HashAlgorithm instance
     * @return HashAlgorithm
     */
    static get SHA2_384() {
        return SHA2_384;
    }
    /**
     * SHA2_512 HashAlgorithm instance
     * @return HashAlgorithm
     */
    static get SHA2_512() {
        return SHA2_512;
    }
    /**
     * SHA3_224 HashAlgorithm instance
     * @return HashAlgorithm
     */
    static get SHA3_224() {
        return SHA3_224;
    }
    /**
     * SHA3_256 HashAlgorithm instance
     * @return HashAlgorithm
     */
    static get SHA3_256() {
        return SHA3_256;
    }
    /**
     * SHA3_384 HashAlgorithm instance
     * @return HashAlgorithm
     */
    static get SHA3_384() {
        return SHA3_384;
    }
    /**
     * SHA3_512 HashAlgorithm instance
     * @return HashAlgorithm
     */
    static get SHA3_512() {
        return SHA3_512;
    }
    /**
     * SM3 HashAlgorithm instance
     * @return HashAlgorithm
     */
    static get SM3() {
        return SM3;
    }
    /**
     * Get HashAlgorithm by Guardtime algorithm ID
     * @returns HashAlgorithm|null
     */
    static getById(id) {
        const values = HashAlgorithm.Values();
        for (const i in values) {
            if (values[i].id == id) {
                return values[i];
            }
        }
        return null;
    }
    /**
     * Get list of HashAlgorithms
     * @returns Array HashAlgorithm array
     */
    static Values() {
        return [SHA1, SHA2_256, RIPEMD160, SHA2_224, SHA2_384, SHA2_512, SHA3_224, SHA3_256, SHA3_384, SHA3_512, SM3];
    }
    /**
     * Create HashAlgorithm instance from id, name, length
     * @param id Guardtime algorithm id
     * @param name algorithm name
     * @param length algorithm digest length
     */
    constructor(id, name, length) {
        this.id = id;
        this.name = name;
        this.length = length;
    }
}
const SHA1 = new HashAlgorithm(0x0, 'SHA-1', 20);
const SHA2_256 = new HashAlgorithm(0x1, 'SHA-256', 32);
const RIPEMD160 = new HashAlgorithm(0x2, 'RIPEMD160', 20);
const SHA2_224 = new HashAlgorithm(0x3, 'SHA-224', 28);
const SHA2_384 = new HashAlgorithm(0x4, 'SHA-384', 48);
const SHA2_512 = new HashAlgorithm(0x5, 'SHA-512', 64);
const SHA3_224 = new HashAlgorithm(0x7, 'SHA3-224', 28);
const SHA3_256 = new HashAlgorithm(0x8, 'SHA3-256', 32);
const SHA3_384 = new HashAlgorithm(0x9, 'SHA3-384', 48);
const SHA3_512 = new HashAlgorithm(0xA, 'SHA3-512', 64);
const SM3 = new HashAlgorithm(0xB, 'SM3', 32);

// CONCATENATED MODULE: ./node_modules/gt-js-common/lib/hash/DataHash.js


class DataHash_DataHash {
    /**
     * Create DataHash instance with imprint
     * @param {Uint8Array} bytes byte array
     */
    constructor(bytes) {
        if (!(bytes instanceof Uint8Array)) {
            throw new Error('Invalid imprint bytes');
        }
        let algorithm = HashAlgorithm.getById(bytes[0]);
        if (algorithm === null) {
            throw Error(`Invalid algorithm id: ${bytes[0]}`);
        }
        this.hashAlgorithm = algorithm;
        if (this.hashAlgorithm == null) {
            throw new Error('Invalid HashAlgorithm');
        }
        this.value = new Uint8Array(bytes.subarray(1));
        if (this.value.length != this.hashAlgorithm.length) {
            throw new Error('Invalid algorithm data length');
        }
        this.imprint = new Uint8Array(bytes);
        Object.freeze(this);
    }
    /**
     * Create DataHash instance with algorithm and hash
     * @param hashAlgorithm HashAlgorithm
     * @param value byte array
     */
    static create(hashAlgorithm, value) {
        if (!(hashAlgorithm instanceof HashAlgorithm)) {
            throw new Error('Invalid HashAlgorithm');
        }
        if (!(value instanceof Uint8Array)) {
            throw new Error('Invalid value');
        }
        const bytes = new Uint8Array(value.length + 1);
        bytes[0] = hashAlgorithm.id;
        bytes.set(value, 1);
        return new DataHash_DataHash(bytes);
    }
    /**
     * @param {DataHash} x
     * @param {DataHash} y
     * @returns {boolean}
     */
    static equals(x, y) {
        if (!(x instanceof DataHash_DataHash) || !(y instanceof DataHash_DataHash)) {
            return false;
        }
        if (x.imprint.length != y.imprint.length) {
            return false;
        }
        for (let i = 0; i < x.imprint.length; i++) {
            if (x.imprint[i] !== y.imprint[i]) {
                return false;
            }
        }
        return true;
    }
    toString() {
        // return this.hashAlgorithm.name + ":[" + Util.bytesToHex(this.value) + "]";
        return HexCoder_HexCoder.encode(this.imprint);
    }
    equals(other) {
        return DataHash_DataHash.equals(this, other);
    }
}

// CONCATENATED MODULE: ./src/parser/ImprintTag.ts
var ImprintTag_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var ImprintTag_ImprintTag = /** @class */ (function (_super) {
    ImprintTag_extends(ImprintTag, _super);
    function ImprintTag(tlvTag) {
        var _this = this;
        var valueBytes = tlvTag.getValueBytes();
        _this = _super.call(this, tlvTag.type, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, valueBytes) || this;
        _this.value = new DataHash_DataHash(valueBytes);
        Object.freeze(_this);
        return _this;
    }
    ImprintTag.create = function (type, nonCriticalFlag, forwardFlag, value) {
        return new ImprintTag(new parser_TlvTag(type, nonCriticalFlag, forwardFlag, value.imprint));
    };
    ImprintTag.prototype.getValue = function () {
        return this.value;
    };
    ImprintTag.prototype.toString = function () {
        var result = "TLV[0x" + this.type.toString(16);
        if (this.nonCriticalFlag) {
            result += ",N";
        }
        if (this.forwardFlag) {
            result += ",F";
        }
        result += "]:";
        result += this.value.toString();
        return result;
    };
    return ImprintTag;
}(parser_TlvTag));
/* harmony default export */ var parser_ImprintTag = (ImprintTag_ImprintTag);

// CONCATENATED MODULE: ./src/publication/PublicationData.ts
var PublicationData_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var PublicationData_PublicationData = /** @class */ (function (_super) {
    PublicationData_extends(PublicationData, _super);
    function PublicationData(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.decodeValue(_this.create.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        Object.freeze(_this);
        return _this;
    }
    Object.defineProperty(PublicationData.prototype, "publicationHash", {
        get: function () {
            return this._publicationHash.getValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublicationData.prototype, "publicationTime", {
        get: function () {
            return this._publicationTime.getValue();
        },
        enumerable: true,
        configurable: true
    });
    PublicationData.prototype.create = function (tlvTag) {
        switch (tlvTag.type) {
            case CertificateRecordConstants.CertificateIdTagType:
                return this._publicationTime = new parser_IntegerTag(tlvTag);
            case CertificateRecordConstants.X509CertificateTagType:
                return this._publicationHash = new parser_ImprintTag(tlvTag);
            default:
                return parser_CompositeTag.parseTlvTag(tlvTag);
        }
    };
    PublicationData.prototype.validate = function (tagCount) {
        if (tagCount[PublicationDataConstants.PublicationTimeTagType] !== 1) {
            throw new parser_TlvError("Exactly one publication time must exist in publication data.");
        }
        if (tagCount[PublicationDataConstants.PublicationHashTagType] !== 1) {
            throw new parser_TlvError("Exactly one publication hash must exist in publication data.");
        }
    };
    return PublicationData;
}(parser_CompositeTag));
/* harmony default export */ var publication_PublicationData = (PublicationData_PublicationData);

// CONCATENATED MODULE: ./src/publication/PublicationRecord.ts
var PublicationRecord_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var PublicationRecord_PublicationRecord = /** @class */ (function (_super) {
    PublicationRecord_extends(PublicationRecord, _super);
    function PublicationRecord(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.decodeValue(_this.create.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        Object.freeze(_this);
        return _this;
    }
    Object.defineProperty(PublicationRecord.prototype, "publicationHash", {
        get: function () {
            return this.publicationData.publicationHash;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublicationRecord.prototype, "publicationTime", {
        get: function () {
            return this.publicationData.publicationTime;
        },
        enumerable: true,
        configurable: true
    });
    PublicationRecord.prototype.create = function (tlvTag) {
        switch (tlvTag.type) {
            case PublicationDataConstants.TagType:
                return this.publicationData = new publication_PublicationData(tlvTag);
            case PublicationRecordConstants.PublicationReferencesTagType:
                var reference = new parser_StringTag(tlvTag);
                this.publicationReferences.push(reference);
                return reference;
            case PublicationRecordConstants.PublicationRepositoryUriTagType:
                var uri = new parser_StringTag(tlvTag);
                this.repositoryUri.push(uri);
                return uri;
            default:
                return parser_CompositeTag.parseTlvTag(tlvTag);
        }
    };
    PublicationRecord.prototype.validate = function (tagCount) {
        if (tagCount[PublicationDataConstants.TagType] !== 1) {
            throw new parser_TlvError("Exactly one publication data must exist in publication record.");
        }
    };
    return PublicationRecord;
}(parser_CompositeTag));
/* harmony default export */ var publication_PublicationRecord = (PublicationRecord_PublicationRecord);

// CONCATENATED MODULE: ./src/publication/PublicationsFileError.ts
var PublicationsFileError_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PublicationsFileError = /** @class */ (function (_super) {
    PublicationsFileError_extends(PublicationsFileError, _super);
    function PublicationsFileError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "PublicationsFileError";
        Object.setPrototypeOf(_this, PublicationsFileError.prototype);
        return _this;
    }
    return PublicationsFileError;
}(Error));
/* harmony default export */ var publication_PublicationsFileError = (PublicationsFileError);

// CONCATENATED MODULE: ./src/publication/PublicationsFileHeader.ts
var PublicationsFileHeader_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var PublicationsFileHeader_PublicationsFileHeader = /** @class */ (function (_super) {
    PublicationsFileHeader_extends(PublicationsFileHeader, _super);
    function PublicationsFileHeader(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.decodeValue(_this.create.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        Object.freeze(_this);
        return _this;
    }
    PublicationsFileHeader.prototype.create = function (tlvTag) {
        switch (tlvTag.type) {
            case PublicationsFileHeaderConstants.VersionTagType:
                return this.version = new parser_IntegerTag(tlvTag);
            case PublicationsFileHeaderConstants.CreationTimeTagType:
                return this.creationTime = new parser_IntegerTag(tlvTag);
            case PublicationsFileHeaderConstants.RepositoryUriTagType:
                return this.repositoryUri = new parser_StringTag(tlvTag);
            default:
                return parser_CompositeTag.parseTlvTag(tlvTag);
        }
    };
    PublicationsFileHeader.prototype.validate = function (tagCount) {
        if (tagCount[PublicationsFileHeaderConstants.VersionTagType] !== 1) {
            throw new parser_TlvError("Exactly one version must exist in publications file header.");
        }
        if (tagCount[PublicationsFileHeaderConstants.CreationTimeTagType] !== 1) {
            throw new parser_TlvError("Exactly one creation time must exist in publications file header.");
        }
        if (tagCount[PublicationsFileHeaderConstants.RepositoryUriTagType] > 1) {
            throw new parser_TlvError("Only one repository uri is allowed in publications file header.");
        }
    };
    return PublicationsFileHeader;
}(parser_CompositeTag));
/* harmony default export */ var publication_PublicationsFileHeader = (PublicationsFileHeader_PublicationsFileHeader);

// CONCATENATED MODULE: ./src/publication/PublicationsFile.ts
var PublicationsFile_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();








var PublicationsFile_PublicationsFile = /** @class */ (function (_super) {
    PublicationsFile_extends(PublicationsFile, _super);
    function PublicationsFile(tlvTag) {
        var _this = _super.call(this, tlvTag) || this;
        _this.headerIndex = 0;
        _this.lastCertificateRecordIndex = 0;
        _this.firstPublicationRecordIndex = 0;
        _this.cmsSignatureIndex = 0;
        _this.decodeValue(_this.create.bind(_this));
        _this.validateValue(_this.validate.bind(_this));
        Object.freeze(_this);
        return _this;
    }
    PublicationsFile.prototype.findCertificateById = function (certificateId) {
        // TODO: Check input param
        var certificateIdString = JSON.stringify(certificateId);
        for (var _i = 0, _a = this.certificateRecordList; _i < _a.length; _i++) {
            var certificateRecord = _a[_i];
            if (certificateIdString === JSON.stringify(certificateRecord.certificateId)) {
                return certificateRecord;
            }
        }
        return null;
    };
    PublicationsFile.prototype.getLatestPublication = function () {
        var latestPublicationRecord = null;
        for (var _i = 0, _a = this.publicationRecordList; _i < _a.length; _i++) {
            var publicationRecord = _a[_i];
            if (latestPublicationRecord === null) {
                latestPublicationRecord = publicationRecord;
                continue;
            }
            if (publicationRecord.publicationTime.compareTo(latestPublicationRecord.publicationTime) > 0) {
                latestPublicationRecord = publicationRecord;
            }
        }
        return latestPublicationRecord;
    };
    PublicationsFile.prototype.getNearestPublicationRecord = function (unixTime) {
        var nearestPublicationRecord = null;
        for (var _i = 0, _a = this.publicationRecordList; _i < _a.length; _i++) {
            var publicationRecord = _a[_i];
            var publicationTime = publicationRecord.publicationTime;
            if (publicationTime.compareTo(unixTime) < 0) {
                continue;
            }
            if (nearestPublicationRecord == null) {
                nearestPublicationRecord = publicationRecord;
                continue;
            }
            if (publicationTime.compareTo(nearestPublicationRecord.publicationTime) < 0) {
                nearestPublicationRecord = publicationRecord;
            }
        }
        return nearestPublicationRecord;
    };
    PublicationsFile.prototype.getSignatureValue = function () {
        return this.cmsSignature.getValue();
    };
    PublicationsFile.prototype.getSignedBytes = function () {
        var stream = new parser_TlvOutputStream();
        stream.write(PublicationsFile.FileBeginningMagicBytes);
        for (var _i = 0, _a = this.value; _i < _a.length; _i++) {
            var tlvTag = _a[_i];
            stream.writeTag(tlvTag);
        }
        return stream.getData();
    };
    PublicationsFile.prototype.create = function (tlvTag, position) {
        switch (tlvTag.type) {
            case PublicationsFileHeaderConstants.TagType:
                this.headerIndex = position;
                return this.publicationsFileHeader = new publication_PublicationsFileHeader(tlvTag);
            case CertificateRecordConstants.TagType:
                this.lastCertificateRecordIndex = position;
                var certificateRecord = new publication_CertificateRecord(tlvTag);
                this.certificateRecordList.push(certificateRecord);
                return certificateRecord;
            case PublicationsFileConstants.PublicationRecordTagType:
                if (this.firstPublicationRecordIndex === 0) {
                    this.firstPublicationRecordIndex = position;
                }
                var publicationRecord = new publication_PublicationRecord(tlvTag);
                this.publicationRecordList.push(publicationRecord);
                return publicationRecord;
            case PublicationsFileConstants.CmsSignatureTagType:
                this.cmsSignatureIndex = position;
                return this.cmsSignature = new parser_RawTag(tlvTag);
            default:
                return parser_CompositeTag.parseTlvTag(tlvTag);
        }
    };
    PublicationsFile.prototype.validate = function (tagCount) {
        if (this.headerIndex !== 0) {
            throw new publication_PublicationsFileError("Publications file header should be the first element in publications file.");
        }
        if (this.firstPublicationRecordIndex <= this.lastCertificateRecordIndex) {
            throw new publication_PublicationsFileError("Certificate records should be before publication records.");
        }
        if (this.cmsSignatureIndex !== this.value.length - 1) {
            throw new publication_PublicationsFileError("Cms signature should be last element in publications file.");
        }
        if (tagCount[PublicationsFileHeaderConstants.TagType] !== 1) {
            throw new publication_PublicationsFileError("Exactly one publications file header must exist in publications file.");
        }
        if (tagCount[PublicationsFileConstants.CmsSignatureTagType] !== 1) {
            throw new publication_PublicationsFileError("Exactly one signature must exist in publications file.");
        }
    };
    PublicationsFile.FileBeginningMagicBytes = new Uint8Array([0x4b, 0x53, 0x49, 0x50, 0x55, 0x42, 0x4c, 0x46]);
    return PublicationsFile;
}(parser_CompositeTag));
/* harmony default export */ var publication_PublicationsFile = (PublicationsFile_PublicationsFile);

// CONCATENATED MODULE: ./src/publication/PublicationsFileFactory.ts



var PublicationsFileFactory_PublicationsFileFactory = /** @class */ (function () {
    function PublicationsFileFactory() {
    }
    PublicationsFileFactory.prototype.create = function (publicationFileBytes) {
        if (JSON.stringify(publicationFileBytes.slice(0, publication_PublicationsFile.FileBeginningMagicBytes.length - 1)) ===
            JSON.stringify(publication_PublicationsFile.FileBeginningMagicBytes)) {
            throw new publication_PublicationsFileError("Publications file header is incorrect. Invalid publications file magic bytes.");
        }
        var publicationsFile = new publication_PublicationsFile(parser_RawTag.create(0x0, false, false, publicationFileBytes.slice(publication_PublicationsFile.FileBeginningMagicBytes.length)));
        // TODO: Verification
        return publicationsFile;
    };
    return PublicationsFileFactory;
}());
/* harmony default export */ var publication_PublicationsFileFactory = (PublicationsFileFactory_PublicationsFileFactory);

// CONCATENATED MODULE: ./src/main.ts
/* concated harmony reexport IntegerTag */__webpack_require__.d(__webpack_exports__, "IntegerTag", function() { return parser_IntegerTag; });
/* concated harmony reexport PublicationsFileFactory */__webpack_require__.d(__webpack_exports__, "PublicationsFileFactory", function() { return publication_PublicationsFileFactory; });




/***/ })
/******/ ]);
});