Vue.component('crossd-generic-column-content',
    {
        
        data: function () {

            return {
                propertyvalue: this.rawvalue,
                filelist: [],
                isloading: false,
                selectedoption: Object
            }
        },
      
        computed: {
            isuploader: function() {
                return this.property.editortype === 'uploader';
            },
            issuggestor: function() {
                return this.property.editortype === 'suggestor';
            },
            isdropdown: function() {
                return this.property.editortype === 'dropdownlist';
            },
            isautocomplete: function() {
                return this.property.editortype === 'autocomplete';
            },
            isdate: function() {
                return this.property.editortype === 'date';
            },
            isdatetime: function() {
                return this.property.editortype === 'datetime';
            },
            isrouterlink: function() {
                return this.property.routeinfo !== undefined && typeof this.property.routeinfo === 'function';
            },
            ischeckbox: function() {
                return this.property.editortype === 'checkbox';
            },
            istextbutton: function() {
                return this.property.editortype === 'textbutton';
            },
            istextarea: function() {
                return this.property.editortype === 'textarea';
            },
            iseditmode: function() {
                //return this.property.descriptor === undefined && this.ispropertyeditable !== undefined && this.ispropertyeditable(this.property);
                return this.ispropertyeditable;
            },
            iscomposite: function() {
                return this.property.descriptor !== undefined &&
                    Array.isArray(this.property.descriptor) &&
                    this.property.format !== undefined &&
                    typeof this.property.format === 'function';
            }
            //optionsloaddata: function() {
            //    return (row) => JSON.stringify((typeof this.property.getcustomdata === 'function'
            //        ? this.property.getcustomdata(row)
            //        : { datafield: this.property.datafield }));
            //},
     


        },

        template: '#crossd-generic-column-content',
        props: {
            owner: { type: String, required: true },
            row: { type: Object, required: true },
            property: { type: Object, required: true },
            customvalue: { type: Function },
            isoptiondisabled: { type: Function | Boolean, default: ()=>false },
            ispropertyvisible: { type: Function | Boolean, default: ()=>true },
            ispropertyeditable: { type: Function | Boolean, default: ()=>false },
            remoteoptions: { type: Function | Array },
            rawvalue: { type: String | Number }
        },

        methods: {

            istruevalue: function(value) {
                if (typeof value === 'boolean') return value;
                if (typeof value === 'number')
                    return value === 1;
                console.warn(value);
            },
            //selectedoption: function (row, property) {
            //    var currentoptions = this.options(row, property);
            //    return currentoptions.find(o => o[property.datafield] === this.propertyvalue) || null;
            //},
            getcustomdata: function (row, property) {
                if (property.getcustomdata !== undefined && typeof property.getcustomdata === 'function')
                    return JSON.stringify(property.getcustomdata(row));
                return JSON.stringify({ datafield: property.datafield });
            },

            currentoption: function (payload, property) {
                var options = this.remoteoptions(payload, property);
                if (Array.isArray(options) && options.length > 0) {
                    this.selectedoption = options.find(oli => oli[property.datafield] === payload[property.datafield]);
                    return this.selectedoption !== undefined;
                }
                return false;

            },

            validaterule: function(rule, row, value) {
                if (typeof rule === 'function') return rule(row, value);
                return false;
            },

            formatDate: function(value) {
                return value === null ? '' : new Date(value).toLocaleDateString('ru-RU');
            },

            onpropertychange: function (value, prop) {
                this.$emit('property-changed', value, prop || this.property);
            },

            dropdownremote: function() {

            },

            autocompleteselect: function(event) {
                this.row[this.property.datafield] = event[this.property.datafield];
                this.acvalue = event[this.property.displayvalue];
            },
            autocompletequery: function (querystring, callback) {
                $.ajax({
                    url: this.property.url,
                    data: JSON.stringify({ SearchString: querystring }),
                    dataType: 'json',
                    method: 'post',
                    contentType: "application/json",
                    success: function(response, xhr, status) {
                        callback(response.data);
                    },
                    error: function(xhr, error, status) {
                        console.error(error);
                    },
                    complete: function(xhr, status) {

                    }
                });


            },

            formatSelected: function (suggestion) {
                if (this.property.formatSelected !== undefined && typeof this.property.formatSelected === 'function') return this.property.formatSelected(suggestion, this.row);
                return suggestion.value;
            },
            onSelect: function (suggestion, changed) {
                this.property.onSelect(suggestion.data, changed, this.row);
            },

            suggestorsettings: function() {
                return {
                    token: "0289160a02213271903b8c31ce47c670c58c3093",
                        // у такого свойства должен быть указан тип подсказок
                        type: this.property.suggestortype,
                        scrollOnFocus: false,
                        triggerSelectOnBlur: false,
                        triggerSelectOnEnter: false,
                        // что произойдёт при выборе подсказки
                        // вызовем this.onSelect и передадим в него property
                        onSelect: this.onSelect,
                        // если нужно отформатировать выбранную подсказку, в том числе -- что запихнуть в элемент формы
                        formatSelected: this.formatSelected,

                    // это на будущее
                    //formatResult: (value, currentvalue, suggestion, options) => this.formatResult(property, value, currentvalue, suggestion, options),
                    //onInvalidateSelection: (suggestion) => this.onInvalidateSelection(property, suggestion),
                    //onSearchComplete: property.onSearchComplete || null,
                    //onSearchError: property.onSearchError || null,
                    //onSuggestionsFetch: property.onSuggestionsFetch || null,
                    //onSelectNothing: property.onSelectNothing || null,

                }  
            },
            
            onselectvisiblechange: function(isopening) {
                
            },

            onselectblur: function(event) {
                
            },
            propertyloadcomplete: function(xhr, status) {
                
            },
            onsuccessload: function(response) {
                
                this.$emit('drop-down-loaded', this.params, this.property, response);
                this.optionlist = response;
            },

            onsuccessaction: function (changedproperties, response) {

                this.$emit('batch-property-update', changedproperties, ((row) =>
                    changedproperties.forEach(prop => row[prop] = response.data[prop])));
            },
            onclick: function(property) {
                this.$emit('column-button-clicked', property);
            },


        },



        mounted: function () {
            
            if (this.isautocomplete) {
                if (this.property.entryurl !== undefined && typeof this.rawvalue === 'number') {
                    $.ajax({
                        url: this.property.entryurl,
                        method: 'post',
                        contentType: "application/json",
                        data: JSON.stringify({ Key: this.rawvalue }),
                        success: (response, xhr, status) => {
                            if (response.success) {
                                this.propertyvalue = response.data[this.property.displayvalue];
                            } else {
                                console.error(response.message);
                            }
                        },
                        error: (xhr, status, error) => console.error(xhr),
                        complete: (xhr, status) => console.log(status)
                    });
                }
            }

            //if (this.row.hasOwnProperty(datafield)) {
            //    var propertyvalue = this.row[datafield];
            //    var valuetype = typeof propertyvalue;
            //    if (this.ischeckbox) {
            //        this.columnvalue = valuetype === 'number' ? propertyvalue === 1 : propertyvalue;
            //    } else if (this.isdate) {
            //        if (propertyvalue !== null)
            //        this.columnvalue = new Date(propertyvalue).toLocaleDateString('ru-RU');
            //    } else if (this.isdatetime) {
            //        console.warn('datetime formatting is not implemented');
            //    } else if (this.isautocomplete) {
            //        if (this.property.entryurl !== undefined && valuetype === 'number') {
            //            $.ajax({
            //                url: this.property.entryurl,
            //                method: 'post',
            //                dataType: 'json',
            //                data: JSON.stringify({ Key: propertyvalue }),
            //                success: (response, xhr, status) => {
            //                    if (response.success) {
            //                        this.columnvalue = response.data[this.property.displayvalue];
            //                    } else {
            //                        console.error(response.message);
            //                    }
            //                },
            //                error: (xhr, status, error) => console.error(xhr),
            //                complete: (xhr, status) => console.log(status)
            //            });
            //        } else {
            //            this.columnvalue = propertyvalue;
            //        }
            //    } else if (this.isdropdown) {
            //        //var args = this.optionsloaddata(this.row);
            //        //var mapvalue = this.property.map.get(args);
            //        //if (mapvalue === undefined) {
            //        //    $.ajax(this.optionsettings(args)).then((response) => {
            //        //        this.options = response.data;
            //        //    });
            //        //}
            //        //if (propertyvalue !== null && propertyvalue !== undefined) {
            //        //    var options = this.property.map.get(this.getcustomdata(this.row, this.property));
            //        //    console.log(options.length);
            //        //}
            //        this.columnvalue = propertyvalue;

            //    } else if (this.isuploader) {
            //        this.isloading = true;
            //        $.ajax({
            //            url: this.property.geturl,
            //            data: JSON.stringify(this.property.data(this.row)),
            //            method: 'post',
            //            dataType: 'json',
            //            success: (response, xhr, status) => {

            //                setTimeout(() => {

            //                        this.filelist = response.data;
            //                    },
            //                    500);

            //            },
            //            error: (xhr, error, status) => {
            //                console.error(222);
            //            },
            //            complete: (xhr, status) => { this.isloading = false; }
            //        });
            //    } else if (this.property.format !== undefined && typeof this.property.format === 'function') {
            //        this.columnvalue = this.property.format(this.row);
            //    } else {
            //        this.columnvalue = propertyvalue;
            //    }
            //} else {
            //    //console.warn('passed object has no property [' + datafield + ']');
            //}


            if (this.property.suggestortype !== undefined && this.property.suggestortype !== null) {
                if (this.$refs[this.property.datafield + '_inner'])
                    $(this.$refs[this.property.datafield + '_inner'].$refs['input']).suggestions(this.suggestorsettings());
            } 

        }
    })