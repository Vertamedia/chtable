///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['lodash', 'moment', 'app/core/utils/kbn'], function(exports_1) {
    var lodash_1, moment_1, kbn_1;
    var TableRenderer;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            }],
        execute: function() {
            TableRenderer = (function () {
                function TableRenderer(panel, table, isUtc, sanitize, templateSrv) {
                    this.panel = panel;
                    this.table = table;
                    this.isUtc = isUtc;
                    this.sanitize = sanitize;
                    this.templateSrv = templateSrv;
                    this.initColumns();
                }
                TableRenderer.prototype.setTable = function (table) {
                    this.table = table;
                    this.initColumns();
                };
                TableRenderer.prototype.initColumns = function () {
                    this.formatters = [];
                    this.colorState = {};
                    for (var colIndex = 0; colIndex < this.table.columns.length; colIndex++) {
                        var column = this.table.columns[colIndex];
                        column.title = column.text;
                        for (var i = 0; i < this.panel.styles.length; i++) {
                            var style = this.panel.styles[i];
                            var regex = kbn_1.default.stringToJsRegex(style.pattern);
                            if (column.text.match(regex)) {
                                column.style = style;
                                if (style.alias) {
                                    column.title = column.text.replace(regex, style.alias);
                                }
                                break;
                            }
                        }
                        this.formatters[colIndex] = this.createColumnFormatter(column);
                    }
                };
                TableRenderer.prototype.getColorForValue = function (value, style) {
                    if (!style.thresholds) {
                        return null;
                    }
                    for (var i = style.thresholds.length; i > 0; i--) {
                        if (value >= style.thresholds[i - 1]) {
                            return style.colors[i];
                        }
                    }
                    return lodash_1.default.first(style.colors);
                };
                TableRenderer.prototype.defaultCellFormatter = function (v, style) {
                    if (v === null || v === void 0 || v === undefined) {
                        return '';
                    }
                    if (lodash_1.default.isArray(v)) {
                        v = v.join(', ');
                    }
                    if (style && style.sanitize) {
                        return this.sanitize(v);
                    }
                    else {
                        return lodash_1.default.escape(v);
                    }
                };
                TableRenderer.prototype.createColumnFormatter = function (column) {
                    var _this = this;
                    var self = this;
                    if (!column.style) {
                        return this.defaultCellFormatter;
                    }
                    switch (column.style.type) {
                        case 'hidden':
                            return function (v) {
                                return undefined;
                            };
                        case 'date':
                            return function (v) {
                                if (v === undefined || v === null) {
                                    return '-';
                                }
                                if (lodash_1.default.isArray(v)) {
                                    v = v[0];
                                }
                                var date = moment_1.default(v);
                                if (_this.isUtc) {
                                    date = date.utc();
                                }
                                return date.format(column.style.dateFormat);
                            };
                        case 'number':
                            var valueFormatter = kbn_1.default.valueFormats[column.unit || column.style.unit];
                            return function (v) {
                                if (v === null || v === void 0) {
                                    return '-';
                                }
                                if (lodash_1.default.isString(v)) {
                                    return _this.defaultCellFormatter(v, column.style);
                                }
                                if (column.style.colorMode) {
                                    _this.colorState[column.style.colorMode] = _this.getColorForValue(v, column.style);
                                }
                                return valueFormatter(v, column.style.decimals, null);
                            };
                        /* case 'json-obj':
                             return function (v) {
                                 if (typeof v !== 'string') {
                                     return v;
                                 }
                                 var obj = self.betweenBraces(v);
                                 if (obj === "") {
                                     return v;
                                 }
                                 angular.element(document).injector().invoke(function ($compile) {
                                     var scope = self.scope.$new(true);
                                     scope.jsonObj = JSON.parse(obj);
                                     v = $compile('<json-tree root-name="root" object="jsonObj" start-expanded="false"></json-tree>')(scope);
                                 });
                                 return v;
                             };
                         case 'json-plain':
                             return function (v) {
                                 if (typeof v !== 'string') {
                                     return v;
                                 }
                                 var str = self.betweenBraces(v);
                                 if (str === "") {
                                     return v;
                                 }
                                 const jsonString = self.isJSON(str);
                                 // To prevent a number from being stringified
                                 if (jsonString.success && isNaN(Number.parseFloat(jsonString.result))) {
                                     return '<pre>' + _.escape(JSON.stringify(jsonString.result, null, 2)) + '</pre>';
                                 } else {
                                     return jsonString.result;
                                 }
                             };*/
                        default:
                            return function (value) {
                                return _this.defaultCellFormatter(value, column.style);
                            };
                    }
                };
                TableRenderer.prototype.isJSON = function (value) {
                    try {
                        return {
                            success: true,
                            result: JSON.parse(lodash_1.default.unescape(value))
                        };
                    }
                    catch (e) {
                        return {
                            success: false,
                            result: value
                        };
                    }
                };
                TableRenderer.prototype.betweenBraces = function (str) {
                    var openBraces = 0, subQuery = '';
                    var from = str.indexOf('{');
                    if (from === -1) {
                        return "";
                    }
                    for (var i = from; i < str.length; i++) {
                        if (str.charAt(i) === '{') {
                            openBraces++;
                        }
                        if (str.charAt(i) === '}') {
                            if (openBraces === 1) {
                                subQuery = str.substring(from, i + 1);
                                break;
                            }
                            openBraces--;
                        }
                    }
                    return subQuery;
                };
                TableRenderer.prototype.renderRowVariables = function (rowIndex) {
                    var scopedVars = {};
                    var cell_variable;
                    var row = this.table.rows[rowIndex];
                    for (var i = 0; i < row.length; i++) {
                        cell_variable = "__cell_" + i;
                        scopedVars[cell_variable] = { value: row[i] };
                    }
                    return scopedVars;
                };
                TableRenderer.prototype.formatColumnValue = function (colIndex, value) {
                    return this.formatters[colIndex] ? this.formatters[colIndex](value) : value;
                };
                TableRenderer.prototype.renderCell = function (columnIndex, rowIndex, value, addWidthHack) {
                    if (addWidthHack === void 0) { addWidthHack = false; }
                    value = this.formatColumnValue(columnIndex, value);
                    var column = this.table.columns[columnIndex];
                    var style = '';
                    var cellClasses = [];
                    var cellClass = '';
                    if (this.colorState.cell) {
                        style = ' style="background-color:' + this.colorState.cell + ';color: white"';
                        this.colorState.cell = null;
                    }
                    else if (this.colorState.value) {
                        style = ' style="color:' + this.colorState.value + '"';
                        this.colorState.value = null;
                    }
                    // because of the fixed table headers css only solution
                    // there is an issue if header cell is wider the cell
                    // this hack adds header content to cell (not visible)
                    var columnHtml = '';
                    if (addWidthHack) {
                        columnHtml = '<div class="table-panel-width-hack">' + this.table.columns[columnIndex].title + '</div>';
                    }
                    if (value === undefined) {
                        style = ' style="display:none;"';
                        column.hidden = true;
                    }
                    else {
                        column.hidden = false;
                    }
                    if (column.style && column.style.preserveFormat) {
                        cellClasses.push("table-panel-cell-pre");
                    }
                    if (column.style && column.style.link) {
                        // Render cell as link
                        var scopedVars = this.renderRowVariables(rowIndex);
                        scopedVars['__cell'] = { value: value };
                        var cellLink = this.templateSrv.replace(column.style.linkUrl, scopedVars);
                        var cellLinkTooltip = this.templateSrv.replace(column.style.linkTooltip, scopedVars);
                        var cellTarget = column.style.linkTargetBlank ? '_blank' : '';
                        cellClasses.push("table-panel-cell-link");
                        columnHtml += "\n        <a href=\"" + cellLink + "\" target=\"" + cellTarget + "\" data-link-tooltip data-original-title=\"" + cellLinkTooltip + "\" data-placement=\"right\">\n          " + value + "\n        </a>\n      ";
                    }
                    else {
                        columnHtml += value;
                    }
                    if (column.filterable) {
                        cellClasses.push("table-panel-cell-filterable");
                        columnHtml += "\n        <a class=\"table-panel-filter-link\" data-link-tooltip data-original-title=\"Filter out value\" data-placement=\"bottom\"\n           data-row=\"" + rowIndex + "\" data-column=\"" + columnIndex + "\" data-operator=\"!=\">\n          <i class=\"fa fa-search-minus\"></i>\n        </a>\n        <a class=\"table-panel-filter-link\" data-link-tooltip data-original-title=\"Filter for value\" data-placement=\"bottom\"\n           data-row=\"" + rowIndex + "\" data-column=\"" + columnIndex + "\" data-operator=\"=\">\n          <i class=\"fa fa-search-plus\"></i>\n        </a>";
                    }
                    if (cellClasses.length) {
                        cellClass = ' class="' + cellClasses.join(' ') + '"';
                    }
                    columnHtml = '<td' + cellClass + style + '>' + columnHtml + '</td>';
                    return columnHtml;
                };
                TableRenderer.prototype.render = function (rows) {
                    var html = "";
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        var cellHtml = '';
                        var rowStyle = '';
                        for (var j = 0; j < this.table.columns.length; j++) {
                            cellHtml += this.renderCell(j, j, row[j], i === 0);
                        }
                        if (this.colorState.row) {
                            rowStyle = ' style="background-color:' + this.colorState.row + ';color: white"';
                            this.colorState.row = null;
                        }
                        html += '<tr ' + rowStyle + '>' + cellHtml + '</tr>';
                    }
                    return html;
                };
                /*  render(page): strign {
                      let pageSize = this.panel.pageSize || 100;
                      let startPos = page * pageSize;
                      let endPos = Math.min(startPos + pageSize, this.table.rows.length);
                      var html = "";
              
                      for (var y = startPos; y < endPos; y++) {
                          let row = this.table.rows[y];
                          let cellHtml = '';
                          let rowStyle = '';
                          for (var i = 0; i < this.table.columns.length; i++) {
                              cellHtml += this.renderCell(i, y, row[i], y === startPos);
                          }
              
                          if (this.colorState.row) {
                              rowStyle = ' style="background-color:' + this.colorState.row + ';color: white"';
                              this.colorState.row = null;
                          }
              
                          html += '<tr ' + rowStyle + '>' + cellHtml + '</tr>';
                      }
              
                      return html;
                  }*/
                TableRenderer.prototype.render_values = function () {
                    var rows = [];
                    for (var y = 0; y < this.table.rows.length; y++) {
                        var row = this.table.rows[y];
                        var new_row = [];
                        for (var i = 0; i < this.table.columns.length; i++) {
                            new_row.push(this.formatColumnValue(i, row[i]));
                        }
                        rows.push(new_row);
                    }
                    return {
                        columns: this.table.columns,
                        rows: rows,
                    };
                };
                return TableRenderer;
            })();
            exports_1("TableRenderer", TableRenderer);
        }
    }
});
//# sourceMappingURL=renderer.js.map