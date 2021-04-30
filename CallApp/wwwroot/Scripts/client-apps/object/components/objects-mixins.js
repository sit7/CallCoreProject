var objectsmixins = {
    props: {
        chiefinfodescriptor: {
            type: Array,
            default: () => [
                {
                    text: 'Должность',
                    datafield: 'HeadPosition'
                }, {
                    text: 'ФИО',
                    datafield: 'HeadFIO',
                    isgrid: true
                }, {
                    text: 'Исполняющий обязанности',
                    datafield: 'IsIO',
                    editortype: 'checkbox'
                }, {
                    text: 'Телефон директора',
                    datafield: 'HeadPhoneNumber',
                    width: 50,
                    isgrid: true,
                    editortype: 'tel'
                }, {
                    text: 'E-mail',
                    datafield: 'HeadEMail',
                    editortype: 'email'
                }, {
                    text: 'Подпись для документов',
                    datafield: 'HeadSignature'
                }
            ]
        },
        requisitesinfodescriptor: {
            type: Array,
            default: () => [
                {
                    text: 'ИНН',
                    datafield: 'INN',
                    editortype: 'suggestor',
                    suggestortype: 'PARTY',
                    onSelect: function (suggestiondata, changed, object) {
                        object.KPP = suggestiondata.kpp;
                        if (suggestiondata.okpo != null) object.OKPO = suggestiondata.okpo;
                        if (suggestiondata.okved != null) object.OKVED = suggestiondata.okved;
                        object.Name = suggestiondata.name.full_with_opf;
                        object.ShortName = suggestiondata.name.short_with_opf;
                        object.FullAddress = suggestiondata.address.unrestricted_value;
                        object.PostIndex = suggestiondata.address.data.postal_code;
                        object.City = suggestiondata.address.data.city;
                        object.Street = suggestiondata.address.data.street_with_type;
                        object.House = suggestiondata.address.data.house;
                        object.Block = suggestiondata.address.data.block;
                        object.HeadPosition = suggestiondata.management.post;
                        object.HeadFIO = suggestiondata.management.name;
                    },
                    formatSelected: function (suggestion, row) {
                        row.INN = suggestion.data.inn;
                        return row.INN;
                    }
                }, {
                    text: 'ОКПО',
                    datafield: 'OKPO'
                }, {
                    text: 'КПП',
                    datafield: 'KPP'
                }, {
                    text: 'ОКВЭД',
                    datafield: 'OKVED'
                }, {
                    text: 'Банк',
                    datafield: 'BankName'
                }, {
                    text: 'Корр/счет',
                    datafield: 'CorrAccount'
                }, {
                    text: 'БИК',
                    datafield: 'BIC',
                    suggestortype: 'BANK',
                    editortype: 'suggestor',
                    onSelect: function (suggestiondata, changed, object) {
                        object.BIC = suggestiondata.bic;
                        object.BankName = suggestiondata.name.payment;
                    },
                    formatSelected: function (suggestion, row) {
                        return suggestion.data.bic;
                    }
                }, {
                    text: 'Корр. банк',
                    datafield: 'CorrBank'
                }, {
                    text: 'Р/счет',
                    datafield: 'CurrentAccount'
                }, {
                    text: 'Лицевой счет',
                    datafield: 'PersonalAccount'
                }, {
                    text: 'Лицевой счет2',
                    datafield: 'PersonalAccount2'
                }
            ]
        },
        addressinfodescriptor: {
            type: Array, default: () => [
                {
                    text: 'Почтовый индекс',
                    datafield: 'PostIndex',
                    hidden: true,
                    maxlength: 7,
                },
                {
                    text: 'Адрес',
                    datafield: 'FullAddress',
                    isgrid: true,
                    editortype: 'suggestor',
                    suggestortype: "ADDRESS",
                    onSelect: function (suggestiondata, changed, object) {
                        object.Street = suggestiondata.street_with_type;
                        object.PostIndex = suggestiondata.postal_code;
                        object.City = suggestiondata.city;
                        object.HouseNumber = suggestiondata.house;
                        object.HouseBlock = suggestiondata.block;
                    }

                }, {
                    text: 'Район',
                    datafield: 'Region'
                }, {
                    text: 'Город',
                    datafield: 'City',
                    hidden: true
                }, {
                    text: 'Улица',
                    datafield: 'Street',
                    //isgrid: true,
                    hidden: true
                }, {
                    text: 'Дом',
                    datafield: 'HouseNumber',
                    hidden: true
                }, {
                    text: 'Корпус',
                    datafield: 'HouseBlock',
                    hidden: true
                },
                {
                    text: 'Телефон',
                    datafield: 'PhoneNumber',
                    isgrid: true
                },
                {
                    text: 'Факс',
                    datafield: 'FaxNumber'
                },
                {
                    text: 'E-mail',
                    datafield: 'EMail',
                    editortype: 'email',
                    title: 'Укажите электронную почту',
                    required: true
                },
                {
                    text: 'Сайт',
                    datafield: 'WWW',
                    editortype: 'url',
                    title: 'Укажите сайт'
                }
            ]
        },
        generalinfodescriptor: {
            type: Array,
            default: () => [
                {
                    text: 'ObjectID',
                    datafield: 'ObjectID',
                    hidden: true
                },
                {
                    text: 'Тип',
                    datafield: 'ObjectTypeID',
                    editortype: 'dropdownlist',
                    url: '/Object/GetObjectTypes',
                    method: 'post',

                    map: new Map(),
                    displayname: 'ObjectTypeName',
                    getcustomdata: function (row) {
                        return { datafield: this.datafield, Key: row.ObjectTypeID };
                    }
                },
                {
                    text: 'Раздел',
                    datafield: 'ObjectGroupID',
                    editortype: 'dropdownlist',
                    url: '/Object/GetObjectGroups',
                    method: 'get',

                    map: new Map(),
                    displayname: 'ObjectGroupName',
                    afterchanged: function (currentvalue, callback) {
                        callback('ObjectTypeID');
                    }

                },
                {
                    text: 'Полное название',
                    datafield: 'Name',
                    editortype: 'textarea',
                    rows: 3,
                    maxlength: 150
                },
                {
                    text: 'Сокращённое название',
                    datafield: 'ShortName',
                    isgrid: true,
                    editortype: 'textarea',
                    rows: 3,
                    routeinfo: function (row) {
                        return {
                            name: 'objectcard',
                            params: {
                                ObjectID: row.ObjectID,
                            },
                        }
                    },
                    maxlength: 50,
                },
                {
                    text: 'Краткое название',
                    datafield: 'UltraShortName',
                    editortype: 'textarea',
                    maxlength: 25,
                    rows: 2,
                },
                {
                    text: 'Малочисленная',
                    datafield: 'IsFew',
                    editortype: 'checkbox',
                },
                {
                    text: 'Круглосуточное',
                    datafield: 'Is24Group',
                    editortype: 'checkbox'
                },
                {
                    text: 'Изображение для левого верхнего угла',
                    datafield: 'CornerImage',
                    editortype: 'uploader',
                    filename: 'FileName',
                    action: '/Object/UploadImage',
                    geturl: '/Object/GetObjectImage',
                    allowmultiple: false,
                    data: function(row) {
                        return { Key: row.ObjectID }
                    }
                }
            ]
        }
    },
}