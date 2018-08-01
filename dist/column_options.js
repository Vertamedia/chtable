///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['lodash', 'app/core/utils/kbn'], function(exports_1) {
    var lodash_1, kbn_1;
    var ColumnOptionsCtrl;
    /** @ngInject */
    function columnOptionsTab($q, uiSegmentSrv) {
        'use strict';
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'public/plugins/vertamedia-chtable/column_options.html',
            controller: ColumnOptionsCtrl,
        };
    }
    exports_1("columnOptionsTab", columnOptionsTab);
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            }],
        execute: function() {
            ColumnOptionsCtrl = (function () {
                /** @ngInject */
                function ColumnOptionsCtrl($scope) {
                    var _this = this;
                    $scope.editor = this;
                    this.activeStyleIndex = 0;
                    this.panelCtrl = $scope.ctrl;
                    this.panel = this.panelCtrl.panel;
                    this.unitFormats = kbn_1.default.getUnitFormats();
                    this.colorModes = [
                        { text: 'Disabled', value: null },
                        { text: 'Cell', value: 'cell' },
                        { text: 'Value', value: 'value' },
                        { text: 'Row', value: 'row' },
                    ];
                    this.columnTypes = [
                        { text: 'Number', value: 'number' },
                        { text: 'String', value: 'string' },
                        { text: 'Date', value: 'date' },
                        // {text: 'JSON Obj', value: 'json-obj'},
                        // {text: 'JSON Plain', value: 'json-plain'},
                        { text: 'Hidden', value: 'hidden' }
                    ];
                    this.fontSizes = ['80%', '90%', '100%', '110%', '120%', '130%', '150%', '160%', '180%', '200%', '220%', '250%'];
                    this.dateFormats = [
                        { text: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
                        { text: 'YYYY-MM-DD HH:mm:ss.SSS', value: 'YYYY-MM-DD HH:mm:ss.SSS' },
                        { text: 'MM/DD/YY h:mm:ss a', value: 'MM/DD/YY h:mm:ss a' },
                        { text: 'MMMM D, YYYY LT', value: 'MMMM D, YYYY LT' },
                    ];
                    this.getColumnNames = function () {
                        if (!_this.panelCtrl.table) {
                            return [];
                        }
                        return lodash_1.default.map(_this.panelCtrl.table.columns, function (col) {
                            return col.text;
                        });
                    };
                    this.onColorChange = this.onColorChange.bind(this);
                }
                ColumnOptionsCtrl.prototype.render = function () {
                    debugger;
                    this.panelCtrl.render();
                };
                ColumnOptionsCtrl.prototype.setUnitFormat = function (column, subItem) {
                    column.unit = subItem.value;
                    this.panelCtrl.render();
                };
                ColumnOptionsCtrl.prototype.addColumnStyle = function () {
                    var newStyleRule = {
                        unit: 'short',
                        type: 'number',
                        alias: '',
                        decimals: 2,
                        colors: ["rgba(245, 54, 54, 0.9)", "rgba(237, 129, 40, 0.89)", "rgba(50, 172, 45, 0.97)"],
                        colorMode: null,
                        pattern: '',
                        dateFormat: 'YYYY-MM-DD HH:mm:ss',
                        thresholds: [],
                    };
                    var styles = this.panel.styles;
                    var stylesCount = styles.length;
                    var indexToInsert = stylesCount;
                    // check if last is a catch all rule, then add it before that one
                    if (stylesCount > 0) {
                        var last = styles[stylesCount - 1];
                        if (last.pattern === '/.*/') {
                            indexToInsert = stylesCount - 1;
                        }
                    }
                    styles.splice(indexToInsert, 0, newStyleRule);
                    this.activeStyleIndex = indexToInsert;
                };
                ColumnOptionsCtrl.prototype.removeColumnStyle = function (style) {
                    this.panel.styles = lodash_1.default.without(this.panel.styles, style);
                };
                ColumnOptionsCtrl.prototype.invertColorOrder = function (index) {
                    var ref = this.panel.styles[index].colors;
                    var copy = ref[0];
                    ref[0] = ref[2];
                    ref[2] = copy;
                    this.panelCtrl.render();
                };
                ColumnOptionsCtrl.prototype.onColorChange = function (styleIndex, colorIndex) {
                    var _this = this;
                    return function (newColor) {
                        _this.panel.styles[styleIndex].colors[colorIndex] = newColor;
                        _this.render();
                    };
                };
                return ColumnOptionsCtrl;
            })();
            exports_1("ColumnOptionsCtrl", ColumnOptionsCtrl);
        }
    }
});
//# sourceMappingURL=column_options.js.map