function countersmodel() {


    var counterdescriptor = [
        {
            datafield: 'CounterID',
            text: 'ID',
            hidden: true
        }, {
            datafield: 'CounterTypeID',
            text: 'Тип счётчика',
            type: 'int',
            editortype: 'dropdownlist',
            displayname: 'CounterTypeName',
            url: '/RepCounter/GetCounterTypes',
            method: 'get',
            options: [],
            width: 30

        }, {
            datafield: 'CounterModel',
            text: 'Модель счётчика',
            editortype: 'groupbox',
            name: 'countermodel',
            descriptor: [
                {
                    datafield: 'Fabricator',
                    text: 'Производитель',
                    canedit: true
                },
                {
                    datafield: 'Model',
                    text: 'Модель',
                    canedit: true
                },
                {
                    datafield: 'Modification',
                    text: 'Модификация',
                    canedit: true

                }],
            format: function(row) {
                return row['Fabricator'] + '/' + row['Model'] + '/' + row['Modification'];
            }
        },
        {
            datafield: 'FactoryNumber',
            text: 'Заводской номер',
            width:40
        },
        {
            datafield: 'IssueDate',
            text: 'Дата выпуска',
            editortype: 'datetimeinput',
            width: 30
        },
        {
            datafield: 'RecieveDate',
            text: 'Дата приёмки',
            editortype: 'datetimeinput',
            width: 30
        }, {
            datafield: 'NextVerifyDate',
            text: 'След.дата поверки',
            editortype: 'datetimeinput',
            width: 30
        },
        {
            datafield: 'BuildingID',
            text: 'Адрес объекта',
            displayname: 'Address',
            type: 'int',
            editortype: 'dropdownlist',
            url: '/RepCounter/GetBuildings',
            method: 'post',
            options: [],
            getcustomdata: function (row) {
                return { datafield: this.datafield, Key: row.ObjectID };
            }
        }
    ];

    return {
        getmethod: '/RepCounter/GetCounterList',
        addmethod: '/RepCounter/AddCounter',
        updatemethod: '/RepCounter/UpdateCounter',
        removemethod: '/RepCounter/RemoveCounter',
        name: 'counters',
        label: 'Счётчики',
        descriptor: counterdescriptor,
        idfield: 'CounterID',
        methods: [
            {
                name: 'edit-counter',
                displayname: 'Редактировать',
                dialog: true,
                dialogname: 'countereditor',
                action: function(scope) {
                    return {
                        getpayload: function () {
                            return scope.row;
                        }
                    }
                },
                icon: 'el-icon-edit'
            },
            {
                name: 'delete-counter',
                displayname: 'Удалить',
                action: function (scope) {

                },
                icon: 'el-icon-delete'
            },

        ],
        rules: {
            CounterTypeID: [
                {
                    required: true,
                    message: 'Тип счётчика нужно указать'
                }],
            BuildingID: [
                {
                    required: true,
                    message: 'Адрес установки нужно указать'
                }],
            Fabricator: [
                {
                    required: true,
                    message: 'Производителя нужно указать'
                }],
            Model: [
                {
                    required: true,
                    message: 'Модель нужно указать'
                }],
            FactoryNumber: [
                {
                    required: true,
                    message: 'Заводской номер нужно указать'
                }],
            IssueDate: [
                {
                    required: true,
                    message: 'Дату выпуска нужно указать'
                }],
            RecieveDate: [
                {
                    required: true,
                    message: 'Дату приёмки нужно указать'
                }],
            NextVerifyDate: [
                {
                    required: true,
                    message: 'Дату следующей поверки нужно указать'
                }]


        },
        createcredentials: function(userinfo) {
            return {
                creds: userinfo,
                allowedit: function(object) {
                    return this.creds.isrepair || this.creds.isadmin;
                },
                touch: function(method, args) {
                    return true;
                }
            }
        },
        createnew: function(userinfo) {
            return {
                ObjectID: userinfo.idobject,
                CounterID: -1,
                CounterTypeID: null,
                CounterModel: null,
                Fabricator: null,
                Model: null,
                Modification: null,
                FactoryNumber: null,
                IssueDate: null,
                RecieveDate: null,
                NextVerifyDate: null,
                BuildingID: null
            }
        }
    }

}