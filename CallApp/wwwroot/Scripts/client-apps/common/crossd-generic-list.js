Vue.component('crossd-generic-list',
    {
        template: '#crossd-generic-list',
        mixins: [crossdRemote, crossdAuth, methoddecorator, methodexecutor],
        data: function() {
            return {
                list: this.customlist || [],
                searchargs: { SearchString: ''},
                isloading: false,
                searchstarted: false,
                searchresult: [],
                searchmodel: this.listmodel === undefined ? [] : this.listmodel.remotesearchmodel,
                listcount: this,
            }
        },
        watch: {
            args: {
                deep: true,
                immediate: true,
                handler: function(value, old) {
                    if (value !== undefined && this.searchable) {
                        this.load(value);
                    }
                }
            }
        }, 
        props: {
            customlist: { type: Array },
            args: { type: Object, default: () => undefined },
            liststyle: { type: String },
            geturl: { required: true, type: String },
            searchable: { type: Boolean, default: false },
            listmodel: { type: Object, required: true },
            responsecallback: { type: Function },
            row: { type: Object },
        },

        computed: {
            searched: function () {
                return (args, model, list) => {
                    if (args !== '') {
                        var res = list.filter(o => model.search(o, args));
                        this.listcount = res.length;
                    }
                    return res || list;
                }
            },
            
        },

        methods: {

            load: function (args) {
                this.isloading = true;
                $.ajax({
                    url: this.geturl,
                    data: JSON.stringify(args),
                    method: 'post',
                    dataType: 'json',
                    contentType: "application/json",
                    success: (response, status, xhr) => {
                        if (response.success !== undefined && typeof response.success === 'boolean') {
                            if (response.success) {
                                if (response.data !== undefined) {
                                    if (Array.isArray(response.data)) {
                                        this.list = response.data;

                                    } else {
                                        if (this.responsecallback !== undefined) {
                                            this.responsecallback(response, this.setlistdata);
                                        }
                                    }
                                    this.listcount = this.list.length;
                                }
                            } else {
                                if (response.message !== undefined) {
                                    console.error(response.message);
                                } else console.error(response);
                            }
                        }
                    },
                    error: (xhr, status, error) => console.error(error),
                    complete: (xhr, status) => {
                        console.log(status);
                        this.isloading = false;
                    }
                });
            },

            searchargs: function(args) {
                return { SearchString: args };
            },
            setlistdata: function(listdata) {
                this.list = listdata;
            },

            resolvevisible: function(checkingitem, value) {
                if (checkingitem.hidden !== undefined) {
                    if (typeof checkingitem.hidden === 'boolean') return !checkingitem.hidden;
                    else if (typeof checkingitem.hidden === 'function') return !checkingitem.hidden(value);
                } else return true;
            },

            onclick: function (result, item) {

                console.log(result);
            },
            onsearch: function(o, list, model) {
                if (o === '') {
                    this.isloading = true;
                    
                    this.currentmodel = this.listmodel;
                    this.searchresult = null;
                    this.searchstarted = false;
                    this.isloading = false;
                } else {
                    if (!this.searchstarted) this.searchstarted = true;
                    if (model !== undefined)
                        this.currentmodel = model;
                    else {
                        model = this.listmodel;
                    }
                    this.searchresult = (list === undefined ? this.list : list).filter(li => {

                        if (model.search !== undefined && typeof model.search === 'function')
                            return model.search(li, o.toLowerCase());
                        else {
                            var i = model.title(li).toLowerCase();
                            return i.includes(o.toLowerCase());
                        }
                    });
                    if (this.searchresult.length === 0 && model.remotesearchmodel !== undefined) {
                        this.isloading = true;
                        $.ajax({
                            url: model.remotesearchmodel.url,
                            data: JSON.stringify({ SearchString: o }),
                            method: 'post',
                            contentType: "application/json",
                            success: (response) => {
                                this.onsearch(o, response.data, model.remotesearchmodel);
                            },
                            error: (xhr, status, error) => console.error(error),
                            complete: (xhr, status) => this.isloading = false
                        });
                    }
                }
            },

            scope: function(item, index) {
                return { item, index };
            }
        },
      
        mounted: function() {
            
            if (this.customlist !== undefined) {
                if (this.liststyle === 'cardview') {
                    
                }
            } else {
                this.isloading = true;
                this.load(this.args);
                
            }
        }
    })