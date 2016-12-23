export interface TestplayAction {
    type: 'testplay';
    startStage: number;
    game: any;
}

export interface EndTestplayAction {
    type: 'end-testplay';
}
