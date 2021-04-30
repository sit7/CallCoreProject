var RequestArgModel = function () {
    var setSourceCallback = (property, source) => property.sourceList = source;

    return {
        name: 'request-args-model',
        label: 'Фильтр',
        descriptor: [
            {
                text: 'Объект',
                url: '/Repair/GetObjectList',
                method: 'get',
                displayname: 'UltraShortName',
                datafield: 'ObjectID',
                editortype: 'dropdownlist',
                hidden: function (row, creds) {
                    return creds.isrepair;
                }
            },
            {
                text: 'Объект недвижимости',
                url: '/Repair/GetBuildings',
                method: 'post',
                editortype: 'dropdownlist',
                displayname: 'Address',
                datafield: 'BuildingID',
                getcustomdata: function(filter) {
                    return { Key: filter["ObjectID"] };
                }


            },
            {
                text: 'Начало периода',
                datafield: 'StartDate',
                editortype: 'datetimeinput'

            },
            {
                text: 'Конец периода',
                datafield: 'EndDate',
                editortype: 'datetimeinput'
            },
            {
                text: 'Зарегистрированные',
                datafield: 'IsRegistered',
                editortype: 'checkbox'
            },
            {
                text: 'Срочные',
                datafield: 'IsUrgent',
                editortype: 'checkbox'
            },
            {
                text: 'С файлами',
                datafield: 'HasFiles',
                editortype: 'checkbox'
            },
            {
                text: 'Статус заявки',
                datafield: 'RequestStatusID',
                editortype: 'dropdownlist',
                displayname: 'RequestStatusName',
                url: '/Repair/GetRequestStatusList',
                method: 'get'
            },
            {
                text: 'Тип заявки',
                url: '/Repair/GetRequestTypeList',
                method: 'get',
                displayname: 'RequestTypeName',
                datafield: 'RequestTypeID',
                editortype: 'dropdownlist',
            },
        ],

        new: function(args) {
            return {
                StartDate: null,
                EndDate: null,
                IsUrgent: false,
                IsRegistered: false,
                HasFiles: false,
                RequestTypeID: null,
                RequestStatusID: null,
                ObjectID: args.isrepair ? args.objectid : null,
                BuildingID: null
            };
        }
    }
}