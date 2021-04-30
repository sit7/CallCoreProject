Vue.component('crossd-generic-tree',
    {
        template: '#crossd-generic-tree',
        mixins: [crossdAuth, methoddecorator, itemcollection, methodexecutor],
        data: function() {
            return {
                treeoptions: {
                    label: this.treemodel.label,
                    children: 'nodes'
                },
                nodes: [],
                showByIndex: null,
                
               
                resolve: undefined
            }
        },
        props: {
            treemodel: { required: true, type: Object },
            nodestyle: { type: String, default: 'default' },
        },

        methods: {
            
            formatdate: function (value) {
                var d = new Date(value);
                return d.toLocaleDateString();
            },
            

       
            onsuccess: function (response, resolve) {
                resolve(response.data);
            },
            onnodeexpand: function(obj, node, treenode) {

            },



      
            loadtree: function (node, resolve) {
                // запомним функцию resolve
                if (this.resolve === undefined) this.resolve = resolve;

                if (node.data === undefined || node.data.Key > 0) {
                    $.ajax({
                        url: this.treemodel.getmethod,
                        data: JSON.stringify(this.treemodel.data(this.payload, node)),
                        method: 'post',
                        contentType: "application/json",
                        success: (response, xhr, status) => this.resolveresponse(resolve, response, node),
                        error: this.onerror,
                        complete: this.oncomplete
                    });
                }
            },

            createnode: function(data) {
                return Object.assign({}, data, { nodes: [] });
            },

            resolveresponse: function (resolve, response, node) {                
                if (Array.isArray(response.data)) {
                    if (response.data.length > 0) {
                        var mapres = response.data.map(this.createnode);
                        resolve(mapres);
                    } else {
                        resolve([]);
                    }
                } else {
                    resolve([this.createnode(response.data)]);
                }
            },


        },

        mounted: function() {
            this.$on('on-after-new',
                (response, node) => {
                    if (node !== undefined) this.$refs.tree.append(response.data, node);
                    else this.resolveresponse(this.resolve, response, node);
                });
            this.$on('on-delete', (node) => this.$refs.tree.remove(node));
            this.$on('on-after-update', (response, node) => Object.assign(node.data, response.data));
        }


    })