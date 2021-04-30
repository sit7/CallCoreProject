function requests() {
    function copy(value) {
        return JSON.parse(JSON.stringify(value));
    }

    return {
        name: 'request',
        label: 'Заявки',
        pagesize: 15,
        getmethod: '/Repair/GetRequestList',
        addmethod: '/Repair/Add',
        removemethod: '/Repair/DeleteRequest',
        updatemethod: '/Repair/Add',
        idfield: 'RequestID',
        getloadargs: function(payload) {
            return {}
        },
        rules: {
            BuildingID: [{
                required: true,
                message: 'Объект недвижимости нужно указать',
                trigger: 'change'
            }],
            Name: [
                {
                    required: true,
                    message: 'Наименование заявки нужно указать',
                    trigger: 'change',
                }
            ]
        },
        descriptor: [
            {
                text: 'Рег.номер',
                datafield: 'RegNumber',
                type: 'string',
                columntype: 'textbutton',
                onclick: function (sender, scope) {
                    $.ajax({
                        url: '/Repair/GetRequestOfficeTail',
                        data: JSON.stringify({ Key: scope.row["RequestID"] }),
                        method: 'post',
                        success: function(response) {
                            sender.$refs['registerrequest'].show(response.data, scope);
                        }
                    });
                },

                compositetext: true,
                format: function (row) {
                    if (row['RegNumber'] === null) return '';
                    var date = new Date(row['RegDate']);
                    return row['RegNumber'] + '/' + date.toLocaleDateString();
                },
                width: 100,
                canedit: false,
                hidden: function (row, credentials) {
                    if (row == undefined) return false;
                    if (row.RegNumber == null || row.RequestID < 0 && credentials.isrepair) return true;
                    return false;
                },
                //routeinfo: function(row) {
                //    return {
                //        name: 'registerinfo',
                //        params: {
                //            ObjectID: row.ObjectID,
                //            RequestID: row.RequestID
                //        }
                //    }
                //}

            },
            {
                datafield: 'RequestID',
                text: 'ID',
                hidden: true
            },
            {
                datafield: 'ObjectID',
                text: 'Объект',
                type: 'int',
                options: [],
                editortype: 'dropdownlist',
                displayname: 'UltraShortName',
                url: '/Repair/GetObjectList',
                method: 'get',
                hidden: function (value, credentials) {
                    return credentials.isrepair;
                },
                canedit: function(row, credentials) {
                    return credentials.isadmin;
                }
            },
            {
                text: 'Наименование',
                datafield: 'Name',
                hidden: false,
                editortype: 'textarea',
                routeinfo: function (row) {
                    return {
                        name: 'requestcard',
                        params: {
                            ObjectID: row.ObjectID,
                            RequestID: row.RequestID,
                        },
                    }
                },
                canedit: function(row, credentials) {
                    return (credentials.isrepair && (row.RegDate === null || row.RegDate === undefined)) ||
                        credentials.isadmin;
                },
                maxlength: 200,
                rows: 2
            },
            {
                text: 'Объект недвижимости',
                datafield: 'BuildingID',
                type: 'int',
                editortype: 'dropdownlist',
                options: [],
                displayname: 'Address',
                width: 300,
                method: 'post',
                url: '/Repair/GetBuildings',
                canedit: function (row, credentials) {
                    if (credentials.isrepair && row.RegDate == null) return true;
                    return credentials.isadmin;
                },
                getcustomdata: function(row) {
                    return { datafield: this.datafield, Key: row.ObjectID };
                }
            },
            {
                text: 'Дата заявки',
                datafield: 'ReqDate',
                type: 'date',
                editortype: 'datetimeinput',
                cellsformat: 'dd.MM.yyyy',
                width: 90,
                canedit: function(row, credentials) {
                    return !row.RequestID > 0;
                }
            },
            {
                text: 'Статус заявки',
                datafield: 'RequestStatusID',
                type: 'int',
                width: 100,
                editortype: 'dropdownlist',
                options: [],
                displayname: 'RequestStatusName',
                method: 'get',
                url: '/Repair/GetRequestStatusList',
                isdisabled: function (option, request, credargs) {
                    if (credargs.isrepair && request.RequestID > 0) return true;
                    if (credargs.isclerk && request.RegDate == null) return true;
                    return option.RequestStatusID !== request.RequestStatusID;
                },
                canedit: function(row, credentials) {
                    if (credentials.isrepair && row.RegDate == null) return true;
                    if (credentials.isclerk) return true;
                    return credentials.isadmin;
                }
            },
            {
                text: 'Тип заявки',
                datafield: 'RequestTypeID',
                type: 'int',
                editortype: 'dropdownlist',
                options: [],
                displayname: 'RequestTypeName',
                url: '/Repair/GetRequestTypeList',
                method: 'get',
                width: 100,
                canedit: function(row, credentials) {
                    if (credentials.isrepair && row.RegDate == null) return true;
                    if (credentials.isclerk) return true;
                    return credentials.isadmin;
                },
                isdisabled: function(option, request, credargs) {
                    if (credargs.isclerk || request.RegDate == null) return false;
                    return !credargs.isadmin;
                }
            },
          
            {
                text: 'Описание',
                datafield: 'Description',
                editortype: 'textarea',
                hidden: function(row, credentials) {
                    return row == undefined;
                },
                canedit: function (row, credentials) {
                    if (credentials.isrepair) return row.RegDate == null;
                    return credentials.isadmin;
                },
                width: 200
            },
            {
                text: 'Срочная',
                datafield: 'IsUrgent',
                type: 'bool',
                editortype: 'checkbox',
                width: 50,
                canedit: function(row, credentials) {
                    if (credentials.isrepair && row.RegDate == null) return true;
                    return credentials.isadmin;
                }
            }],
        copy,
        methods: [
            {
                name: 'edit-request',
                displayname: 'Изменить',
                type: 'rowbutton',
                dialog: true,
                dialogname: 'requesteditor',
                action: function (scope) {
                    return {
                        getpayload: function() {
                            return scope.row;
                        }
                    };
                },
                icon: 'el-icon-edit'
            },
            {
                name: 'delete-request',
                displayname: 'Удалить',
                type: 'rowbutton',
                action: function (scope) {
                    return {
                        getpayload: function() {
                            return { Key: scope.row.RequestID }
                        }
                    }
                },
                icon: 'el-icon-delete'

            },
            {
                name: 'edit-request-register',
                type: 'rowbutton',
                displayname: 'Зарегистрировать',
                dialog: true,
                dialogname: 'registerrequest',
                url: '/Repair/RegisterRequest',
                action: function (scope) {
                    return {
                        getpayload: function() {
                            return {
                                RequestID: scope.row['RequestID'],
                                RequestStatusID: scope.row["RequestStatusID"],
                                AutoReg: true,
                                RegNumber: null,
                                RegDate: null,
                                Comment: null,
                                PersonID: null
                            };
                        }
                    }
                },
                icon: 'el-icon-edit-outline'
            },
            {
                name: 'edit-request-setexecutor',
                displayname: 'Назначить исполнителя',
                dialog: true,
                dialogname: 'registerrequest',
                url: '/Repair/UpdateOfficeRequest',
                action: function (scope) {
                    return {
                        getpayload: {
                            url: '/Repair/GetRequestOfficeTail',
                            dataType: 'json',
                            data: JSON.stringify({ Key: scope.row.RequestID }),
                            method: 'post',
                        }
                    }
                },
                icon: 'el-icon-user'
            },
            {
                name: 'view-request-comments',
                displayname: 'Переписка',
                dialog: true,
                dialogname: 'requestcomments',
                action: function(scope) {
                    return {
                        getpayload: function() {
                            return { Key: scope.row.RequestID };
                        }
                    }
                },
                icon: 'el-icon-chat-dot-square'
            }
        ],
        new: function(objectid) {
            return {
                ObjectID: objectid,
                RequestTypeID: 1,
                RequestStatusID: 1,
                ReqDate: new Date(Date.now()),
                RequestID: -1,
                BuildingID: null,
                Name: null,
                Description: null,
                IsUrgent: 0
            }
        },
        createcredentials: function (usercredentials) {
            return {
                credargs: usercredentials,
                allowedit: function (request) {
                    return (this.credargs.isadmin || this.credargs.isrepair) && (request.RegDate === null || request.RegDate === undefined);
                },
                allownew: function () {
                    return this.credargs.isadmin || this.credargs.isrepair;
                },
                allowregister: function (request) {
                    return (this.credargs.isadmin || this.credargs.isclerk) && (request.RegDate === null || request.RegDate === undefined);
                },
                allowreject: function (request) {
                    return (this.credargs.isadmin || this.credargs.isclerk) && (request.RegDate === null || request.RegDate === undefined);
                },
                allowremove: function (request) {
                    return (this.credargs.isadmin || this.credargs.isrepair) && (request.RegDate === null || request.RegDate === undefined);
                },
                touch: function (userinfo, method, row) {
                    if (method.name === 'view-request-comments') return true;
                    if (userinfo.isheader) return false;
                    if (method.name === 'edit' || method.name === 'remove')
                        return (userinfo.isadmin || userinfo.isrepair) && (row.RegDate === null || row.RegDate === undefined);
                    if (method.name === 'register' || method.name === 'rejectregister') {
                        return (userinfo.isadmin || userinfo.isclerk) && (row.RegDate === null || row.RegDate === undefined);
                    }
                    if (method.name === 'setexecutor') {
                        return (userinfo.isadmin ||
                            (userinfo.isclerk && row.RegDate !== null && row.RegDate !== undefined));
                    }
                    return true;
                }
            };
        },
    }
};

