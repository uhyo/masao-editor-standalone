// make file download!

export default function download(name: string, blob: Blob): void {
  // ダウンロードさせる
  const a = document.createElement('a');
  a.download = name;

  const url = URL.createObjectURL(blob);
  a.href = url;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
