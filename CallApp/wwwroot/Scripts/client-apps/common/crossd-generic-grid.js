Vue.component('crossd-generic-grid',
    {
        template: '#crossd-generic-grid',
        data: function() {
            return {
                popovermap: new Map(),
                totalrows: 0,
                searchstring: '',
            };
        },
        mixins: [crossdRemote, crossdAuth, methoddecorator, addnewresolver, methodexecutor, itemcollection],
        computed: {
            searchstarted: function() {
                return (searchstring) =>
                    searchstring.length > 0;
            },
            isediting: function() {
                return false;
            },
            methodsdefined: function() {
                return this.gridmodel.methods !== undefined && this.gridmodel.methods !== null;
            },
            filterable: function() {
                return this.filtermodel !== undefined && this.filtermodel !== null;
            },
            hasleftmethods: function() {
                return this.methodsdefined && this.gridmodel.methods.some(m => m.left !== undefined);
            },
            hasrightmethods: function() {
                return this.methodsdefined && this.gridmodel.methods.some(m => m.left === undefined);
            },
            leftmethods: function() {
                return this.gridmodel.methods.filter(m => m.left !== undefined);
            },
            rightmethods: function() {
                return this.gridmodel.methods.filter(m => m.left === undefined);
            },
     
        },
        props: {
            gridmodel: { type: Object, required: true },

            showrefresh: { type: Boolean, default: false },
            // показывать кнопку обновить
            // поиск
            showsearch: { type: Boolean, defauld: false },
            
            searchmethod: { type: Function },
            // аргументы загрузки
            //payload: {
            //    type: Object,
            //    default: () => {}
            //},
            createnew: {
                type: Function
            },
            filtermodel: {
                type: Object,
                default: function() { return null; }
            },

        },
        methods: {
            error: function(message) {
                return {
                    title: 'Ошибка!',
                    type: 'error',
                    message: message
                };
            },
            warning: function(message) {
                return {
                    title: 'Предупреждение',
                    type: 'warning',
                    message: message
                };
            },

            resolverowclass: function(args) {
                if (this.gridmodel.rowclassresolver !== undefined) {
                    return this.gridmodel.rowclassresolver(args);
                }
                return '';
            },
            popoverkey: function(scope, property) {
                var key = {
                    rowkey: scope.row[this.keyfield],
                    propkey: property.datafield
                };
                return JSON.stringify(key);
            },

            ispopoverloading: function(key) {
                var over = this.popovermap.get(key);
                return (over.hasOwnProperty('isloading') && over.isloading);
            },

            getpopover: function (scope, property) {
                if (property.popover === undefined) return false;
                var popover = property.popover(scope);
                if (popover === undefined || popover === null) return false;
                var overkey = this.popoverkey(scope, property);
                this.popovermap.set(overkey, popover);
                if (popover.url !== undefined) {
                    popover.isloading = true;
                    $.ajax({
                        url: popover.url,
                        data: JSON.stringify(popover.data),
                        method: 'post',
                        contentType: "application/json",
                        async: false,
                        success: (response) => {
                            if (response.success) popover.content = response.data;
                            else popover.content = response.message;
                        },
                        error: (xhr, error, status) => {
                            popover.content = 'Ошибка загрузки данных';
                            console.error(xhr);
                        },
                        complete: (xhr, status) => {
                            popover.isloading = false;
                        }
                    });
                }
                
                return true;
            },
        
            oncellclick: function (row, column, cell, event) {
                //var tmp = {
                //    row,
                //    column,
                //    cell
                //};

                //var canedit = false;
            
                //var property = this.descriptor.find(prop => prop.datafield === column.property);
                //if (property != null) {
                //    if (typeof property.canedit === 'boolean') canedit = property.canedit;
                //    else if (typeof property.canedit === 'function') canedit = property.canedit(row, this.userinfo);
                //    else canedit = true;
                //}
                //if (canedit) this.editing = tmp;
                //else this.editing = null;

            },

            filterdata: function (payload) {
                this.loaddata(payload);
            },
            
            //onaddnewclick: function () {
            //    this.$emit('add-new-clicked', this.createnew(this.payload), (payload) => $.ajax({
            //        url: this.gridmodel.addmethod,
            //        dataType: 'json',
            //        data: JSON.stringify(payload),
            //        method: 'post',
            //        success: (response, xhr, status) => {
            //            if (response.success) this.addresponseitem(response.data);
            //            else console.error(response.message);
            //        },
            //        error: this.onerroradd
            //    }));
            //},

            //onerroradd: function(xhr, error, status) {
            //    console.error('method [' + this.gridmodel.addmethod + '] failed');
            //},

            //onsuccessadd: function(response, xhr, status) {
            //    if (response.success) {
            //        this.tablecontent.push(response.data);
            //    } else {
            //        console.error(response.message);
            //    }
            //},

            isvisible: function (property) {
                if (property.hidden !== undefined) {
                    if (typeof property.hidden === 'boolean') return !property.hidden;
                    if (typeof property.hidden === 'function') return !property.hidden(undefined, this.userinfo);
                }
                return true;
            },

            reload: function () {
                this.loaddata();
            },
            search: function (value) {
                
            },

            oncurrentchange: function(oldrow, newrow) {
                console.log('oncurrentchange: ');
            },

            
            onkeyup: function(event) {
                console.log(event);
            }



        },
       

    }
)