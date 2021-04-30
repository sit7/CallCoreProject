
// форматирование чисел
function toFixed(value, precision) {
    var power = Math.pow(10, precision || 0);
    return (Math.round(value * power) / power).toLocaleString('ru-RU', { minimumFractionDigits: precision }).replace('.', ',');
}

function rowSum(rowdata) {
    var sumVat = (rowdata['Price'] * rowdata['Amount'] * (rowdata['VATRate'] / 100));
    var sum = rowdata['Price'] * rowdata['Amount'];
    var result = sum + sumVat;
    return result;
}

function truncateNumber(value, precision) {
    var power = Math.pow(10, precision || 0);
    var result = +(Math.round(value * power) / power).toLocaleString('en-US', { minimumFractionDigits: precision });
    return result;
}


// функция на замену
var formatcell = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
    if (!rowdata.EatingTimeID) rowdata.EatingTimeID = 0;
    var formattedValue;
    switch (columnfield) {
        // сумма с НДС в приходных документах
        case 'AmountInUnits': formattedValue = toFixed(rowdata['MeasureUnit'] * rowdata['Amount'], 3);
            break;
        case 'matAmountInUnits': formattedValue = toFixed(rowdata['RecalcUnit'] * rowdata['Amount'], 3);
            break;
        case 'Summ': formattedValue = toFixed(rowdata['Price'] * rowdata['Amount'], 2);
                              break;
        case 'SummVat': formattedValue = toFixed((rowdata['Price'] * rowdata['Amount'] * (rowdata['VATRate'] / 100)), 2);
                              break;
        case 'Summa': formattedValue = toFixed(rowdata['Summa'], 2);
            break;
        //case "SummTotal": formattedValue = toFixed(rowSum(rowdata), 2);
        //    break;
        case "Value": formattedValue = toFixed(value, 2);
            break;
        //case "Price": formattedValue = toFixed(rowdata["SummTotal"] / (rowdata['Amount'] * (1 + rowdata["VATRate"] / 100)),4);
        //    break;
        case "Brutto":
            if (rowdata['PercentValue'] == null || rowdata['PercentValue'] === '')
                formattedValue = toFixed(rowdata['Netto'] * 100 / (100 - rowdata['FoodLoss']) *100/ (rowdata['isBoilLoss']===0 ? 100 : (100 - rowdata['BoilLoss'])), 2);
                else formattedValue = toFixed(rowdata['Netto'] * 100 / (100 - rowdata['PercentValue']), 2);
            break;
        case "EatingTimeID": return '<div style="height: 100%; width: 100%;background-color: ' +
                                    times[rowdata.EatingTimeID].color + '"><span style="margin: 4px; float: ' +
                                    columnproperties.cellsalign + '">' + value + '</span></div>';
            break;
        case "RecordStatusID": if (rowdata.ParentMenuCategoryTimeRecipeID) {
                                    return "<div style='height: 100%; background-color: white'><span></span></div>";
                               } else {
                                    return "<div style='height: 100%; background-color: #eee'><span></span></div>";
                               }
                               break;
        default: formattedValue = value;
    }
    if (!columnfield) formattedValue = toFixed(rowdata['Amount'] * rowdata['MeasureUnit'], 3);
    if(rowdata.ParentMenuCategoryTimeRecipeID) return "<div style='height: 100%; background-color: white'><span></span></div>";
    return '<div class="jqx-grid-cell-right-align" style="margin-top: 6px;"><span>' + formattedValue + '</span></div>';
};

// присваивание класса ячейки грида, в зависимости от RecordStatusID
function formatRecordStatus(row, column, value, data) {
    var columnProperties = this.getcolumnproperties();
    var addedClasses = "";

    if(data.RecordStatusID == 3) addedClasses += " newCellFormat ";
    if (!columnProperties.editable && column != "RecipeID") addedClasses += " disabledCellFormat ";
    if (data.ParentMenuCategoryTimeRecipeID && column != "Netto" && column != "EatingTimeID") addedClasses += " allergicFormat ";
  
    return addedClasses;
};

