import {
  IMAGE_SIZE_THUMB,
  IMAGE_SIZE_SMALL,
  IMAGE_SIZE_MEDIUM,
  IMAGE_SIZE_LARGE,
  IMAGE_SIZE_ZOOM,
} from '../constants/image.constants.js';

export function addImageSizeSuffix(imageUrl, size) {
  const imageSizes = [
    IMAGE_SIZE_THUMB,
    IMAGE_SIZE_SMALL,
    IMAGE_SIZE_MEDIUM,
    IMAGE_SIZE_LARGE,
    IMAGE_SIZE_ZOOM,
  ];
  if (imageSizes.includes(size)) {
    const imageFileName = imageUrl.substring(0, imageUrl.lastIndexOf('.'));
    const imageFileExt = imageUrl.substring(
      imageUrl.lastIndexOf('.'),
      imageUrl.length
    );

    const newImageUrl = imageFileName + '-' + size + imageFileExt;
    return newImageUrl;
  }
  return imageUrl;
}
