Vue.component('objects-list',
    {
        template: '#objects-list',
        mixins: [methodFactory, objectsmixins, crossdAuth],
        data: function() {
            return {
                objectargs: {
                    SearchString: ''
                },
                objectmethods: [
                    {
                        name: 'set-current-object',
                        displayname: 'Установить текущим объектом',

                        action: function (scope) {
                            return {
                                execAction: {
                                    url: '/Object/SetCurrentObject',
                                    data: scope.row.ObjectID,
                                    //data: { Key: scope.row.ObjectID },
                                    message: function (response, error) {
                                        return {
                                            offset: 100,
                                            message: response.success && error === undefined
                                                ? 'Установлен новый текущий объект'
                                                : (error === undefined
                                                    ? 'Не удалось установить текущий объект'
                                                    : 'Ошибка при установке текущего объекта'),
                                            type: response.success && error === undefined
                                                ? 'success'
                                                : (error === undefined ? 'warning' : 'error')
                                        };
                                    },
                                    confirmtype: 'reload'
                                },

                            }
                        },
                        icon: 'el-icon-aim',
                        left: true,

                    },
                    {
                        name: 'edit-object',
                        displayname: 'Редактировать',

                        dialog: true,
                        dialogname: 'objecteditor',
                        action: function (scope) {
                            return {
                                dialogPayload: {
                                    url: '/Object/GetObject',
                                    data: scope.row.ObjectID,
                                    //data: { Key: +scope.row.ObjectID },
                                    dialogname: this.dialogname
                                },
                                execAction: {
                                    url: '/Object/UpdateObject',
                                    confirmtype: 'update'
                                }

                            };
                        },
                        icon: 'el-icon-edit',
                        touch: (userinfo, row) => userinfo.isobjecteditor && row.ObjectStatusID !== 3
                    },
                    {
                        name: 'edit-verify',
                        displayname: 'Отметить как проверенный',

                        action: function (scope) {
                            return {
                                execAction: {
                                    url: '/Object/SetObjectStatus',
                                    data: { Status: 3, Key: scope.row.ObjectID },
                                    confirmtype: 'update'
                                }
                            }
                        },
                        icon: 'el-icon-finished',
                        touch: (userinfo, row) => userinfo.isobjecteditor && row.ObjectStatusID !== 3
                    },
                    {
                        name: 'edit-undo-verify',
                        displayname: 'Вернуть на редактирование',

                        action: function (scope) {
                            return {
                                execAction: {
                                    url: '/Object/SetObjectStatus',
                                    data: { Status: 2, Key: scope.row.ObjectID },
                                    confirmtype: 'update'
                                }
                            };
                        },
                        icon: 'el-icon-refresh-left',
                        touch: (userinfo, row) => userinfo.isobjecteditor && row.ObjectStatusID === 3
                    },

                ],
              
                
            };
        },

        computed: {
            objectcardmodel: function() {
                return {
                    tabs: [
                        {
                            name: 'general',
                            label: 'Общая информация',
                            descriptor: this.generalinfodescriptor
                        },
                        {
                            name: 'address',
                            label: 'Адрес и контактная информация',
                            descriptor: this.addressinfodescriptor
                        },
                        {
                            name: 'requisite',
                            label: 'Реквизиты',
                            descriptor: this.requisitesinfodescriptor
                        },
                        {
                            name: 'chief',
                            label: 'Руководитель',
                            descriptor: this.chiefinfodescriptor
                        }
                    ]
                }
            },
            objectgridmodel: function() {
                return {
                    getmethod: '/Object/GetObjectsList',
                    methods: this.objectmethods,
                    descriptor: ((descriptors) => {
                        var descriptor = [];
                        descriptors.forEach(
                            info => descriptor = descriptor.concat(info.filter(property => {
                                if (property.isgrid) return property;
                            })));
                        return descriptor;
                    })([
                        this.generalinfodescriptor, this.addressinfodescriptor, this.requisitesinfodescriptor,
                        this.chiefinfodescriptor
                    ])
                };
            }
        },
        methods: {

        },

    })