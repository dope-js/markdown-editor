export function getImageSize(file: File | undefined) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    if (!file) return reject(new Error('file is undefined'));

    if (!file.type.startsWith('image/')) return reject(new Error('file is not image'));

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const { width, height } = img;
      resolve({ width, height });
    };

    img.onerror = (e) => {
      reject(e);
    };
  });
}

export function uploadFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.readAsDataURL(file);
  });
}
