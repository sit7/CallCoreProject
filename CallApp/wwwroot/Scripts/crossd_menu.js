function initializeMenues(userid, objectid, isplanmenu) {
        
        // создание шаблона для новой строки в таблице fooMenu
        window.generateMenu = function () {
            var menu = {};
            menu["MenuDate"] = new Date();
            menu["MenuStatusID"] = 1;
            menu["DayNumber"] = 1;
            menu["UserID"] = userid;
            menu["ObjectID"] = 4;
            menu["RecordStatusID"] = 3;
            return menu;
        }

        // создание шаблона для новой строки в таблице fooMenuCategoryTimeRecipe
        window.generateMenuCategoryTimeRecipe = function (id, eatingID, orderNumber) {
            var categoryRow = {};
            categoryRow["MenuCategoryID"] = id;
            categoryRow["EatingTimeID"] = eatingID || 0;
            categoryRow["OrderNumber"] = orderNumber;
            categoryRow["RecipeID"] = 0;
            categoryRow["Netto"] = 0 ;
            categoryRow["ParentMenuCategoryTimeRecipeID"] = null;
            categoryRow["PortionCount"] = $("#portionCountInput").val();
            //categoryRow["ControlPortionCount"] = 0;
            categoryRow["PortionCount24"] = 0;
            categoryRow["PortionCount24Fact"] = 0;
            categoryRow["PortionCountFact"] = $("#PortionCountFact").val();
            categoryRow["PersonPortionCount"] = (eatingID == 3 ? $("#PersonPortionCount").val() : 0);
            categoryRow["UserID"] = userid;
            categoryRow["RecordStatusID"] = 3;
            categoryRow["MenuCorrectionTypeID"] = 0;
            return categoryRow;
        }

        // создание шаблона для новой строки в гриде редактирования рецепта
        window.generateRecipeRow = function (id) {
            var recipeRow = {};
            recipeRow["FoodRecipeID"] = -1;
            recipeRow["RecordDate"] = null;
            recipeRow["UserID"] = userid;
            recipeRow["FoodID"] = 0;
            recipeRow["Brutto"] = 0;
            recipeRow["Netto"] = 0;
            recipeRow["RecipeID"] = id;
            recipeRow["RecordStatusID"] = 3;
            recipeRow["PercentValue"] = null;
            return recipeRow;
        }

        // переменные, необходимые в глобальной области видимости для передачи в события и функции
        window.mainGridRecipeID;
        window.modalGridRecipeID;
        window.modalNetto;
        window.timeRecipeCategoryRow;
        window.forRecalcRow;
        window.timeRecipeRowID;
        window.recipeContents;
        window.userid = userid;
        window.e;
        window.menuCategoryID;
        window.wasEvent = false;
        window.dropdownRecipeData = [];

        // названия для категорий меню из таблицы fooEatingCategory
        window.eatingCategories = [
            { EatingCategoryID: 1, Name: "Ясли 12 часов" },
            { EatingCategoryID: 2, Name: "Сад 12 часов" },
            { EatingCategoryID: 3, Name: "Сад 10 часов" },
            { EatingCategoryID: 5, Name: "Круглосуточный сад" },
            { EatingCategoryID: 6, Name: "Персонал" },
            { EatingCategoryID: 7, Name: "Ясли 10 часов" },
            { EatingCategoryID: 8, Name: "Круглосуточные ясли" },
            { EatingCategoryID: 9, Name: "Аллергогруппа (ясли)" },
            { EatingCategoryID: 10, Name: "Аллергогруппа (сад)" },
            { EatingCategoryID: 12, Name: "Ясли 12 часов 76" },
            { EatingCategoryID: 13, Name: "Сад 12 часов 76" },
            { EatingCategoryID: 14, Name: "Ранний возраст 12"}
        ];

        // типы для приходных документов
        window.times = [
            { EatingTimeID: 0, Name: "нет", color: "white" },
            { EatingTimeID: 1, Name: "Завтрак", color: "#e4b3b3" },
            { EatingTimeID: 2, Name: "II завтрак", color: "#d8b3c4" },
            { EatingTimeID: 3, Name: "Обед", color: "#d8c1f5" },
            { EatingTimeID: 4, Name: "Упл. полдник", color: "#f3f5ce" },
            { EatingTimeID: 5, Name: "Ужин", color: "#d8f5dc" },
            { EatingTimeID: 6, Name: "Ужин 2", color: "#eadebb" },
            { EatingTimeID: 7, Name: "Полдник", color: "#f3f5ce" }
        ];

        window.timesForDropdown = cloneObject(times);
        timesForDropdown.splice(0, 1);

        // source для выпадающего списка продуктов
        window.foodSource = {
            datatype: "json",
            datafields: [
                 { name: "FoodID", type: "number" },
                 { name: "Name", type: "string" }
            ],
            id: "FoodID",
            url: "",
            async: false
        };

        // для выпадающего списка с единицами измерения
        window.menuCorrectionTypes = [
            { MenuCorrectionTypeID: 0, Name: "Ничего не делать" },
            { MenuCorrectionTypeID: 1, Name: "Возврат/дополнение продуктов" },
            { MenuCorrectionTypeID: 2, Name: "Изменение объема порции" },
            { MenuCorrectionTypeID: 3, Name: "Списание невостребованных порций" }
        ];
        
        window.menuCorrectionSource =
        {
            datatype: "json",
            datafields: [
                { name: "Name", type: "string" },
                { name: "MenuCorrectionTypeID", type: "number" }
            ],
            id: "MenuCorrectionTypeID",
            url: "../../fooMenu/GetMenuCorrectionTypes",
            async: false
        };

        window.menuCorrectionTypesDA = new $.jqx.dataAdapter(menuCorrectionSource, {
            autoBind: true
        });

        // получение рецептов
        window.recipeDS =
        {
            datatype: "json",
            datafields: [
                 { name: "RecipeID", type: "number" },
                 { name: "Name", type: "string" },
                 { name: "Netto", type: "number" },
                 { name: "RecipeIsArchived", type: "number" }
            ],
            id: "RecipeID",
            async: false
        };
        window.recipeDA = {};

        // формирование данных для дерева блюд в модальном окне при замене блюда
        window.moduleRecipeSource =
        {
            datatype: "json",
            datafields: [
                { name: "id" },
                { name: "parentid" },
                { name: "text" }
            ],
            id: "id",
            url: "../../fooRecipe/GetRecipeSource",
            async: false,
            beforeprocessing: function (data) {

                // заполнение массива с рецептами для выпадающего поиска по рецептам, чтобы не загружать 2 раза
                data.forEach(item => {
                    if(item.id > 0) dropdownRecipeData.push(item);
                });
            }
        };

        window.moduleRecipeAdapter = new $.jqx.dataAdapter(moduleRecipeSource);
        moduleRecipeAdapter.dataBind();
        window.recipeRecords = moduleRecipeAdapter.getRecordsHierarchy("id", "parentid", "items", [{ name: "text", map: "label" }]);
        $("#recipeTree").jqxTree({ source: recipeRecords, width: "100%", height: "100%"});

        // source для выпадающего списка рецептов
        window.recipeSource = {
            datatype: "json",
            datafields: [
                 { name: "id", type: "number" },
                 { name: "text", type: "string" }
            ],
            localdata: dropdownRecipeData
        };

        // создаем гриды для таблиц с энергетическим составом для рецептов
        //substances.forEach(substance => makeSubstancesGrids(substance, 700, 350, 345));

        window.offset = $('#modals').offset();

        // МОДАЛЬНОЕ ОКНО ЗАМЕНЫ РЕЦЕПТА
        //создадим окно для выбора в плане-меню другого блюда здесь
        $('#windowChangeRecipe').jqxWindow(
            {
                position: "center",
                isModal: true,
                showCloseButton: false,
                maxHeight: 600, maxWidth: 1000, minHeight: 200, minWidth: 200, height: 600, width: 1000,
                okButton: $('#changeRecipeOk'), cancelButton: $('#changeRecipeCancel'),
                autoOpen: false,
                initContent: function () {
                    $('#changeRecipeOk').jqxButton({ width: '65px' });
                    $('#changeRecipeCancel').jqxButton({ width: '65px' });
                }
            });

        // создадим грид модального окна замены рецепта
        window.recipeChangeSource =
                    {
                        datatype: "json",
                        datafields: [
                            { name: "FoodRecipeID", type: "number" },
                            { name: "FoodID", type: "number" },
                            { name: "RecipeID", type: "number" },
                            { name: "Name", type: "string" },
                            { name: "Brutto", type: "number" },
                            { name: "Netto", type: "number" },
                            { name: "RecordStatusID", type: "number" },
                            { name: "RecordDate", type: "date" },
                            { name: "UserID", type: "number" },
                            { name: "isHeat", type: "number" },
                            { name: "isBoilLoss", type: "number" },
                            { name: "PercentValue", type: "number" }
                        ],
                        id: 'FoodRecipeID',
                        url: "",
                        async: false,
                    };

        $("#changeRecipeGrid").jqxGrid(
        {
            width: 580,
            columnsresize: true,
            columnsheight: 40,
            columns: [
                {
                    text: "Продукт", datafield: "FoodID", displayfield: "Name", width: 300
                },
                {
                    text: "Брутто", datafield: "Brutto", width: 80, cellsalign: 'right',
                    cellclassname: formatRecordStatus,
                    cellsrenderer: formatcell,
                },
                {
                    text: "Нетто", datafield: "Netto", width: 80, cellsalign: 'right',
                    cellclassname: formatRecordStatus,
                    cellsrenderer: formatcell,
                },
                {
                    text: 'Тепловая обработка', datafield: 'isHeat', columntype: 'checkbox', width: 55,
                    renderer: function () {
                       return '<div style="margin-top: 5px; margin-left: 5px;">Тепл.<br />обраб.</div>';
                    },
                },
                {
                    text: 'Уварка', datafield: 'isBoilLoss', columntype: 'checkbox', width: 65,
                    renderer: function () {
                        return '<div style="margin-top: 5px; margin-left: 5px;">Уварка</div>';
                    },
                },
                 {
                     text: "% отхода", datafield: "PercentValue", width: 80, cellsalign: 'right',
                     cellclassname: formatRecordStatus,
                     cellsrenderer: formatcell,
                 }
            ]
        });

        $("#netto").jqxInput({ width: '30px', disabled: true });
        $("#weight1").jqxInput({ width: '30px', disabled: true });
        $("#weight2").jqxInput({ width: '30px', disabled: true });
        $("#cardNumber").jqxInput({ width: '30px', disabled: true });
        $("#recipeNumber").jqxInput({ width: '30px', disabled: true });

        // при выборе в модальном окне рецепта из выпадающего списка комбобокса, он раскрывается в дереве ниже и выбирается
        $("#recipeSearch").on('select', function (event) {
            if (event.args) {
                $("#recipeTree").jqxTree('expandItem', $("#recipeTree").find('li#' + event.args.item.originalItem.id)[0]);
                $("#recipeTree").jqxTree('ensureVisible', $("#recipeTree").find('li#' + event.args.item.originalItem.id)[0]);
                $("#recipeTree").jqxTree('selectItem', $("#recipeTree").find('li#' + event.args.item.originalItem.id)[0]);
            }
        });

        // МОДАЛЬНОЕ ОКНО ВЫБОРА РЕЦЕПТА
        window.createModalToChangeRecipe = function (datarow) {
            // открытие ранее созданного модального окна
            $('#windowChangeRecipe').jqxWindow('open');
            // заполним ранее созданные переменные для использования при других событиях
            timeRecipeCategoryRow = datarow;
            mainGridRecipeID = timeRecipeCategoryRow.RecipeID;
            timeRecipeRowID = timeRecipeCategoryRow.MenuCategoryTimeRecipeID;
            // создание  дерева элементов, сплиттера, вкладок
            $("#modalSplitter").jqxSplitter({ width: '100%', height: '95%', panels: [{ size: 420 }, { size: 530 }] });

            if (datarow.RecipeID != 0) {
                // код для открытия дерева элементов в модальном окне замены рецепта на рецепте из грида в плане-меню
                $("#recipeTree").jqxTree('expandItem', $("#recipeTree").find('li#' + mainGridRecipeID)[0]);
                $("#recipeTree").jqxTree('ensureVisible', $("#recipeTree").find('li#' + mainGridRecipeID)[0]);
                $("#recipeTree").jqxTree('selectItem', $("#recipeTree").find('li#' + mainGridRecipeID)[0]);

            } else {
                modalGridRecipeID = 0;
            }
            //создаем комбобокс для поиска рецепта в дереве
            $("#recipeSearch").jqxComboBox({ source: new $.jqx.dataAdapter(recipeSource, { autoBind: true }), displayMember: "text", valueMember: "id", width: 400, height: 25 });
        }

        $('#recipeTree').on('select', function (event) {

            modalGridRecipeID = event.args.element.id;
            if (timeRecipeCategoryRow.isAdding)
                timeRecipeCategoryRow.RecipeID = modalGridRecipeID;

            // структура для показа содержания рецепта только при клике на элементы дерева самого низкого уровня
            // и его скрытия в противном случае
            if (event.args.element.id < 0) {

                $("#changeRecipeGrid").css("visibility", "hidden");

            } else {

                $("#changeRecipeGrid").css("visibility", "visible");

                // если выбран элемент нижнего уровня, то формируем данные для грида продуктового состава
                recipeChangeSource.url = "../../fooRecipe/getModalRecipeContents?id=" + modalGridRecipeID;
                $("#changeRecipeGrid").jqxGrid({ source: new $.jqx.dataAdapter(recipeChangeSource) });

                $.ajax({
                    cache: false,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: "../../fooRecipe/GetRecipe?id=" + (modalGridRecipeID),
                    type: "POST",
                    success: function (data, status, xhr) {
                        modalNetto = data[0].Recipe.Netto;
                        $("#netto").val(data[0].Recipe.Netto);
                        $("#weight1").val(data[0].Recipe.Weight);
                        $("#weight2").val(data[0].Recipe.Weight2);
                        $("#cardNumber").val(data[0].Recipe.TechCardNumber);
                        $("#recipeNumber").val(data[0].Recipe.RecipeNumber);
                    },
                    error: function (response) {
                    openAlertWindow(response.responseText);
                    }
                    });
            }
        });

        function updateChangeRecipeCell(rowdata) {
            rowdata.UserID = userid;
            //rowdata.MenuCategoryID = event.args.element.id;
            if (!isplanmenu) rowdata.PortionCount = 1;
            // проверка на условия сохранения статуса вновь созданной строки
            if (rowdata.RecipeID != 0 && rowdata.EatingTimeID != 0 /*&& rowdata.PortionCount != 0*/ && rowdata.RecordStatusID == 3) rowdata.RecordStatusID = 1;
            if (rowdata.ParentMenuCategoryTimeRecipeID && rowdata.RecipeID != 0 && rowdata.RecordStatusID == 3) rowdata.RecordStatusID = 1;
            $.ajax({
                cache: false,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: "../../fooMenu/UpdateMenuCategoryTimeRecipe/",
                data: (JSON.stringify(rowdata)),
                type: "POST",
                success: function (response) {
                    $("#menuCategoryTimeRecipeGrid").jqxGrid("updatebounddata", "data");
                },
                error: function (response) {
                    console.log("error");
                }
            });
        }

        $('#windowChangeRecipe').on('close', function (event) {
            if (modalGridRecipeID > 0 && event.args.dialogResult.OK == true && mainGridRecipeID != modalGridRecipeID) {
                // заносим новое значение в ячейку menuCategoryTimeRecipe, после чего автоматически проходит апдейт
                timeRecipeCategoryRow.RecipeID = modalGridRecipeID;
                timeRecipeCategoryRow.Netto = modalNetto
                updateChangeRecipeCell(timeRecipeCategoryRow);
            }

            $("#changeRecipeGrid").jqxGrid("clear");
            $('#recipeTree').jqxTree("collapseAll");
        });

        // МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ РЕЦЕПТА
        //создадим окно для редактирования блюда в плане-меню здесь
        $('#windowEditRecipe').jqxWindow(
            {
                position: { x: offset.left + 75, y: offset.top },
                isModal: true,
                showCloseButton: false,
                maxHeight: 1000, maxWidth: 1000, minHeight: 200, minWidth: 200, height: 620, width: 780,
                okButton: $('#editRecipeOk'), cancelButton: $('#editRecipeCancel'),
                autoOpen: false,
                initContent: function () {
                    $('#editRecipeOk').jqxButton({ width: '65px' });
                    $('#editRecipeCancel').jqxButton({ width: '65px' });

                    $("#addrowbuttonrecipe").jqxButton();
                }
            });
        $('#windowEditRecipe').jqxWindow('close');
    //#endregion q
        // создадим грид для модального окна редактирования рецепта
        window.recipeEditSource =
        {
            datatype: "json",
            datafields: [
                { name: "FoodRecipeID", type: "number" },
                { name: "FoodID", type: "number" },
                { name: "RecipeID", type: "number" },
                { name: "Name", type: "string" },
                { name: "Brutto", type: "number" },
                { name: "Netto", type: "number" },
                { name: "RecordStatusID", type: "number" },
                { name: "RecordDate", type: "date" },
                { name: "UserID", type: "number" },
                { name: "isHeat", type: "number" },
                { name: "isBoilLoss", type: "number" },
                { name: "PercentValue", type: "number" }
            ],
            id: 'FoodRecipeID',
            url: "",
            root: 'recipeContent',
            async: false,
            beforeprocessing: function (data) {
                recipeContents = data.recipeText[0];
            },
            addrow: function (rowid, rowdata, position, commit) {
      
                $.ajax({
                    cache: false,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: "../../fooRecipe/AddProduct/",
                    data: JSON.stringify(rowdata),
                    type: "POST",
                    success: function (data, status, xhr) {
                        commit(true);
                        $("#editRecipeGrid").jqxGrid("updatebounddata", "data");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }
                });
            },
            deleterow: function (rowid, commit) {
            },
            updaterow: function (rowid, rowdata, commit) {

                // проверка на условия сохранения статуса вновь созданной строки
                if (rowdata.FoodID != 0 && rowdata.Netto != 0 && rowdata.Brutto != 0 && rowdata.RecordStatusID == 3) rowdata.RecordStatusID = 1;

                rowdata.RecipeID = mainGridRecipeID;
                rowdata.UserID = userid;

                $.ajax({
                    cache: false,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: "../../fooRecipe/UpdateProduct/",
                    data: (JSON.stringify(rowdata)),
                    type: "POST",
                    success: function (response) {
                        commit(true);
                        $("#editRecipeGrid").jqxGrid("updatebounddata", "data");
                    },
                    error: function (response) {
                    }
                });
            }
        };

        $("#editRecipeGrid").jqxGrid(
        {
            width: 590,
            columnsresize: true,
            columnsheight: 40,
            editable: true,
            localization: getLocalization(),
            editmode: "selectedcell",
            selectionmode: "singlerow",
            columns: [
                {
                    text: "", datafield: "RecordStatusID", editable: false, width: 10, sortable: false, //селектор строки
                    cellsrenderer: function () {return "<div style='height: 100%; background-color: #EEEEEE'><span></span></div>";}
                },
                {
                    text: "Продукт", datafield: "FoodID", displayfield: "Name", columntype: "combobox", width: 280,
                    cellclassname: formatRecordStatus,
                    createeditor: function (row, value, editor) {
                        editor.jqxComboBox({ source: foodAdapter, valueMember: "FoodID", displayMember: "Name", width: 290, dropDownWidth: 280 });
                    }
                },
                {
                    text: "Брутто", datafield: "Brutto", width: 80, cellsformat: "d3", cellsalign: 'right',
                    cellclassname: formatRecordStatus
                },
                {
                    text: "Нетто", datafield: "Netto", width: 80, cellsformat: "d3", cellsalign: 'right',
                    cellclassname: formatRecordStatus
                },
                {
                    text: 'Тепловая обработка', datafield: 'isHeat', columntype: 'checkbox', width: 55,
                    renderer: function () {
                        return '<div style="margin-top: 5px; margin-left: 5px;">Тепл.<br />обраб.</div>';
                    },
                },
                 {
                     text: 'Уварка', datafield: 'isBoilLoss', columntype: 'checkbox', width: 65,
                     renderer: function () {
                         return '<div style="margin-top: 5px; margin-left: 5px;">Уварка</div>';
                     },
                 },
                 {
                     text: "% отхода", datafield: "PercentValue", width: 80, cellsformat: "d3", cellsalign: 'right',
                     cellclassname: formatRecordStatus
                 },
                {
                    text: "", datafield: "Delete", sortable: false, width: 20,
                    createwidget: function (row, column, value, htmlElement) {
                        createDeleteButton("#editRecipeGrid", htmlElement, row);
                    },
                    initwidget: function (row, column, value, htmlElement) {
                    }
                }
            ]
        });

        // открытие модального окна для редактирования
        window.createNewRecipe =  function (row) {

            // заполняем данными глобальными переменные
            timeRecipeCategoryRow = row.bounddata;
            mainGridRecipeID = timeRecipeCategoryRow.RecipeID;
            timeRecipeRowID = timeRecipeCategoryRow.MenuCategoryTimeRecipeID;

            // переменные для определения того, имеется ли данного ObjectID своя копия выбранного рецепта или нет
            window.recipeObjectID = timeRecipeCategoryRow.ObjectID;
            window.generalObjectID = objectid;

            if (!foodSource.url) {
                foodSource.url = "../../Food/GetFoods";
                foodAdapter = new $.jqx.dataAdapter(foodSource, { autoBind: true });
            }

            // проверка на соответствие ObjectID
            if (recipeObjectID != generalObjectID) {

                // отправляем запрос на контроллер для формирования строки в таблице fooRecipe с текущим ObjectID
                $.ajax({
                    cache: false,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: "../../fooRecipe/сreateRecipeToEdit",
                    data: JSON.stringify(
                        {
                            recipeid: mainGridRecipeID,
                            objectid: generalObjectID,
                            userid: userid,
                            timerecipeid: timeRecipeRowID
                        }),
                    type: "POST",
                    success: function (data, status, xhr) {
                        // заносим новое значение в ячейку menuCategoryTimeRecipe, после чего автоматически проходит апдейт
                        $("#menuCategoryTimeRecipeGrid").jqxGrid('setcellvalue', timeRecipeCategoryRow.visibleindex, "UserID", userid);
                        $("#menuCategoryTimeRecipeGrid").jqxGrid("updatebounddata", "data");
                        mainGridRecipeID = $('#menuCategoryTimeRecipeGrid').jqxGrid('getrowdata', timeRecipeCategoryRow.visibleindex).RecipeID;

                        createEditRecipeGrid();
                    },
                    error: function (response) {
                        alert(response.responseText);
                    }
                });
            } else {
                createEditRecipeGrid();
            }
        };

        // сохранение данных введенных пользователем в модальном окне редактирования рецепта, при условии нажатии им ОК
        $('#windowEditRecipe').on('close', function (event) {

            if(event.args.dialogResult.OK == true) {

                recipeContents.Name = $("#recipeName").val();
                recipeContents.Netto = $("#recipeNetto").val();
                recipeContents.TechnologyText = $("#TechnologyText").val();
                recipeContents.DesignText = $("#DesignText").val();
                recipeContents.IndicatorText = $("#IndicatorText").val();
                recipeContents.RecipeID = mainGridRecipeID;
                recipeContents.UserID = userid;

                $.ajax({
                    cache: false,
                    dataType: "json",
                    url: "../../fooRecipe/UpdateRecipe",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(recipeContents),
                    type: "POST",
                    success: function (data, status, xhr) {
                        $("#menuCategoryTimeRecipeGrid").jqxGrid("updatebounddata", "data");
                    },
                    error: function (response) {
                        alert(response.responseText);
                    }
                });
            }
        });

        // добавление продуктов в рецепт
        $("#addrowbuttonrecipe").click(function () {
            $("#editRecipeGrid").jqxGrid("addrow", null, generateRecipeRow(mainGridRecipeID));
        });

        //заполнение гридов элементного состава рецепта только при клике на название соответствующей вкладки
        $('#editRecipeTabs').on('tabclick', function (event) {
            if (event.args.item == 3) {
                $('#editRecipeTabsChemical').jqxTabs('select', 0);
                substancesVar["Energy"].source.url = "../../fooRecipe/getEnergyRecipe?id=" + mainGridRecipeID;
                $("#EnergyGrid").jqxGrid({ source: new $.jqx.dataAdapter(substancesVar["Energy"].source) });
            }
        });

        $('#editRecipeTabsChemical').on('tabclick', function (event) {
            if(event.args.item == 1) {
                substancesVar["Vitamin"].source.url =  "../../fooRecipe/getVitaminRecipe?id=" + mainGridRecipeID;
                $("#VitaminGrid").jqxGrid({ source: new $.jqx.dataAdapter(substancesVar["Vitamin"].source) });
            } else if(event.args.item == 2) {
                substancesVar["Mineral"].source.url =  "../../fooRecipe/getMineralRecipe?id=" + mainGridRecipeID;
                $("#MineralGrid").jqxGrid({ source: new $.jqx.dataAdapter(substancesVar["Mineral"].source) });
            }
        });

        // открытие модального окна для редактирования рецепта
        window.createEditRecipeGrid = function() {

            $('#windowEditRecipe').jqxWindow('open');

            // создание вкладок в модальном окне редактирования рецепта
            $("#editRecipeTabs").jqxTabs({height: '485px',width: '100%' });
            $("#editRecipeTabsChemical").jqxTabs({height: '450px',width: '100%' });
            $('#editRecipeTabs').jqxTabs('select', 0);

            recipeEditSource.url =  "../../fooRecipe/getRecipeContents?id=" + mainGridRecipeID;
            $("#editRecipeGrid").jqxGrid({ source: new $.jqx.dataAdapter(recipeEditSource) });

            // заполнение инпутов деталями рецепта
            $("#recipeName").jqxInput({ value: recipeContents.Name});
            $("#recipeNetto").jqxInput({ value: toFixed(recipeContents.Netto, 3) });
            $("#TechnologyText").jqxInput({ value: recipeContents.TechnologyText });
            $("#DesignText").jqxInput({ value: recipeContents.DesignText });
            $("#IndicatorText").jqxInput({ value: recipeContents.IndicatorText });
        }

        // НАЧАЛЬНОЕ ДЕРЕВО ПЛАНА-МЕНЮ
        // Формирование начального дерева плана-меню
        window.menuSource =
        {
            datatype: "json",
            datafields: [
                { name: "id" },
                { name: "parentid" },
                { name: "text" },
                { name: "value" },
                { name: "hasFact" },
                { name: "menuNumber"}
            ],
            id: "id",
            url: "",
            async: false,
            beforeprocessing: function (data) {

                var mainItems = data.filter(item => item.id < 0);
                var subItems = data.filter(item => item.id > 0);

                if (isplanmenu) {
                    mainItems.forEach(item => item.text = formatDate(new Date(+item.text.slice(6, 19))));
                    subItems.forEach(item => item.text = eatingCategories.filter(category => item.catText == category.EatingCategoryID)[0].Name);
                    if (data.length == 0) {
                        $("#modals").css("visibility", "hidden");
                        $(".jqx-tree-dropdown-root").css("visibility", "hidden");
                    } else {
                        $("#modals").css("visibility", "visible");
                        $(".jqx-tree-dropdown-root").css("visibility", "visible");
                    }
                }
             
                mainItems.sort(compareNumeric);            
                subItems.sort(compareWords);

                data = mainItems.concat(subItems);        
            }
        };

        menuSource.url = "../../fooMenu/GetCycleMenuSource";

        // добавляем свойсва в объект источника для элементов меню, если это план-меню
        if (isplanmenu) {

            // заполнение фильтрующих по датам полей в левой части сплиттера
            window.dateFrom = new Date();
            window.month = dateFrom.getMonth() - 1;
            window.year = dateFrom.getFullYear();
            window.day = dateFrom.getDate();
            dateFrom = new Date(year, month, day);
            window.dateTo = new Date();
            dateTo.setDate(dateTo.getDate() + 14);

            $("#DateFrom").jqxDateTimeInput({
                width: "145px",
                formatString: "dd.MM.yyyy",
                culture: "ru-RU", value: dateFrom
            });
            $("#DateTo").jqxDateTimeInput({
                width: "145px",
                formatString: "dd.MM.yyyy",
                culture: "ru-RU", value: dateTo
            });

            menuSource.data = {
                dateFrom: $('#DateFrom').val().replace(/[.]/g, "-").split("-").reverse().join("-"),
                dateTo: $('#DateTo').val().replace(/[.]/g, "-").split("-").reverse().join("-")
            };

            menuSource.url = "../../fooMenu/GetMenuSource";
        }

        // create data adapter for jqxTree
        window.menuTreeAdapter = new $.jqx.dataAdapter(menuSource);
        // perform Data Binding.
        menuTreeAdapter.dataBind();
        
    window.records = menuTreeAdapter.getRecordsHierarchy("id", "parentid", "items", [
        { name: "text", map: "label" },
        //{ name: "hasFact", map: "hasFact" }
    ]);
    console.log(records);
        $("#menuTree").jqxTree({ source: records, width: "145px", height: "100%"});     
        if (isplanmenu) {
            var items = $('#menuTree').jqxTree('getItems');

            items.forEach(item => {
                
                if (item.hasItems) {
                    var record = records.find(function (r) {
                        return Number.parseInt(item.id) === Number.parseInt(r.id);
                    });
                    if (record) {
                        if (!record.hasFact) {
                            $('#' + item.id + "> .jqx-tree-item").addClass('treeItemHasNoFact');

                            record.items.forEach(function (child) {
                                if (!child.hasFact) {
                                    $('#' + child.id + " .jqx-tree-item").addClass('treeItemHasNoFact');
                                }
                            });
                        }
                    }
                }
                
                
                if (item.value == 1) {
                    $('#' + item.id + " .jqx-tree-item").addClass('treeItemStatus')
                }
            });
        }

        window.refreshTree = function() {
            menuTreeAdapter = new $.jqx.dataAdapter(menuSource);
            menuTreeAdapter.dataBind();
            records = menuTreeAdapter.getRecordsHierarchy("id", "parentid", "items", [
                { name: "text", map: "label" },
                //{ name: "hasFact", map: "hasFact" }
            ]);

            $("#menuTree").jqxTree({ source: records });

            var items = $('#menuTree').jqxTree('getItems');

            items.forEach(item => {
                var record = records.find(function (r) {
                    return ""+item.id === ""+r.id;
                });

                if (record) {
                    
                    if (!record.hasFact) {
                        $('#' + item.id + " .jqx-tree-item").addClass('treeItemHasNoFact');
                    }
                }
                if (item.value == 1) $('#' + item.id + " .jqx-tree-item").addClass('treeItemStatus')
            });
        }

        $("#splitter").jqxSplitter({ width: 1130, height:"100%", panels: [{ size: 165 }, { size: 965 }] });

        // закрытие модальных окон при клике на остальном документе
        $('#windowEditRecipe, #windowChangeRecipe, #windowAddMenu').click(function (event) {
            event.stopPropagation();
        });

        $(".jqx-window-modal").click(function (event) {
            $("#windowEditRecipe, #windowChangeRecipe, #windowAddMenu").jqxWindow('close');
        });

        // ГРИД MENUCATEGORYTIMERECIPE
        // формируем грид для выбранного пункта категорий меню
        window.menuCategoryTimeRecipeSource =
        {
            datatype: "json",
            datafields: [
                { name: "MenuCategoryTimeRecipeID", type: "number" },
                { name: "MenuCategoryID", type: "number" },
                { name: "ParentMenuCategoryTimeRecipeID", type: "number" },
                { name: "EatingTimeName", type: "string" },
                { name: "EatingTimeID", type: "number" },
                { name: "RecipeName", type: "string" },
                { name: "RecipeID", type: "number" },
                { name: "RecipeIsArchived", type: "number"},
                { name: "ObjectID", type: "number" },
                { name: "OrderNumber", type: "number" },
                { name: "UserID", type: "number" },
                { name: "Netto", type: "number" },
                { name: "PortionCount", type: "number" },
                //{ name: "ControlPortionCount", type: "number" },
                { name: "RecordStatusID", type: "number" },
                { name: "FakeRow", type: "number" },
                { name: "PortionCountFact", type: "number" },
                { name: "MenuCorrectionTypeID", type: "number" },
                { name: "MenuCorrectionTypeName", type: "string" },
                { name: "PersonPortionCount", type: "number" },
                { name: "PortionCount24", type: "number" },
                { name: "PortionCountFact24", type: "number" },
                { name: "Delete", type: "number" },
                { name: "ToDelete", type: "bool" }
            ],
            id: 'MenuCategoryTimeRecipeID',
            url: "",
            async: false,
            beforeprocessing: function (data) {

                var menuCorrection;
                data.forEach(item => {
                    menuCorrection = menuCorrectionTypesDA.records.filter(type => type.MenuCorrectionTypeID == item.MenuCorrectionTypeID);
                    item.MenuCorrectionTypeName = menuCorrection.length > 0 ? menuCorrection[0].Name : "не выбрано";
                });
            },
            addrow: function (rowid, rowdata, position, commit) {
                var rowscount = $("#menuCategoryTimeRecipeGrid").jqxGrid("getdatainformation").rowscount;
                if (rowdata.OrderNumber == null) rowdata.OrderNumber = rowscount + 1;
                rowdata.UserID = userid;
                rowdata.Netto = 0.0;
                if (!isplanmenu) rowdata.PortionCount = 1;

                // проверка на условия сохранения статуса вновь созданной строки
                if (rowdata.RecipeID != 0 && rowdata.EatingTimeID != 0 && rowdata.PortionCount != 0 && rowdata.RecordStatusID == 3) rowdata.RecordStatusID = 1;
                if (rowdata.ParentMenuCategoryTimeRecipeID && rowdata.RecipeID != 0 && rowdata.RecordStatusID == 3) rowdata.RecordStatusID = 1;
                $.ajax({
                    cache: false,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: "../../fooMenu/AddCategoryContent/",
                    data: JSON.stringify(rowdata),
                    type: "POST",
                    success: function (data, status, xhr) {
                        $("#menuCategoryTimeRecipeGrid").jqxGrid("updatebounddata", "data");
                        rowdata.MenuCategoryTimeRecipeID = data.MenuCategoryTimeRecipeID;
                        commit(true);
                        $("#menuCategoryTimeRecipeGrid").jqxGrid("updatebounddata", "data");
                        $('#menuCategoryTimeRecipeGrid').jqxGrid('selectrow', $('#menuCategoryTimeRecipeGrid').jqxGrid('getrowboundindexbyid', data.MenuCategoryTimeRecipeID));
                        setTimeout(function () {
                            $("#menuCategoryTimeRecipeGrid").jqxGrid('begincelledit', $('#menuCategoryTimeRecipeGrid').jqxGrid('getrowboundindexbyid', data.MenuCategoryTimeRecipeID), "RecipeID");
                        }, 10);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }
                });

            },
            deleterow: function (rowid, commit) {
                commit(true);
                $("#menuCategoryTimeRecipeGrid").jqxGrid("updatebounddata", "data");
            },
            updaterow: function (rowid, rowdata, commit) {
            }
        };

        window.menuFoodNeedDS =
            {
                datatype: "json",
                datafields: [
                    { name: "FoodID", type: "number" },
                    { name: "FoodName", type: "string" },
                    { name: "AmountNeed", type: "number" },
                    { name: "AmountStore", type: "number" },
                    { name: "IsUndividedPack", type: "number" },
                    { name: "IsNegativeRemain", type: "number" }
                ],
                id: 'FoodID',
                url: "",
                async: false
            };


        var categoryTimeRecipeGridWidth = 685;

        var recipeRow, recipeName;

        var allergicRowEdit = function (row, datafield, columntype, value) {
            var data = $('#menuCategoryTimeRecipeGrid').jqxGrid('getrowdata', row);
            if (data.ParentMenuCategoryTimeRecipeID) return false;
        }

        $("#menuCategoryTimeRecipeGrid").jqxTooltip();

        var recipeNameWidth = 380;
        if (isplanmenu) { recipeNameWidth = 285 };
        var currentMenuCategoryTimeRecipeGridRow = {};
        var gridColumns = [
                {
                    text: "", datafield: "RecordStatusID", editable: false, hidden:true, width: 10, sortable: false, //селектор строки
                    cellsrenderer: formatcell
                },
                {
                    text: "№ п/п", datafield: "OrderNumber", width: 35, cellsalign: "center",
                    renderer: function () {
                        return '<div style="margin-top: 5px; margin-left: 5px;">№<br />п/п</div>';
                    }
                },
                {
                    text: "Время", datafield: "EatingTimeID", displayfield: "EatingTimeName", columntype: "dropdownlist", width: 80,
                    cellclassname: formatRecordStatus,
                    cellsrenderer: formatcell,
                    createeditor: function (row, value, editor) {
                        editor.jqxDropDownList({ source: timesForDropdown, valueMember: "EatingTimeID", displayMember: "Name", autoDropDownHeight: true, placeHolder: "Выберите:" });
                    },
                    cellbeginedit: allergicRowEdit
                },
                {
                    text: "Блюдо", datafield: "RecipeID", displayfield: "RecipeName", width: recipeNameWidth, columntype: "combobox",
                    cellclassname: formatRecordStatus,
                    createeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                        recipeDS.url = "";
                        recipeDS.localdata = recipeDA.records;
                        var selectedValueIndex = recipeDA.records.find((item, index) => {
                            if (item.RecipeID === cellvalue) {
                                return index;
                            }
                        });
                        editor.jqxComboBox({
                            source: new $.jqx.dataAdapter(recipeDS),
                            valueMember: "RecipeID",
                            displayMember: "Name",
                            width: recipeNameWidth,
                            dropDownWidth: recipeNameWidth,
                            selectedIndex: selectedValueIndex
                        });
                    },
                    geteditorvalue: function (row, cellvalue, editor) {
                        var item = $(editor).jqxComboBox('getSelectedItem');
                        console.log(item);
                        if (!item) {
                            var currentItem = recipeDA.records.find((item, index) => item.RecipeID === cellvalue);
                            console.log(currentItem);
                            return {
                                label: currentItem.RecipeName,
                                value: cellvalue
                            }
                        }
                        return {
                            label: item.label,
                            value: item.value
                        };
                    },

                    initeditor: function (row, cellvalue, editor, celltext, pressedChar) {
                       
                    },

                    cellbeginedit: function (row, datafield, columntype) {
                        currentMenuCategoryTimeRecipeGridRow = $('#menuCategoryTimeRecipeGrid').jqxGrid('getrowdata', row);
                    },

                    cellendedit: function (row, datafield, columntype, oldvalue, newvalue) {
                        //console.log("oldvalue", oldvalue);
                        //console.log("newvalue", newvalue);
                        //if (oldvalue.value !== newvalue.value) {
                        //    var rowData = $('#menuCategoryTimeRecipeGrid').jqxGrid('getrowdata', row);
                        //    var recipeFromGrid = recipeDA.records.find(item => item.RecipeID === newvalue.value);

                        //    console.log(recipeFromGrid);
                        //    if (recipeFromGrid) { rowData.Netto = recipeFromGrid.Netto; }
                        //}
                    },
                    cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                        

                        //var data = $('#menuCategoryTimeRecipeGrid').jqxGrid('getrowdata', row);
                        if (rowdata.RecipeIsArchived) {
                            return "<div style='color:#8c8c8c; height:100%'>" + value + "</div>";
                        }
                        return "<div style='height:100%'>" + value + "</div";
                    }
                },
                {
                    text: "Выход", datafield: "Netto", editable: true, cellsformat: "d3", cellsalign: "right", width: 63, columntype: 'numberinput',
                    //cellclassname: formatRecordStatus,
                    createeditor: function (row, cellvalue, editor) {
                        editor.jqxNumberInput({ decimalDigits: 3, digits: 6 });
                    },
                    validation: function (cell, value) {
                        if (value <= 0 || value === null) {
                            return {
                                result: false,
                                message: "Значение выхода должно быть больше 0"
                            };
                        }
                        return true;
                    }
                },
                //{
                //    text: "", datafield: "Delete", sortable: false, width: 20,
                //    createwidget: function (row, column, value, htmlElement) {
                //        createDeleteButton("#menuCategoryTimeRecipeGrid", htmlElement, row);
                //    },

                //    initwidget: function (row, column, value, htmlElement) {
                //    }
                //},
                {
                    text: "Удалить", datafield: "ToDelete", width: 60, columntype: "checkbox"
                }
        ]; 

        if (isplanmenu) {
            categoryTimeRecipeGridWidth = 895;
      
            gridColumns.splice(5, 0,
               
                //{
                //    text: "Контр. порц.", datafield: "ControlPortionCount", width: 50, renderer: function () {
                //        return '<div style="margin-top: 5px; margin-left: 5px;">Контр.<br />порц.</div>';
                //    },
                //},
               
                {
                    text: "Перс.", datafield: "PersonPortionCount", width: 45
                },
                 {
                     text: "Детей план", datafield: "PortionCount", width: 50, renderer: function () {
                         return '<div style="margin-top: 5px; margin-left: 5px;">Детей<br />план</div>';
                     },
                 },
                {
                    text: "Детей факт", datafield: "PortionCountFact", width: 50, renderer: function () {
                        return '<div style="margin-top: 5px; margin-left: 5px;">Детей<br />факт</div>';
                    },
                },

                {
                    text: "Сад 24 план", datafield: "PortionCount24", width: 50, renderer: function () {
                        return '<div style="margin-top: 5px; margin-left: 5px;">Сад 24<br/> план</div>';
                    },
                },

                {
                    text: "Сад 24 факт", datafield: "PortionCountFact24", width: 50, renderer: function () {
                        return '<div style="margin-top: 5px; margin-left: 5px;">Сад 24<br />факт</div>';
                    },
                },
                {
                    text: "Оформление разницы", datafield: "MenuCorrectionTypeID", displayfield: "MenuCorrectionTypeName", width: 150, columntype: "dropdownlist", //cellsformat: "d3",
                    renderer: function () {
                        return '<div style="margin-top: 5px; margin-left: 5px;">Оформление<br />разницы</div>';
                    },
                    cellsalign: "right", 
                    createeditor: function (row, value, editor) {
                        menuCorrectionSource.url = "";
                        menuCorrectionSource.localdata = menuCorrectionTypesDA.records;
                        editor.jqxDropDownList({ source: new $.jqx.dataAdapter(menuCorrectionSource), valueMember: "MenuCorrectionTypeID", displayMember: "Name", dropDownHeight: 120, dropDownWidth: 150, placeHolder: "Выберите:" });
                    }
                }
            );
        }

        window.menuCategoryTimeRecipeAdapter = new $.jqx.dataAdapter(menuCategoryTimeRecipeSource);
        window.menuFoodNeedDA = new $.jqx.dataAdapter(menuFoodNeedDS);

        var datafield,
            index,
            datafieldIndex;
        var count = 0;
        var mappedColumns = makeColumnArray(gridColumns);

        $("#menuCategoryTimeRecipeGrid").on("cellbeginedit", function (event) {
            datafield = args.datafield;
            mappedColumns.forEach((item, ind) => { if (datafield == item.datafield) datafieldIndex = ind });
            index = args.rowindex;
        });

        $("#menuCategoryTimeRecipeGrid").on("cellendedit", function (event) {
            datafield = args.datafield;
            index = args.rowindex;
        });

        // грид для блюд, разбитых по времени питания
        $("#menuCategoryTimeRecipeGrid").jqxGrid(
        {
            width: 935,//categoryTimeRecipeGridWidth,
            columnsheight: 40,
            rowsheight: 23,
            columnsresize: true,
            height: '100%',
            editable: true,
            handlekeyboardnavigation: function (event) {
                count++;
                var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;

                if (count == 1) {
                    if (event.which == 45) {
                        addNewRecipeRow();
                        return true;
                    } else if (key == 37 || key == 39) {
                        checkInputCaret(event, key, mappedColumns, datafieldIndex, index, "#menuCategoryTimeRecipeGrid");
                    }
                }
                if (count == 3) count = 0;
            },
            ready: function () {
                $('#menuCategoryTimeRecipeGrid').jqxGrid('focus');
            },
            localization: getLocalization(),
            editmode: "selectedcell",
            selectionmode: "singlerow",       
            columns: gridColumns
        });

        $("#menuFoodNeedGrid").jqxGrid(
           {
               width: 935,//categoryTimeRecipeGridWidth,
               columnsheight: 25,
               rowsheight: 23,
               //columnsresize: true,
               height: '100%',
               //autoheight: true,
               //editable: true,
              
               localization: getLocalization(),
               //editmode: "selectedcell",
               //selectionmode: "singlerow",
               columns: [
                    {
                        text: "Продукт", datafield: "FoodName", editable: false, width: 290, sortable: false,
                        cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                            if (rowdata.IsUndividedPack!=1) {
                                return "<div style='height: 100%; color: black'><span>" + value + "</span></div>";
                            } else {
                                return "<div style='height: 100%; color: blue'><span>" + value + "</span></div>";
                            }
                        },
                    },
                    {
                        text: "Требуемое количество, кг", datafield: "AmountNeed", width: 190, cellsformat: "d3", cellsalign: "right",
                        cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                            if (rowdata.IsNegativeRemain < 0) {
                                return "<div style='color: red; text-align:right; height: 100%'>" + value + "</div>";
                                
                            }
                        }

                    },
                     {
                         text: "Есть в наличии, кг", datafield: "AmountStore", width: 190, cellsformat: "d3", cellsalign: "right"
                     }
                ]
           
           });

        $("#menuCategoryTimeRecipeGrid").on("cellvaluechanged", function (event) {
            //if (event.args.datafield == "RecipeID" && event.args.newvalue.value == event.args.oldvalue)//событие происходит видимо при инициализации дропдауна
            //    return;
            
            console.log(event);
            var rowdata = $('#menuCategoryTimeRecipeGrid').jqxGrid('getrowdata', event.args.rowindex);
            if (rowdata.ToDelete || rowdata.RecordStatusID === 2) {
                return;
            }
            var isEditable = $("#menuCategoryTimeRecipeGrid").jqxGrid("editable");
            if (!isEditable) {
                rowdata.RecordStatusID = 1;
                return;
            }
            if (event.args.datafield == "EatingTimeID" || event.args.datafield == "MenuCorrectionTypeID") {
                if (event.args.newvalue.value == event.args.oldvalue) return false;
                if (!event.args.newvalue) return false;
            } else if (event.args.datafield == "RecipeID") {
                //if (event.args.newValue === 0) {
                //    //rowdata.RecipeID = event.args.oldValue;
                //    rowData
                //}
                //console.log(rowdata);
                //console.log(event.args);
                //var recipeFromGrid = recipeDA.records.find(item => item.RecipeID == rowdata.RecipeID);
                //console.log(recipeFromGrid);
                //if (recipeFromGrid) { rowdata.Netto = recipeFromGrid.Netto; }
                
                //if (event.args.newvalue.label == recipeName) return false;
            }
            
            rowdata.UserID = userid;
            //rowdata.MenuCategoryID = event.args.element.id;
            if (!isplanmenu) rowdata.PortionCount = 1;

            // проверка на условия сохранения статуса вновь созданной строки
            if (rowdata.RecipeID != 0 && rowdata.EatingTimeID != 0  && rowdata.RecordStatusID == 3) rowdata.RecordStatusID = 1;
            if (rowdata.ParentMenuCategoryTimeRecipeID && rowdata.RecipeID != 0 && rowdata.RecordStatusID == 3) rowdata.RecordStatusID = 1;
            $.ajax({
                cache: false,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: "../../fooMenu/UpdateMenuCategoryTimeRecipe/",
                data: (JSON.stringify(rowdata)),
                type: "POST",
                success: function (response) {
                    //console.log(index);
                    $("#menuFoodNeedGrid").jqxGrid("updatebounddata");
                    if (event.args.datafield === "RecordStatusID") {
                        $("#menuCategoryTimeRecipeGrid").jqxGrid("updatebounddata");
                    }

                    //if (typeof index != "undefined" && event.args.datafield == "RecipeID") $("#row" + index + "menuCategoryTimeRecipeGrid").find("div:nth-child(3) span").innerText = rowdata.Netto;
                },
                error: function (response) {
                    console.log("error");
                }
            });
        });

        function addNewRecipeRow() {
            var index = $("#menuCategoryTimeRecipeGrid").jqxGrid('getselectedrowindex');
            var datarow = index === -1
                ? generateMenuCategoryTimeRecipe(e.args.element.id, 0, index )
                : generateMenuCategoryTimeRecipe(
                    e.args.element.id, 
                    $('#menuCategoryTimeRecipeGrid').jqxGrid('getrowdata', index).EatingTimeID,
                    $('#menuCategoryTimeRecipeGrid').jqxGrid('getrowdata', index).OrderNumber
                );
            $("#menuCategoryTimeRecipeGrid").jqxGrid("addrow", null, datarow);
        }

        // добавление новой строки в плане-меню
        $("#addrowbutton").jqxButton();
        $("#addrowbutton").bind("click", function () {
            addNewRecipeRow();
    });

        $("#addChildDish").jqxButton();
        $("#addChildDish").bind("click", function () {
            var selectedrowindex = $('#menuCategoryTimeRecipeGrid').jqxGrid('selectedrowindex'); 
            if (selectedrowindex > -1) {

                var currentRow = $('#menuCategoryTimeRecipeGrid').jqxGrid('getrowdata', selectedrowindex);
                var childRow = generateMenuCategoryTimeRecipe(currentRow.MenuCategoryID, currentRow.EatingTimeID, currentRow.OrderNumber + 1);
                childRow.ParentMenuCategoryTimeRecipeID = currentRow.MenuCategoryTimeRecipeID;
                $("#menuCategoryTimeRecipeGrid").jqxGrid("addrow", null, childRow);
            }
        });
        $("#recountRowsButton").jqxButton();
        $("#recountRowsButton").bind("click", function () {
            var rows = $("#menuCategoryTimeRecipeGrid").jqxGrid("getrows");
            rows.forEach(function (item, index) {
                if (item.OrderNumber !== index + 1) {
                    item.OrderNumber = index + 1;
                    $('#menuCategoryTimeRecipeGrid').jqxGrid('updaterow', index, item);
                    $("#menuCategoryTimeRecipeGrid").jqxGrid('setcellvalue', index, 'OrderNumber', item.OrderNumber);
                    $.ajax({
                        cache: false,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        url: "../../fooMenu/UpdateMenuCategoryTimeRecipe/",
                        data: (JSON.stringify(item)),
                        type: "POST",
                        success: function (response) {

                        },
                        error: function (response) {
                            console.log("error");
                        }
                    });
                }
            });
            //$('#menuCategoryTimeRecipeGrid').jqxGrid('endupdate');
            //console.log(rows);
        });
        $("#addSaltButton").jqxButton();
        $("#addSaltButton").bind("click", function () {
            console.log("click");
        });
};