function officerequestmodel() {

    var resolvehidden = function (value, credentials) {
        if (credentials.isadmin) return false;
        if (credentials.isheader) return false;
        if (value === undefined || value === null) {
            return credentials.isrepair;
        }

        return (value.RegDate === null || value.RegDate === undefined) && (!credentials.isclerk);
    };

    return {
        name: 'requestoffice',
        label: 'Регистрация',
        descriptor: [
            {
                text: 'Автоматически получать рег.номер',
                datafield: 'AutoReg',
                editortype: 'checkbox',
                hidden: function(row, creds) {
                    return row['RegNumber'] !== null && row['RegDate'] !== null;
                }
            },
            {
                text: 'Рег.номер',
                datafield: 'RegNumber',
                type: 'string',
                editortype: 'textbutton',

                compositetext: true,

                format: function (row) {
                    if (row['RegNumber'] === null) return '';
                    var date = new Date(row['RegDate']);
                    return row['RegNumber'] + '/' + date.toLocaleDateString();
                },
                width: 50,

                hidden: function (value, credentials) {
                    return value['AutoReg'] || resolvehidden(value, credentials);
                },
                canedit: function (row, creds) {
                    return creds.isadmin || (creds.isclerk && !row["AutoReg"] && row["RequestStatusID"] === 1);
                }
            },
            {
                text: 'Дата регистрации',
                datafield: 'RegDate',
                type: 'date',
                editortype: 'datetimeinput',
                cellsformat: 'dd.MM.yyyy',
                renderer: function (x, y, z) {
                    return '<div style="margin:5px;">Рег.<br/>дата</div>';
                },
                width: 75,
                hidden: true,
                canedit: function(row, creds) {
                    return row["RequestStatusID"] === 1 && creds.isclerk;
                }
            },
            {
                text: 'Комментарий',
                datafield: 'Comment',
                type: 'string',
                editortype: 'textarea',
                hidden: function (value, credentials) {
                    return resolvehidden(value, credentials);
                },
                maxlength: 200,
                rows: 2
            },
            {
                text: 'Назначено',
                datafield: 'PersonID',
                type: 'int',
                width: 50,
                hidden: function (value, credentials) {
                    return resolvehidden(value, credentials);
                }
            }
        ],
        rules: {
            RegNumber: [
                {
                    required: true,
                    message: 'Регистрационный номер заявки нужно указать'
                }],
            RegDate: [
                {
                    required: true,
                    message: 'Дату регистрации заявки нужно указать'
                }]
        },
        copy: function(object) {
            return JSON.parse(JSON.stringify(object));
        },
        createcredentials: function (usercredentials) {
            return {
                credargs: usercredentials,
                allowedit: function (request) {
                    return !this.credargs.isrepair && !this.credargs.isheader;
                },
            };
        },
    }
};

