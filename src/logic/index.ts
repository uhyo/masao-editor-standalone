// collect logics.
import initLogic from './init';
import testplayLogic from './testplay';
import resourceLogic from './resource';
import gameLogic from './game';
import fileLogic from './file';

export default [
  ...initLogic,
  ...testplayLogic,
  ...resourceLogic,
  ...gameLogic,
  ...fileLogic,
];
