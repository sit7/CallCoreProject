var crossdMixins = {
    methods: {
        truncateNumber: function (value, precision) {
            var power = Math.pow(10, precision || 0);
            var result = +(Math.round(value * power) / power);
            return result;
        },

        notNegative: function (rule, value, callback) {

            if (value < 0) {
                callback(new Error("Значение не может быть мньше 0"));
            } else {
                callback();
            }
        },

        validateFloatNumber: function (rule, value, callback) {
            var result = +(("" + value).replace(",", "."));
            if (!Number.isNaN(result)) {
                value = result;
                callback();
            } else {
                callback(new Error("Значение должно быть числом"));
            }
            callback();
        },

        validateFloatNumberOrNull: function (rule, value, callback) {
        	var result = +(("" + value).replace(",", "."));
        	if (!Number.isNaN(result) || result === 0 || value === null) {
        		value = result;
        		callback();
        	} else {
        		callback(new Error("Значение должно быть числом"));
        	}
        	callback();
        },

        biggerThanZero: function (rule, value, callback) {
            var result = +(("" + value).replace(",", "."));
            if (value <= 0) {
                callback(new Error("Значение должно быть больше 0"));
            } else {
                callback();
            }
        },

        contractSum: function (rule, value, callback) {
            var result = +(("" + value).replace(",", "."));
            var condition = (value > 0) && (value <= 100000);
            if (!condition) {
                callback(new Error("Значение должно быть больше 0 и меньше 100 000"));
            } else {
                callback();
            }
        },

        number: function (rule, value, callback) {
            if (!Number.isNaN(+value)) {
                callback(new Error("Значение должно быть числом"));
            } else {
                callback();
            }
        },

        generateRecordStatusClass: function (item) {
            if (item && item.row) {
                if (item.row.RecordStatusID === 2) {
                    return "delete";
                }

                if (item.row.RecordStatusID === 1) {
                    return "";
                }
            }
            return "";
        },

        cloneData: function (data) {
            return JSON.parse(JSON.stringify(data));
        },

        parseDate: function (data) {
            return moment(data).toISOString();
        },

        generateUid: function () {
            var uid = 1 * Number.parseInt(("" + Date.now()).substr(-7));
            console.log(uid);
            return uid;
        },

        validateInn: function (rule, inn, callback) {
            var result = false;

            if (typeof inn === 'number') {
                inn = inn.toString();
            } else if (typeof inn !== 'string') {
                inn = '';
            }
            if (!inn.length) {
                callback('ИНН пуст');
            } else if (/[^0-9]/.test(inn)) {
                callback('ИНН может состоять только из цифр');
            } else if ([10, 12].indexOf(inn.length) === -1) {
                callback('ИНН может состоять только из 10 или 12 цифр');
            } else {
                var checkDigit = function (inn, coefficients) {
                    var n = 0;
                    for (var i in coefficients) {
                        n += coefficients[i] * inn[i];
                    }
                    
                    return parseInt(n % 11 % 10);

                };
                switch (inn.length) {
                case 10:
                    var n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
                        if (n10 === parseInt(inn[9])) {
                            result = true;
                        }
                    break;
                case 12:
                    var n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                    var n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                    if ((n11 === parseInt(inn[10])) && (n12 === parseInt(inn[11]))) {
                        callback();
                    }
                    break;
                }
                if (!result) {
                    callback(new Error('Неправильное контрольное число'));
                }
            }
            callback();
        },

        validateKpp: function(rule, kpp, callback) {
            var result = false;
            if (typeof kpp === 'number') {
                kpp = kpp.toString();
            } else if (typeof kpp !== 'string') {
                kpp = '';
            }
            if (!kpp.length) {
                callback(new ERROR('КПП пуст'));
            } else if (kpp.length !== 9) {
                callback(new ERROR('КПП может состоять только из 9 знаков (цифр или заглавных букв латинского алфавита от A до Z)'));
            } else if (!/^[0-9]{4}[0-9A-Z]{2}[0-9]{3}$/.test(kpp)) {
                callback(new Error('Неправильный формат КПП'));
            }
            callback();

        }
    }
}

// эту штуку добавлять в mixins компонента-приложения
var jsonmixins = {
    methods: {
        
    },
    created: function () {
        // переопределим метод сериализации дат
        // в полученным виде они уйдут в контроллер
        Date.prototype.toJSON = function () {
            var timezoneOffsetInHours = -(this.getTimezoneOffset() / 60); //UTC minus local time
            var sign = timezoneOffsetInHours >= 0 ? '+' : '-';
            var leadingZero = (Math.abs(timezoneOffsetInHours) < 10) ? '0' : '';

            //It's a bit unfortunate that we need to construct a new Date instance 
            //(we don't want _this_ Date instance to be modified)
            var correctedDate = new Date(this.getFullYear(), this.getMonth(),
                this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(),
                this.getMilliseconds());
            correctedDate.setHours(this.getHours() + timezoneOffsetInHours);
            var iso = correctedDate.toISOString().replace('Z', '');

            return iso + sign + leadingZero + Math.abs(timezoneOffsetInHours).toString() + ':00';
        };
    }
}