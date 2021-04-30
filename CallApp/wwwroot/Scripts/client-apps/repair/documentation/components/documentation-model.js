var constructionprojectdescriptor = [
    {
        datafield: 'ProjectID',
        text: 'ID',
        hidden: true,
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
        //canedit: function (row, credentials) {
        //    if (credentials.isrepair && row.RegDate == null) return true;
        //    return credentials.isadmin;
        //},
        getcustomdata: function (row) {
            return { datafield: this.datafield, Key: row.ObjectID };
        }
    },
    {
        datafield: 'ProjectNumber',
        text: 'Типовой проект',
        width: 80
    },
    {
        datafield: 'ProjectHeader',
        text: 'Название',
        width: 200
    },
    {
        datafield: 'ProjectConditions',
        text: '(комментарий)',
        width: 120,
    },
    {
        datafield: 'SeriesHeader',
        text: 'Серия', 
        width: 200,
    }
    ];
var projectalbumdescriptor = [
    {
        datafield: 'ProjectID',
        text: 'ProjectID',
        hidden: true,
    },
    {
        datafield: 'AlbumID',
        text: 'AlbumID',
        hidden: true,
    },
    {
        datafield: 'AlbumNumber',
        text: 'Номер альбома'
    },
    {
        datafield: 'AlbumHeader',
        text: 'Заголовок'
    },
    {
        datafield: 'AlbumTitle',
        text: 'AlbumTitle'
    }
];

function projectmodel() {
    return {
        name: 'projectmodel',
        label: 'Типовые проекты',
        idfield: 'ProjectID',
        getloadargs: function(payload) {
            return {};
        },
        descriptor: constructionprojectdescriptor,
        rules: {
            BuildingID :[{
                required: true, message: 'Объект недвижимости нужно указать'
            }]
        },
        addmethod: '/RepDocumentation/CreateProject',
        getmethod: '/RepDocumentation/GetProjectList',
        updatemethod: '/RepDocumentation/EditProject',
        removemethod: '/RepDocumentation/DeleteProject',
        methods: [
            {
                name: 'edit-album-new',
                displayname: 'Добавить альбом',
                dialog: true,
                url: '/RepDocumentation/CreateAlbumTitle',
                dialogname: 'albummodelform',
                action: function (scope) {
                    return {
                        getpayload: function() {
                            return {
                                AlbumID: null,
                                ProjectID: scope.row.ProjectID,
                                AlbumNumber: '',
                                AlbumHeader: '',
                                AlbumTitle: ''
                            };
                        }
                    }
                },
                icon: 'el-icon-circle-plus-outline'
            },
            {
                name: 'view-album-list',
                dialog: true,
                dialogname: 'albummodelgrid',
                displayname: 'Список альбомов',
                action: function (scope) {
                    return {
                        getpayload: function() {
                            return {
                                Key: scope.row.ProjectID
                            }
                        }
                    }
                    //grid.$refs['albummodelgrid'].show(scope.row, scope);
                },
                icon: 'el-icon-view'
            },
            {
                name: 'edit-project',
                dialog: true,
                dialogname: 'projectform',
                displayname: 'Редактировать типовой проект',
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
                name: 'delete-project',
                displayname: 'Удалить типовой проект',
                action: function(scope) {
                    return {
                        url: '/RepDocumentation/DeleteProject',
                        data: JSON.stringify({ Key: scope.row.ProjectID }),
                        dataType: 'json',
                        method: 'post',

                    }
                },
                icon: 'el-icon-delete'
            }
            ],
        createcredentials: function(args) {
            return {
                credargs: args,
                touch: function(userinfo, method, row) {
                    return true;
                },
                allowedit: function(row) {
                    return this.credargs.isadmin;
                }
            }
        },
        createnew: function(userinfo) {
            return {
                ObjectID: userinfo.objectid,
                ProjectID: -1,
                ProjectNumber: '',
                ProjectHeader: '',
                ProjectConditions: '',
                SeriesHeader: ''
            }
        }
    }
};

