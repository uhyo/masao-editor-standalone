
// logicの前
export interface LoadGameAction{
    type: 'load-game';
    game: any;
}

// logicの後
export interface GotGameAction{
    type: 'got-game';
    game: any;
}

export type GameActions =
    LoadGameAction |
    GotGameAction;
