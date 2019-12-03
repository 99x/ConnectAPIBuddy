export interface Theme {
  name: string;
  properties: any;
}

export const light: Theme = {
  name: 'light',
  properties: {
    '--bg-primary': '#F6FAFF',
    '--color-primary': '#000',
    '--placeholder-color': '#000',
    '--status-color': '#fe6b6b',
    '--input-border-color': '#2185d0',
    '--disabled-color': '#BEBBBD',
    '--icon-cogs': '#0B68F1',
    '--icon-bulb': '#0b68f1',
    '--icon-edit': '#021126',
    '--input-bg': '#F6FAFF',
    '--btn-color': '#F6FAFF',
    '--input-color': '#000',

    '--table-child-odd-bg': '#b1b1b17d',
    '--table-child-even-bg': '#2185d0',

    '--dropdown-bg': '#d7d7d8',
    '--dropdown-color': '#000',
    '--dropdown-item-hover-color': '#ED7668',
    '--dropdown-item-hover-bg': '#042454',
    '--btn-dropdown-toggle-box-color': '#0B68F1',

    '--ng-select-container-bg': '#c9cdd478',
    '--ng-container-active-bg': '#F6FAFF',
    '--ng-container-active-color': '#F6FAFF',
    '--ng-dropdown-panel-items-group-header-bg': '#5a6b7e',
    '--ng-dropdown-panel-items-group-header-color': '#f6faff',
    '--ng-dropdown-panel-items-bg': '#d7d7d8',
    '--ng-dropdown-panel-items-color': '#000',
    '--ng-dropdown-panel-items-marked-bg': '#d7d7d8',
    '--ng-dropdown-panel-items-marked-color': '#0B68F1',
    '--ng-dropdown-panel-items-hover-bg': 'd7d7d8',
    '--ng-dropdown-panel-items-hover-color': '#ED7668',

    '--mat-toolbar-bg': '#F6FAFF',
    '--mat-toolbar-color': '#000',
    '--mat-toolbar-raised-btn-bg': '#0B68F1',
    '--mat-toolbar-raised-btn-color': '#F6FAFF',
    '--mat-toolbar-dropdown-arrow-color': '#0B68F1',
    '--mat-toolbar-dropdown-bg': '#F6FAFF',

    '--mat-select-value-color': '#000',
    '--mat-select-arrow': '#1360D4',
    '--mat-select-arrow-after': '#0B68F1',
    '--mat-select-panel-bg': '#D7DFE2',
    '--mat-select-item-bg': '#D7DFE2',
    '--mat-select-item-color': '#000',
    '--mat-select-item-hover-bg': '#042454',
    '--mat-select-item-hover-color': '#ED7668',
    '--mat-select-item-marked': '#0B68F1',
    '--mat-select-item-active-bg': '#0000001f',

    '--mat-expansion-body-bg': '#F6FAFF',
    '--mat-expansion-content-color': '#F6FAFF',
    '--mat-expansion-header-bg': '#0B68F1',
    '--mat-expansion-header-title': '#F6FAFF',
    '--mat-expansion-header-active-bg': '#021126',
    '--mat-expansion-header-focus-bg': '#1360D4',
    '--mat-expansion-header-hover-bg': '#6DA7F7',
    '--mat-expansion-arrow': '#ED7668',

    '--mat-tab-label-color': '#000',
    '--mat-tab-ink-bar': '#0B68F1',

    '--modal-header-color': '#000',
    '--modal-header-bg': '#F6FAFF',
    '--modal-border': '#ED7668',
    '--modal-body-color': '#000',
    '--modal-body-bg': '#F6FAFF',
    '--modal-input-border-focus': '#0B68F1'
  }
}

export const dark: Theme = {
  name: 'dark',
  properties: {
    '--bg-primary': '#041424',
    '--color-primary': '#F6FAFF',
    '--placeholder-color': '#F6FAFF',
    '--status-color': '#05f1a5',
    '--input-border-color': '#2185d0',
    '--disabled-color': '#BEBBBD',
    '--icon-cogs': '#d7d7d8',
    '--icon-bulb': '#0b68f1',
    '--icon-edit': '#F6FAFF',
    '--input-bg': '#011a3b',
    '--btn-color': '#F6FAFF',
    '--input-color': '#F6FAFF',

    '--table-child-odd-bg': '#b1b1b17d',
    '--table-child-even-bg': '#0B68F1',

    '--dropdown-bg': '#042454',
    '--dropdown-color': '#F6FAFF',
    '--dropdown-item-hover-color': '#ED7668',
    '--dropdown-item-hover-bg': '#042454',
    '--btn-dropdown-toggle-box-color': '#041424',

    '--ng-select-container-bg': '#f2f3f54d',
    '--ng-container-active-bg': '#212529',
    '--ng-container-active-color': '#F6FAFF',
    '--ng-dropdown-panel-items-group-header-bg': '#041426',
    '--ng-dropdown-panel-items-group-header-color': '#f6faff',
    '--ng-dropdown-panel-items-bg': '#042454',
    '--ng-dropdown-panel-items-color': '#F6FAFF',
    '--ng-dropdown-panel-items-marked-bg': '#0000001f',
    '--ng-dropdown-panel-items-marked-color': '#0B68F1',
    '--ng-dropdown-panel-items-hover-bg': '',
    '--ng-dropdown-panel-items-hover-color': '#ED7668',

    '--mat-toolbar-bg': '#021126',
    '--mat-toolbar-color': '#f6faff',
    '--mat-toolbar-raised-btn-bg': '#093a84',
    '--mat-toolbar-raised-btn-color': '#F6FAFF',
    '--mat-toolbar-dropdown-arrow-color': '#0b68f1',
    '--mat-toolbar-dropdown-bg': '#021126',

    '--mat-select-value-color': '#0B68F1',
    '--mat-select-arrow': '#1360D4',
    '--mat-select-arrow-after': '#0B68F1',
    '--mat-select-panel-bg': '#042454',
    '--mat-select-item-bg': '#042454',
    '--mat-select-item-color': '#F6FAFF',
    '--mat-select-item-hover-bg': '#042454',
    '--mat-select-item-hover-color': '#ED7668',
    '--mat-select-item-marked': '#0B68F1',
    '--mat-select-item-active-bg': '#0000001f',

    '--mat-expansion-body-bg': '#011a3b',
    '--mat-expansion-content-color': '#F6FAFF',
    '--mat-expansion-header-bg': '#093a84',
    '--mat-expansion-header-title': '#F6FAFF',
    '--mat-expansion-header-active-bg': '#021126',
    '--mat-expansion-header-focus-bg': '#1360D4',
    '--mat-expansion-header-hover-bg': '#6DA7F7',
    '--mat-expansion-arrow': '#ED7668',

    '--mat-tab-label-color': '#F6FAFF',
    '--mat-tab-ink-bar': '#0B68F1',

    '--modal-header-color': '#F6FAFF',
    '--modal-header-bg': '#021126',
    '--modal-border': '#ED7668',
    '--modal-body-color': '#F6FAFF',
    '--modal-body-bg': '#042454',
    '--modal-input-border-focus': '#0B68F1'

  }
}
