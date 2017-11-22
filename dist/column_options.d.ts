/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
export declare class ColumnOptionsCtrl {
    panel: any;
    panelCtrl: any;
    colorModes: any;
    columnStyles: any;
    columnTypes: any;
    fontSizes: any;
    dateFormats: any;
    addColumnSegment: any;
    unitFormats: any;
    getColumnNames: any;
    activeStyleIndex: number;
    /** @ngInject */
    constructor($scope: any);
    render(): void;
    setUnitFormat(column: any, subItem: any): void;
    addColumnStyle(): void;
    removeColumnStyle(style: any): void;
    invertColorOrder(index: any): void;
    onColorChange(styleIndex: any, colorIndex: any): (newColor: any) => void;
}
/** @ngInject */
export declare function columnOptionsTab($q: any, uiSegmentSrv: any): {
    restrict: string;
    scope: boolean;
    templateUrl: string;
    controller: typeof ColumnOptionsCtrl;
};
