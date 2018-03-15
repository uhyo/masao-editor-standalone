// file upload dialogを表示
export default function fileUpload(): Promise<Array<File>> {
  return new Promise((resolve, _reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.style.visibility = 'hidden';

    document.body.appendChild(input);
    input.click();

    input.addEventListener(
      'change',
      () => {
        const files = Array.from<File>(input.files!);
        resolve(files);
      },
      false,
    );
    document.body.removeChild(input);
  });
}
