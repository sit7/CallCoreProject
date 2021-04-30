

// создание объектов полномочий
// userinfo -- это такой plainobject с iduser, idobject и true-false флагами по ролям приложения
// условимся, что admin в приложении есть всегда и ему можно всё -- добавлять, редактировать, 
// удалять объекты, делать с ними всякие штуки из бизнес-логики
// 
// если условиться на описании и именовании методов нашей модели дескрипторов, какие-то штуки
// бизнес-логики можно будет разруливать прямо здесь в методе touch                          
//_______________
//|две строчки   |
//|выше -- очень |
//|плохая идея.  |
//|даже не думай |
//|______________|
//            \  ^__^
//             \ (@@)\_______
//               (__)\       )\/\
//                    ||----w||
//                    ||     ||


// погнали
// для объектов верхнего уровня
//var credentialsmaster = {
//    //  тут логика ролевой дифференциации пользователей
//    //  если админу можно всё, и не важно с чем это всё будет 
//    //  получится так
//    default: function(userinfo, cannew) {
//        return {

//            allownew: function() {
//                return userinfo.isadmin || cannew(userinfo);
//            },
            
//            touch: function (method, row) {
//                // админу можно
//                if (userinfo.isadmin) return true;
//                // у метода есть функция-разруливатель?
//                if (method.touch !== undefined && typeof method.touch === 'function')
//                    // проверим
//                    return method.touch(userinfo, row);
//                // по умолчанию можно
//                return true;
//            },
//            // эксперимент: можно ли редактировать свойство property объекта row?
//            allowpropertyedit: function (property, row) {
//                // если явно указано что можно или нет, ну ок
//                if (property.canedit !== undefined && typeof property.canedit === 'boolean') return property.canedit;
//                // если у свойства есть функция-разруливать, то пусть она принимает в параметры
//                // userinfo и объект
//                if (property.canedit !== undefined && typeof property.canedit === 'function')
//                    return property.canedit(row, userinfo);

//                return true;
//            },
//            // отображаем ли свойство
//            ispropertyvisible: function(property, row) {
//                // если явно указано что показываем или нет, ну ок
//                if (property.hidden !== undefined && typeof property.hidden === 'boolean') return !property.hidden;
//                // если у свойства есть функция-разруливать, то пусть она принимает в параметры
//                // userinfo и объект row
//                if (property.hidden !== undefined && typeof property.hidden === 'function')
//                    return !property.hidden(row, userinfo);

//                return true;
//            }
//        }
//    }
//};



//var propertydescriptor = {
//    // обязательные свойства для колонки
//    // data -- datafield, имя свойства описываемого объекта
//    // display -- текст, как он отображается в гриде, в заголовке колонки, или на форме рядом с полем
//    // wid -- ширина колонки, число
//    // allowedit -- функция, на входе которой userinfo, объект (, и если есть -- мастер-объект)
//    // ishidden -- функция, на входе которой userinfo, объект (, и если есть -- мастер-объект)
//    simpledescriptor: function (data, display, wid, allowedit, ishidden) {
//        if (typeof data !== 'string') Error('datafield must be a string');
//        if (typeof display !== 'string') Error('displayname must be a string');
//        if (wid !== undefined && typeof wid !== 'number') Error('width must be a number');
//        if (allowedit !== undefined && typeof allowedit !== 'boolean' && typeof allowedit !== 'function')
//            Error('allowedit must be a boolean or function, that returns boolean');
//        if (ishidden !== undefined && typeof ishidden !== 'boolean' && typeof ishidden !== 'function')
//            Error('ishidden must be a boolean or function, that returns boolean');
//        return {
//            datafield: data,
//            displayname: display,
//            width: wid || 50,
//            canedit: allowedit || true,
//            hidden: ishidden || true
//        };
//    },
//    // sugtype -- тип подсказки dadata -- ADDRESS[Адрес], PARTY[организации], BANK[банки]
//    // token -- ключ, выданный dadata
//    // onselect -- функция, выполняющаяся при выборе подсказки (в ней распихивается по полям всё то, что вернулось из dadata)
//    // formatselected -- функция, возвращаяющая в input то, что нужно
//    suggestordescriptor: function (sugtype, token, onselect, formatselected) {
//        var ucase = String.toUpperCase(sugtype);
//        if (ucase !== 'ADDRESS' || ucase !== 'PARTY' || ucase !== 'BANK')
//            Error('suggestor type must be address, or party, or bank');
//        if (token === undefined || typeof token !== 'string') Error('token must be provided');
//        if (onselect !== undefined && typeof onselect !== 'function')
//            Error('suggestordescriptor param onselect must be a function');
//        if (formatselected !== undefined && typeof formatselected !== 'function')
//            Error('suggestordescriptor param formatselected must be a function');

//        return {
//            suggestortype: sugtype,
//            onSelect: onselect || null,
//            formatSelected: formatselected || null
//        };
//    },

//    // подумал, что onsuccess onerror, oncomplete, пока до этого места доберутся
//    // станут цепочкой коллбэков, на каждом этапе выполняющих разные штуки
//    remoteproperty: function (url, method, data, onsuccess, onerror, oncomplete) {

//        return {
//            url,
//            method,
//            dataType: 'json',
//            data: method === 'get' ? JSON.stringify(null) : JSON.stringify(data),
//            success: (response, xhr, status) => {
//                onsuccess(response, xhr, status);
//            },
//            error: (xhr, status, error) => {
//                onerror(xhr, status, error);
//            },
//            complete: (xhr, status) => {
//                oncomplete(xhr, status);
//            }
//        }
//    }
//}