function requestfilemodel(){
    return {
        name: 'requestfile',
        idfield: 'RequestFileID',
        getmethod: '/Repair/GetImage',

        addmethod: '/Repair/UploadImage',
        removemethod: '/Repair/DeleteImage',
        download: '/Repair/DownloadImage',
        label: 'Файлы',
        descriptor: [
            {
                text: 'Дата загрузки',
                datafield: 'RecordDate',
                type: 'date',

                cellsformat: 'dd.MM.yyyy',
                editable: false
            },
            {
                text: 'Описание',
                type: 'string',
                datafield: 'Description',
            },
            {
                text: 'Имя файла',
                datafield: 'FileName',
                type: 'uploader',
                editortype: 'textbox',
            },
            {
                text: '',
                datafield: 'Image',
                type: 'image',
                isvisible: function (args) {
                    return false;
                }
            },
            {
                text: '',
                datafield: 'Mime',
                type: 'string',
                isvisible: function (args) {
                    return false;
                }
            }
        ],
        methods: [
            {
                action: function (args) {
                    var now = new Date(Date.now());
                    return {
                        RequestID: args.RequestID,
                        RecordDate: now.toDateString(),
                        Description: 'описание файла',
                        FileName: 'filename'
                    };
                },
                name: 'add'
            },
            {
                action: function (args) {
                    alert(args);
                },
                name: 'edit-file',
            },
            {
                action: function (args) {
                    gengrid.remove(args);
                },
                name: 'delete-file'
            }

        ],
        getfileargs: function (file) {
            return {
                RequestID: file.RequestID,
                RequestFileID: file.RequestFileID
            };
        },
        createcredentials : function (usercredentials) {
            return {
                credargs: usercredentials,
                touch: function (method) {
                    return true;
                },
                allownew: function() {
                    return !this.credargs.isrepair;
                },
                allowdelete: function() {
                    return false;
                }
            };
        }
    }
};

