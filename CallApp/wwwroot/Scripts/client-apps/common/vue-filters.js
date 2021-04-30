Vue.filter("date", function (value, format) {
    if (!value) return "";
    if(!format) format = 'DD.MM.YYYY';
    return moment(value).format(format);
})

Vue.filter("noData", function (value, caption) {
    if (value) return value;

    if (caption) return caption;
    return "нет данных";
})


Vue.filter("round", function (value, precision) {
    var power = Math.pow(10, precision || 0);
    var result = +(Math.round(value * power) / power);
    return result;
}),

Vue.filter("money", function (value, format) {
    
    if (isNaN(value)) return "";
    if (!format) {
        format = '0,0.00';
    }
    var result = numeral(value).format(format).replace(","," ");
    return result;
})

Vue.filter("number", function (value, precision) {
    var afterDotchars = precision;
    precision = Math.pow(10, precision);
    var zero = "0";
    var truncatedValue = (Math.round(value * precision) / precision).toString();
    var valueParts = truncatedValue.split(".");
    if (!valueParts[1]) {
        valueParts[1] = "";
    }
    valueParts[1] = valueParts[1] +""+ zero.repeat(afterDotchars);
    valueParts[1] = valueParts[1].substr(0, afterDotchars);
    return valueParts[0] + "." + valueParts[1];
})