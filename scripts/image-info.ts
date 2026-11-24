import { createHash } from 'node:crypto';

/**
 * Formato, tamaño y hash de una imagen empaquetada (fase C.9.1). Lee sólo la cabecera: PNG (IHDR) y
 * JPEG (primer SOFn). Sin dependencias.
 */
export interface ImageInfo {
  format: 'png' | 'jpeg';
  width: number;
  height: number;
  bytes: number;
  sha256: string;
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

export function imageInfo(buf: Uint8Array): ImageInfo {
  const bytes = buf.length;
  const sha256 = createHash('sha256').update(buf).digest('hex');
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);

  if (PNG_SIGNATURE.every((b, i) => buf[i] === b)) {
    // IHDR es siempre el primer bloque: ancho y alto en los bytes 16–23.
    return { format: 'png', width: view.getUint32(16), height: view.getUint32(20), bytes, sha256 };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < bytes) {
      if (buf[i] !== 0xff) throw new Error('JPEG mal formado');
      const marker = buf[i + 1]!;
      const length = view.getUint16(i + 2);
      // SOF0–SOF15 salvo DHT (C4), JPG (C8) y DAC (CC).
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return {
          format: 'jpeg',
          height: view.getUint16(i + 5),
          width: view.getUint16(i + 7),
          bytes,
          sha256,
        };
      i += 2 + length;
    }
    throw new Error('JPEG sin tamaño (SOF)');
  }
  throw new Error('Formato no admitido: sólo PNG o JPEG');
}