function requestdetailmodel() {
    return {
    getmethod: '/Repair/GetRepReqDetails',
    addmethod: '/Repair/AddReqDetail',
    removemethod: '/Repair/DeleteRequestDetail',
    updatemethod: '/Repair/UpdateReqDetail',
    idfield: 'ReqDetailID',
    name: 'requestdetail',
    label: 'Детали заявки',
    getloadargs: function(payload) {
        return { Key: payload.RequestID };
    },
    descriptor: [
        {
            datafield: 'ReqDetailID',
            text: 'ID',
            hidden: true,
        },
        {
            text: 'Предписание',
            datafield: 'RemarkOrganID',
            editortype: 'dropdownlist',
            options: [],
            displayname: 'RemarkOrganName',
            method: 'get',
            url: '/Repair/GetRemarkOrgans',
        },
        {
            text: 'Номер предписания',
            datafield: 'RemarkNumber',
            maxlength: 20,
        },
        {
            text: 'Дата предписания',
            datafield: 'RemarkDate',
            cellsformat: 'dd.MM.yyyy',
            editortype: 'datetimeinput',
        },
        {
            text: 'Описание',
            datafield: 'Description',
            maxlength: 250,
            editortype: 'textarea',
            rows: 3
        },
        {
            text: 'Комментарий',
            datafield: 'Comment',
            editortype: 'textarea',
            maxlength: 250,
            rows: 3
        },
        {
            text: 'Предварительная стоимость',
            datafield: 'EstimatePrice',
            hidden: function(row, creds) {
                if (row == undefined) return false;
                if (row.ReqDetailID == null) return true;
                return false;
            },
            canedit: false
        },
        {
            text: 'Номер акта',
            datafield: 'ActNumber',
            hidden: function (row, creds) {
                if (row == undefined) return false;
                if (row.ReqDetailID == null) return true;
                return false;
            },
            canedit: false
        },
        {
            text: 'Дата акта',
            datafield: 'ActDate',
            editortype: 'datetimeinput',
            cellsformat: 'dd.MM.yyyy',
            hidden: function (row, creds) {
                if (row === undefined) return false;
                if (row.ReqDetailID == null) return true;
                return false;
            },
            canedit: false
        },
        ],
        methods: [

            {
                name: 'edit-detail',
                displayname: 'Изменить',
                type: 'rowbutton',
                dialog: true,
                dialogname: 'detaileditor',
                action: function (scope) {
                    return {
                        getpayload: function() {
                            return scope.row;
                        }
                    }
                },
                icon: 'el-icon-edit'
            },
            {
                action: function (scope) {
                    return {
                        url: '/Repair/DeleteRequestDetail',
                        dataType: 'json',
                        data: JSON.stringify({ Key: scope.row.ReqDetailID }),
                        method: 'post',
                        success: function(response, xhr, status) {
                            console.log('request detail removed');
                        },
                        error: function(xhr, error, status) {

                        },
                        complete: function(xhr, status) {

                        },
                        afteraction: function(tabledata) {
                            tabledata.splice(scope.$index, 1);
                        }
                    }

                },
                name: 'delete-detail',
                type: 'rowbutton',
                displayname: 'Удалить',
                icon: 'el-icon-delete'
            },
            {
                name: 'view-detailcomments-comments',
                displayname: 'Переписка',
                dialog: true,
                dialogname: 'detailcomment',
                action: function (scope) {
                    return {
                        getpayload: function () {
                            return { Key: scope.row.ReqDetailID };
                        }
                    }
                },
                icon: 'el-icon-chat-dot-square'
            }
        ],
        new: function(requestid) {
            return {
                ReqDetailID: -1,
                RequestID: requestid,
                RemarkOrganID: null,
                RemarkNumber: null,
                RemarkDate: null,
                Description: null,
                Comment: null,
                EstimatePrice: null,
                ActNumber: null,
                ActDate: null
            }
        },
        createcredentials: function (usercredentials) {
            return {
                credargs: usercredentials,

                touch: function (userinfo, method, row) {
                    if (method.name === 'view-detailcomments-comments') return true;
                    if (userinfo.isheader || userinfo.isclerk) return false;
                    return true;

                },
                allownew: function (owner) {
                    return this.credargs.isadmin || (this.credargs.isrepair && (owner.RegDate === null && owner.RegDate !== undefined));
                },
                allowedit: function (detail) {
                    return this.credargs.isadmin || this.credargs.isrepair;
                }
            };
        }
    }
}

