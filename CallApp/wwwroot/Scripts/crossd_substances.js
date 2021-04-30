   ////перемещено из crossd.js
        
        var substances = ["Energy", "Vitamin", "Mineral"];
        var substancesModal = ["EnergyModal", "VitaminModal", "MineralModal"];

        var countTooltip = 0;

        var substancesVar = {
            "Energy": {
                source: "",
                dataAdapter: ""
            },
            "Vitamin": {
                source: "",
                dataAdapter: ""
            },
            "Mineral": {
                source: "",
                dataAdapter: ""
            },
        };

        var substancesVarModal = {
            "EnergyModal": {
                source: "",
                dataAdapter: ""
            },
            "VitaminModal": {
                source: "",
                dataAdapter: ""
            },
            "MineralModal": {
                source: "",
                dataAdapter: ""
            },
        };

        //оформление гридов БЖУ - не модальный вариант

        var makeSubstancesGrids = function (substanceString, gridWidth, nameWidth, valueWidth, _idUser) {

            substancesVar[substanceString].source =
            {
                datatype: "json",
                datafields: [
                    { name: "id", type: "number" },
                    { name: "RecipeElementID", type: "number" },
                    { name: "RecipeID", type: "number" },
                    { name: "ElementID", type: "number" },
                    { name: "Name", type: "string" },
                    { name: "Value", type: "number" }
                ],
                id: 'RecipeElementID',
                url: "",
                async: false,
                updaterow: function (rowid, rowdata, commit) {
                    rowdata["UserID"] = _idUser;
                    $.ajax({
                        cache: false,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        url: "../../fooRecipe/RecipeElementEdit/",
                        data: JSON.stringify(rowdata),
                        type: "POST",
                        success: function (data, status, xhr) {
                            //rowdata.IncDocDetailID = data.IncDocDetailID;
                            //commit(true);
                            //$("#jqxgrid").jqxGrid("updatebounddata", "data");
                            //$('#jqxgrid').jqxGrid('selectrow', $('#jqxgrid').jqxGrid('getrowboundindexbyid', data.IncDocDetailID));
                            //setTimeout(function() {
                            //    $("#jqxgrid").jqxGrid('begincelledit', $('#jqxgrid').jqxGrid('getrowboundindexbyid', data.IncDocDetailID), "FoodID");
                            //}, 10);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            openAlertWindow("Вылетели в ошибку 3   " + errorThrown);
                            commit(false);
                        }
                    });
                }
            };

            substancesVar[substanceString].dataAdapter = new $.jqx.dataAdapter(substancesVar[substanceString].source);

            $("#" + substanceString + "Grid").jqxGrid(
            {
                width: gridWidth,
                //source: dataAdapter,
                editable: true,
                localization: getLocalization(),
                columnsresize: true,
                columns: [
                    {
                        text: "Показатель", datafield: "Name", width: nameWidth, editable: false
                    },
                    {
                        text: "На порцию", datafield: "Value", width: valueWidth, cellsalign: "right",
                        cellclassname: formatRecordStatus,
                        cellsrenderer: formatcell
                    }
                ]
            });
        }

        //оформление гридов БЖУ - модальный вариант

        var makeSubstancesGridsModal = function (substanceString, gridWidth, nameWidth, valueWidth) {
            substancesVarModal[substanceString].source =
            {
                datatype: "json",
                datafields: [
                    //{ name: "RecipeElementID", type: "number" },
                    //{ name: "Name", type: "string" },
                    //{ name: "Value", type: "number" },

                    { name: "id", type: "number" },
                    { name: "RecipeElementID", type: "number" },
                    { name: "RecipeID", type: "number" },
                    { name: "ElementID", type: "number" },
                    { name: "Name", type: "string" },
                    { name: "Value", type: "number" }

                ],
                id: 'RecipeElementId',
                url: "",
                async: false,
                updaterow: function (rowid, rowdata, commit) {
                    //rowdata["UserID"] = _idUser;
                    $.ajax({
                        cache: false,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        url: "../../fooRecipe/RecipeElementEdit/",
                        data: JSON.stringify(rowdata),
                        type: "POST",
                        success: function (data, status, xhr) {
                            console.log(data);
                            //rowdata.IncDocDetailID = data.IncDocDetailID;
                            //commit(true);
                            //$("#jqxgrid").jqxGrid("updatebounddata", "data");
                            //$('#jqxgrid').jqxGrid('selectrow', $('#jqxgrid').jqxGrid('getrowboundindexbyid', data.IncDocDetailID));
                            //setTimeout(function() {
                            //    $("#jqxgrid").jqxGrid('begincelledit', $('#jqxgrid').jqxGrid('getrowboundindexbyid', data.IncDocDetailID), "FoodID");
                            //}, 10);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            openAlertWindow("Вылетели в ошибку 3   " + errorThrown);
                            commit(false);
                        }
                    });
                }
            };

            substancesVarModal[substanceString].dataAdapter = new $.jqx.dataAdapter(substancesVarModal[substanceString].source);

            $("#" + substanceString + "Grid").jqxGrid(
            {
                width: gridWidth,
                //source: dataAdapter,
                editable: true,
                localization: getLocalization(),
                columnsresize: true,
                columns: [
                    {
                        text: "Показатель", datafield: "Name", width: nameWidth
                    },
                    {
                        text: "На порцию", datafield: "Value", width: valueWidth, cellsalign: "right",
                        //cellclassname: formatRecordStatus,
                        cellsrenderer: formatcell
                    }
                ]
            });
        }

        ////перемещено из crossd.js