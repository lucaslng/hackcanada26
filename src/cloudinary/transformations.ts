// transformations.ts

// transformation.ts

import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { auto } from '@cloudinary/url-gen/qualifiers/format';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';
import { cld } from './config';

/**
 * Document preview thumbnail — used in the doc upload list after a file is uploaded.
 */
export function docPreviewImage(publicId: string) {
  return cld
    .image(publicId)
    .resize(fill().width(300).height(200))
    .delivery(format(auto()))
    .delivery(quality(autoQuality()));
}

/**
 * Full-size document display — used if you ever need to render a full preview.
 */
export function docFullImage(publicId: string) {
  return cld
    .image(publicId)
    .resize(fill().width(800).height(600))
    .delivery(format(auto()))
    .delivery(quality(autoQuality()));
}