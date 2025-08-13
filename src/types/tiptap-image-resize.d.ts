// tiptap-image-resize.d.ts
declare module 'tiptap-extension-resize-image' {
  import { Node } from '@tiptap/core';

  export interface ImageResizeOptions {
    handleSize?: number;
    preserveAspectRatio?: boolean;
  }

  const ImageResize: Node<ImageResizeOptions, unknown>;
  export default ImageResize;
}
