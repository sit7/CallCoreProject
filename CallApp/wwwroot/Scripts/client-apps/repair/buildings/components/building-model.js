
function buildingModel() {

    function createModel(tabname, tablabel, tabdescriptor, tabrules, tabisvisible, empty) {
        return {
            name: tabname,
            label: tablabel,
            descriptor: tabdescriptor,
            rules: tabrules,
            isvisible: tabisvisible, 
            create: empty
        };
    }

    var validateAreas = function(rule, value, callback) {
        if (value === undefined || value === '' || value === null) callback();
        else {
            if (typeof value === 'number') callback();
            else {
                var re = value.match(/^[0-9]*[\,]?[0-9]+$/);
                if (re === null) callback(new Error('Площадь должна быть числом, десятичная часть отделяется запятой'));
                else if (Number.isNaN(re))
                    callback(new Error('Площадь должна быть числом, десятичная часть отделяется запятой'));
                else callback();
            }
        }
    };

    var validateFloors = function(rule, value, callback) {
        if (value === undefined || value === '') callback();
        else {
            var cvalue = +value;
            if (Number.isNaN(cvalue)) callback(new Error('Количество этажей должно быть числом'));
            else if (!Number.isSafeInteger(cvalue)) callback(new Error('Количество этажей должно быть целым числом'));
            else callback();
        }
    };

    var general = createModel('general-model-item', 'Общая информация',
        [
            {
                text: 'ID',
                datafield: 'BuildingID',
                hidden: true

            },
            {
                text: 'Тип',
                datafield: 'BuildingTypeID',
                displayname: 'BuildingTypeName',
                method: 'get',
                url: '/repBuilding/GetBuildingTypes',
                editortype: 'dropdownlist',
                options: [],
                formatConverter: function (value) {
                    return value.BuildingTypeName || 'н/д';
                    //                  var bt = this.options.find(s => s.BuildingTypeID === value['BuildingTypeName']);
                    //                  if (bt === undefined || bt === null) return 'н/д';
                    //return bt.Name;
                }

            },
            {
                text: 'Наименование',
                datafield: 'Name'
            },
            {
                text: 'Описание',
                datafield: 'Description',
                type: 'textarea'
            },
            {
                text: 'Адрес',
                datafield: 'Address',
                suggestortype: 'ADDRESS',
                onSelect: function(suggestiondata, changed, object) {
                    object.Latitude = parseFloat(+suggestiondata.geo_lat);
                    object.Longitude = parseFloat(+suggestiondata.geo_lon);
                },
                formatSelected: function (suggestion, object) {
                    object.Address = suggestion.unrestricted_value;
                    return object.Address;
                }
            },
            {
                text: 'Широта',
                datafield: 'Latitude',
                columntype: 'decimal',
                precision: 6
            },
            {
                text: 'Долгота',
                datafield: 'Longitude',
                columntype: 'decimal',
                precision: 6
            },
            {
                text: 'Комментарий',
                datafield: 'Comment'
            },
            {
                text: 'Кадастровый номер объекта',
                datafield: 'LandKadastrNumber'
            },
            {
                text: 'Арендованное',
                datafield: 'IsRented',
                editortype: 'checkbox'
            }
        ],
        {
            BuildingTypeID: [
                {
                    required: true,
                    message: 'Тип объекта недвижимости нужно указать',
                    trigger: 'change'
                }
            ],
            Address: [
                {
                    required: true,
                    message: 'Адрес нужно указать',
                    trigger: 'change'
                }
            ],
            Name: [
                {
                    required: true,
                    message: 'Наименование нужно указать',
                    trigger: 'change'
                }
            ],
            Description: [
                {
                    validator: function (rule, value, callback) {
                        if (value === undefined) callback();
                        else if (value === null || (typeof value === 'string' && value.length === 0)) callback();
                        else {
                            if (value.length > 2000)
                                callback(new Error('Превышена длина поля (не более 2000 знаков)'));
                            else callback();
                        }
                    }
                }
            ],
        },
        true,
        {
            BuildingID: -1,
            BuildingTypeID: null,
            Name: null,
            Description: null,
            Address: null,
            Latitude: null,
            Longitude: null,
            Comment: null,
            LandKadastrNumber: null,
            IsRented: false
        }
    );

    var building = createModel('building-model-item',
            'Информация о здании',
            [
                {
                    text: 'Год постройки',
                    datafield: 'BuildYear',
                },
                {
                    text: 'Количество этажей',
                    datafield: 'FloorNum'
                },
                {
                    text: 'Технических этажей',
                    datafield: 'TechFloorNum'
                },
                {
                    text: 'Подвальных этажей',
                    datafield: 'UnderFloorNum'
                },
                {
                    text: 'Площадь здания, кв.м.',
                    datafield: 'MainBuildingArea',
                    columntype: 'decimal',
                    precision: 4
                },
                {
                    text: 'Площадь доп. строений, кв.м.',
                    datafield: 'AuxiliaryBuildingArea',
                    columntype: 'decimal',
                    precision: 4
                },
                {
                    text: 'Вместимость',
                    datafield: 'MaxKidsCount'
                },
                {
                    text: 'Св-во на оперативное управление',
                    datafield: 'OperationalManagementCertificate'
                },
            ],
            {
                FloorNum: [
                    {
                        validator: validateFloors
                    }
                ],
                TechFloorNum: [
                    {
                        validator: validateFloors
                    }
                ],
                UnderFloorNum: [
                    {
                        validator: validateFloors
                    }
                ],
                MainBuildingArea: [
                    {
                        validator: validateAreas
                    }
                ],
                AuxiliaryBuildingArea: [
                    {
                        validator: validateAreas
                    }
                ]
            },
        function (value) { return value['BuildingTypeID'] !== 4 },
        {
            BuildYear: null,
            FloorNum: null,
            TechFloorNum: null,
            UnderFloorNum: null,
            MainBuildingArea: null,
            AuxiliaryBuildingArea: null,
            MaxKidsCount: null,
            OperationalManagementCertificate: null
        });

    var landinfo = createModel('land-model-item', 'Земельный участок', [
            {
                text: 'Площадь земельного участка, кв.м.',
                datafield: 'LandArea',
                columntype: 'decimal',
                precision: 4,
            },
            {
                text: 'Площадь территории благоустройства, кв.м.',
                datafield: 'LandToBeautification',
                columntype: 'decimal',
                precision: 4
        }],
        {
            LandArea: [
                { validator: validateAreas }
            ],
            LandToBeautification: [
                { validator: validateAreas }
            ]
        }, value => value['BuildingTypeID'] === 4, {
            LandArea: null,
            LandToBeautification: null,
        }
    );

    var rentinfo = createModel('rent-model-item',
            'Информация об аренде',
            [
                {
                    text: 'Номер договора',
                    datafield: 'RentContractNumber',
                },
                {
                    text: 'Дата договора',
                    datafield: 'RentContractDate',
                    editortype: 'datetimeinput',
                    cellsformat: 'dd.MM.yyyy',

                },
                {
                    text: 'Дата начала аренды',
                    datafield: 'RentBeginDate',
                    editortype: 'datetimeinput',
                    cellsformat: 'dd.MM.yyyy',
                },
                {
                    text: 'Дата окончания аренды',
                    datafield: 'RentEndDate',
                    editortype: 'datetimeinput',
                    cellsformat: 'dd.MM.yyyy',

                },
                {
                    text: 'Арендодатель',
                    datafield: 'RentContragentID',
                    url: '/repBuilding/GetRentContragent',
                    method: 'post',

                    displayname: 'RentContragentName',
                    editortype: 'dropdownlist',
                    options: [],
                    getcustomdata: function (row) {
                        return { datafield: this.datafield, Key: row.ObjectID };
                    },
                    placeHolder: 'Арендодатель',

                    formatConverter: function(value) {
                        return value.RentContragentName || 'н/д';
                    }
                }
            ],
        {}, value => value["IsRented"] === true,
        {
            RentContractNumber: null,
            RentContractDate: null,
            RentBeginDate: null,
            RentEndDate: null,
            RentContragentID: null,
        });
   


    return {
        copy: function(building) {
            return JSON.parse(JSON.stringify(building));
                //function(k, v) {
                //    if (v !== null) {
                //        if (k === 'Latitude' || k === 'Longitude') {
                //            return v.toLocaleString('ru-RU', { useGrouping: false, maximumFractionDigits: 7 });
                //        } else if (k === 'LandArea' ||
                //            k === 'LandToBeautification' ||
                //            k === 'MainBuildingArea' ||
                //            k === 'AuxiliaryBuildingArea') {
                //            return v.toLocaleString('ru-RU', { useGrouping: false });
                //        } else {
                //            return v;
                //        }
                //    } else {
                //        return v;
                //    }
                //});
        },

        new: function (objectkey) {
            var blank = { ObjectID: objectkey };
            this.tabs.forEach(t => Object.assign(blank, t.create));
            return blank;
        },
        name: 'buildingmodel',

        tabs: [general, building, landinfo, rentinfo],

        credentials: function(args) {
            
            return {
                credargs: args,
                allowedit: function(building, status) {
                    if (this.credargs.isrepair && !building.IsVerified && status !== 2) return true;
                    if (this.credargs.isadmin || this.credargs.isaccount && status === 2) return true;
                    if (building.IsVerified && this.credargs.isrepair) return false;
                    return false;
                },
                allowremove: function(building, status) {
                    if (this.credargs.isadmin) return true;
                    if (status !== 2 && !building.IsVerified && this.credargs.isrepair) return true;
                    return false;
                },
                allowverify: function(building, status) {
                    if (building.IsVerified) return false;
                    if (this.credargs.isadmin || (this.credargs.isaccount && !building.IsVerified)) return true;
                    return false;
                },
                allowundoverify: function(building, status) {
                    if (!building.IsVerified) return false;
                    if (this.credargs.isadmin || (this.credargs.isaccount && building.IsVerified)) return true;
                    return false;
                },
                allownew: function(status) {
                    return this.credargs.isadmin || (this.credargs.isrepair && status !== 2);
                },
                allowsetready: function(status) {
                    return (this.credargs.isadmin || this.credargs.isrepair) && (status !== 2);
                },
                allowresetready: function(status) {
                    return (this.credargs.isadmin || this.credargs.isaccount) && (status === 2);
                },
                canedit: function(property, object) {
                    return true;
                }

            };
        },


    };
};