function albumcontent() {






    return {
        label: function(data, node) {
            return data.ContentRowNumber == undefined ? data.Title : data.ContentRowNumber + '. ' + data.Title;
        },
        resolvedisabled: function(payload, node, data) {
            return false;
        },
        isleaf: function(payload, node, data) {
            return false;
        },
        load: function(node, resolve) {
            this.loaddata(node.data, node.level, resolve);
        },
        loaddata: function (payload, node, onsuccess, onerror, oncomplete) {
            return {
                url: '/RepDocumentation/GetAlbumContents',
                dataType: 'json',
                data: JSON.stringify({ ParentKey: node.data !== undefined ? node.data.Key : null, Key: payload.Key }),
                method: 'post',
                success: onsuccess,
                error: onerror,
                complete: oncomplete
            }
        },

        addnode: '/RepDocumentation/AddAlbumContents',
        deletenode: '/RepDocumentation/DeleteAlbumContentRow',
        updatenode: '/RepDocumentation/EditAlbumContentRow',
        sub: 'subcontents',
        name: 'albumcontent',

        idfield: 'Key',
        methods: [
            {
                name: 'edit-row',
                displayname: 'edit-row',
                dialog: true,
                dialogname: 'treeroweditor',
                action: function (scope) {
                    return {
                        getpayload: function() {
                            return scope.data;
                        }
                    }
                },
                url: '/RepDocumentation/EditAlbumContentRow',
                icon: 'el-icon-edit'
            },
            {
                name: 'add-child',
                displayname: 'add-child',
                url: '/RepDocumentation/AddAlbumContents',
                dialog: true,
                dialogname: 'treeroweditor',
                action: function (scope) {
                    return {
                        getpayload: function() {
                            return {
                                Key: -1,
                                ParentKey: scope.data['ContentRowID'],
                                OwnerKey: scope.data['ProjectAlbumID'],
                                ContentRowNumber: '',
                                Title: '',
                                ListNumber: '',
                                PageNumber: ''
                            }
                        }
                    }
                },
                icon: 'el-icon-circle-plus-outline'
            },
            {
                name: 'delete-children',
                displayname: 'remove-child',
                action: function (scope) {
                    return {
                        getpayload: function() {
                            return { Key: scope.data['ContentRowID'] };
                        }
                    }
                    //grid.$refs["albummodelform"].show(scope.row, scope);
                    tree.deleteTreeNode(scope);
                },
                icon: 'el-icon-delete-solid'
            },
        ],
        descriptor: [
            { datafield: 'Key', text: 'RowID', hidden: true }
            , { datafield: 'ParentKey', text: 'ParentRowID', hidden: true }
            , { datafield: 'OwnerKey', text: 'AlbumID', hidden: true }
            , { datafield: 'ContentRowNumber', text: '№ п/п' }
            , { datafield: 'Title', text: 'Заголовок' }
            , { datafield: 'ListNumber', text: '№ листа' }
            , { datafield: 'PageNumber', text: '№ стр' }
        ],
      
        createnew: function (node, payload) {
            return {
                OwnerKey: payload.Key,
                Key: -1,
                ParentKey: (node===undefined ||node === null) ? null : node.data.Key,
                Title: ''
            }
        }
    }
}

function projectalbummodel() {
    return {
        name: 'albummodel',
        label: 'Альбом технической документации типового проекта',
        idfield: 'AlbumID',
        ownerfield: 'ProjectID',
        descriptor: projectalbumdescriptor,
        addmethod: '/RepDocumentation/CreateAlbumTitle',
        getmethod: '/RepDocumentation/GetAlbumsList',
        updatemethod: '/RepDocumentation/UpdateAlbumTitle',
        removemethod: '/RepDocumentation/DeleteAlbumTitle',
        createcredentials: function (args) {
            return {
                credargs: args,
                touch: function (method, row) {
                    return true;
                },
                allowedit: function (row) {
                    return true;
                },
                allowadd: function() {
                    return true;
                }
            }
        },
        createnew: function (project) {
            return {
                AlbumID: -1,
                ProjectID: project.Key,
                AlbumNumber: '',
                AlbumHeader: '',
                AlbumTitle: ''
            }
        },
        loadargs: function(object) {
            return { Key: object.ProjectID };
        },
        methods: [
            {
                name: 'edit-album',
                dialog: true,
                dialogname: 'albummodelform',
                displayname: 'Редактировать альбом',
                action: function (scope) {
                    return {
                        getpayload: function () {
                            return scope.row;
                        }
                    }
                },
                icon: 'el-icon-edit'
            },
            {
                name: 'delete-album',
                displayname: 'Удалить альбом',
                action: function (scope) {
                    return {
                        url: '/RepDocumentation/DeleteAlbumTitle',
                        data: JSON.stringify({ Key: scope.row['AlbumID'] }),
                        dataType: 'json',
                        method: 'post',
                    }
                },
                icon: 'el-icon-delete'
            },
            {
                name: 'view-contents',
                displayname: 'Содержание',
                dialog: true,
                dialogname: 'albumcontents',
                action: function(scope) {
                    return {
                        getpayload: function () {

                            return { Key: scope.row['AlbumID'] };

                        },
                        confirmdialog: function () {
                            console.log('confirming');
                        }
                    }
                },
                icon: 'el-icon-notebook-2'
            }],
        save: function(row, scope) {
            $.ajax({
                url: row['AlbumID'] > 0 ? this.updatemethod: this.addmethod,
                dataType: 'json',
                data: JSON.stringify(row),
                method: 'post',
                success: function(response, xhr, status) {
                    console.log('AAAAB');
                    scope.onsuccess(response, xhr, status);
                },
                error: function(xhr, error, status) {
                    scope.onerror(xhr, error, status);
                }
            });
        },
        getloadargs: function(payload) {
            return { Key: payload.ProjectID };
        }
    }
}