function commentdescriptor() {
    return [
        {
            datafield: 'OwnerKey',
            text: 'RequestID',
            hidden: true
        }, {
            datafield: 'Key',
            text: 'CommentID',
            hidden: true
        }, {
            datafield: 'ParentKey',
            text: 'ParentCommentID',
            hidden: true
        }, {
            datafield: 'RecordDate',
            text: 'Оставлен',
            hidden: true
        }, {
            datafield: 'Comment',
            text: 'Комментарий',
            hidden: false,
        }
    ];
};

function commentmethods(addmethod, removemethod) {
    return [
        {
            name: 'reply-comment',
            displayname: 'Ответить',
            dialog: true,
            dialogname: 'treeroweditor',
            action: function(scope) {
                return {
                    getpayload: function() {
                        return {
                            OwnerKey: scope.data['OwnerKey'],
                            ParentKey: scope.data['Key']
                        }
                    }
                }
            },
            url: addmethod,
            icon: 'el-icon-edit'
        }, {
            name: 'delete-comment',
            displayname: 'Удалить',
            action: function(scope) {
                return {
                    getpayload: function() {
                        return { Key: scope.data['Key'] };
                    }
                }
            },
            url: removemethod,
            icon: 'el-icon-chat-dot-square'
        }
    ];
};



function requestcomment() {
    return {

        resolvedisabled: function (payload, node, data) {
            return false;
        },
        isleaf: function (payload, node, data) {
            return false;
        },
        load: function (node, resolve) {
            this.loaddata(node.data, node.level, resolve);
        },
        label: function (data, node) {
            console.log(22);
            return data['Comment'];
        },
        loaddata: function (payload, node, onsuccess, onerror, oncomplete) {
            return {
                url: '/Repair/LoadRequestComment',
                dataType: 'json',
                data: JSON.stringify({ ParentKey: node.data !== undefined ? node.data.Key : null, Key: payload.Key }),
                method: 'post',
                success: onsuccess,
                error: onerror,
                complete: oncomplete
            }
        },
        idfield: 'Key',
        name: 'requestcomment',

        addnode: '/Repair/AddRequestComment',
        descriptor: commentdescriptor(),
        methods: commentmethods('/Repair/AddRequestComment', '/Repair/RemoveComment'),
        createcredentials: function(creds) {
            return {
                credargs: creds,
                touch: function(userinfo, method, row) {
                    return true;
                },
                allowedit: function(payload) {
                    return !this.credargs.isheader;
                }
            }
        },
        createnew: function (node, payload) {
            return {
                Comment: '',
                OwnerKey: payload.Key,
                ParentKey: node == null ? null : (node.parent === null ? null : node.data.Key),
                Key: -1
            };
        }
    }
}

function requestdetailcomment() {
    return {
        idfield: 'Key',
        name: 'requestdetailcomment',
        label: function(data, node) {
            return data['Comment'];
        },
        createnew: function (node, payload) {
            return {
                Comment: '',
                OwnerKey: payload.Key,
                ParentKey: node == null ? null : (node.parent === null ? null : node.data.Key),
                Key: -1
            };
        },
        createcredentials: function (creds) {
            return {
                credargs: creds,
                touch: function (userinfo, method, row) {
                    return true;
                },
                allowedit: function (payload) {
                    return !this.credargs.isheader;
                }
            }
        },
        loaddata: function (payload, node, onsuccess, onerror, oncomplete) {
            return {
                url: '/Repair/LoadDetailComment',
                dataType: 'json',
                data: JSON.stringify({ ParentKey: node.data !== undefined ? node.data.Key : null, Key: payload.Key }),
                method: 'post',
                success: onsuccess,
                error: onerror,
                complete: oncomplete
            }
        },
        descriptor: commentdescriptor(),
        addnode: '/Repair/AddDetailComment',
        methods: commentmethods('/Repair/AddDetailComment', '/Repair/RemoveDetailComment')
    }
}