/**
 * ユーザーにファイル選択ダイアログを表示する
 */
export function fileOpenDialog(accept: string): Promise<Array<File>> {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.accept = accept;
    input.addEventListener(
      'change',
      () => {
        if (input.files == null) {
          resolve([]);
        } else {
          resolve(Array.from(input.files));
        }
        document.body.removeChild(input);
      },
      false,
    );

    document.body.appendChild(input);
    input.click();
  });
}
