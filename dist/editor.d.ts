/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
export declare class TablePanelEditorCtrl {
    private $q;
    private uiSegmentSrv;
    panel: any;
    panelCtrl: any;
    transformers: any;
    fontSizes: any;
    addColumnSegment: any;
    getColumnNames: any;
    canSetColumns: boolean;
    columnsHelpMessage: string;
    /** @ngInject */
    constructor($scope: any, $q: any, uiSegmentSrv: any);
    updateTransformHints(): void;
    getColumnOptions(): any;
    addColumn(): void;
    transformChanged(): void;
    render(): void;
    removeColumn(column: any): void;
}
/** @ngInject */
export declare function tablePanelEditor($q: any, uiSegmentSrv: any): {
    restrict: string;
    scope: boolean;
    templateUrl: string;
    controller: typeof TablePanelEditorCtrl;
};
