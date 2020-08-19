var txt ="{ANANKETEANODE005:[Humidity: 99.90 %    83.60 %  , Temperature : 31.20 *C       31.00 *C]}";

var dto={};
var splitArr = txt.split(':');

dto.node_id = splitArr[0].substring(1, splitArr[0].length);
dto.top_humidity = parseFloat(splitArr[2].split("%")[0]);
dto.bottom_humidity = parseFloat(splitArr[2].split("%")[1]);
dto.top_temperature = parseFloat(splitArr[3].split("*C")[0]);
dto.bottom_temperature = parseFloat(splitArr[3].split("*C")[1]);