var getLocalization = function () {
    var localizationobj = {};
    localizationobj.decimalseparator = ",";
    localizationobj.thousandsseparator = " ";
    localizationobj.days = {
        names: ["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"],
        namesAbbr: ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],
        namesShort: ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]
    };
    localizationobj.months = {
        names: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь", ""],
        namesAbbr: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек", ""]
    };
    return localizationobj;
};

var formatDate = function(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();

    return dd + '.' + mm + '.' + yy;
};

var formatDateEn = function (date, symbol) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();

    return mm + symbol + dd + symbol + yy;
};
function cloneObject(obj) {
    var key = {};
    var clone = [];
    for (key in obj) if (obj.hasOwnProperty(key)) clone[key] = obj[key];
    return clone;
}

// общая функция для инициализация виджета корзины для удаления в гриде
function createDeleteButton(gridID, htmlElement, row) {
    var button = $("<div style='border:none;'><span class='glyphicon glyphicon-trash trash-icon' style='margin: auto'></span></div>");
    $(htmlElement).append(button);
    button.jqxButton({ height: '100%', width: '100%' });
    $(htmlElement).find('.trash-icon')[0].style.marginTop = "4px";
    $(htmlElement).find('.trash-icon')[0].style.marginRight = "5px";
    //$(".trash-icon").jqxTooltip({ content: '<b>Удалить</b>', position: 'mouse', name: 'movieTooltip' });
    button.click(function (event) {
        var id = row.bounddata.uid;
        if (row.bounddata.ObjectID == 0) return;
        var rs = row.bounddata.RecordStatusID;
        if (rs == 2) {
            alert("Удаляем уже удаленную строку!");
            $(gridID).jqxGrid("deleterow", id);
        }
        var commit = $(gridID).jqxGrid("setcellvalue", row.boundindex, "RecordStatusID", 2);
        if (commit == true) {
            $(gridID).jqxGrid("deleterow", id);
        }
    });
}

// функция для сортировки элементов меню по дате
window.compareNumeric = function (a, b) {
    if (+a.text.slice(6, -2) > +b.text.slice(6, -2)) return 1;
    if (+a.text.slice(6, -2) < +b.text.slice(6, -2)) return -1;
}
window.compareWords = function (a, b) {
    if (a.text > b.text) return 1;
    if (a.text < b.text) return -1;
}

// функции для клавиатурной навигации

function makeColumnArray(columns) {
    return columns.map(function (item) {
        var obj = {};
        obj.datafield = item.datafield;
        obj.editable = item.editable == false ? false : item.datafield == "Delete" ? false : true;
        obj.editor = item.createeditor ? true : false;
        return obj;
    })
}

function checkInputCaret(event, key, columns, datafieldIndex, index, grid) {
    if (!columns[datafieldIndex].editor) {
        if (event.target.selectionEnd == 0 && key == 37) {
            checkNeighborCells(key, columns, datafieldIndex, index, grid);
        } else if (event.target.selectionEnd == event.target.value.length && key == 39) {
            checkNeighborCells(key, columns, datafieldIndex, index, grid);
        }
    } else {
        checkNeighborCells(key, columns, datafieldIndex, index, grid);
    }
}

function checkNeighborCells(key, columns, datafieldIndex, index, grid) {
    if (key == 37) {
        if (datafieldIndex != 1) {
            for (var i = datafieldIndex; i--; i > 1) {
                if (columns[i].editable) {
                    $(grid).jqxGrid('begincelledit', index, columns[i].datafield);
                    break;
                }
            }
        }
    } else if (key == 39) {
        if (datafieldIndex != columns.length - 1) {      
            for (var i = datafieldIndex; i++; i < columns.length) {
                if (columns[i].editable) {
                    $(grid).jqxGrid('begincelledit', index, columns[i].datafield);
                    break;
                }
            }
        }
    }
}

