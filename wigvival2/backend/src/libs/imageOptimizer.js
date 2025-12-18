import sharp from 'sharp';
import fs from 'fs';

export const optimizeImage = async (input, output) => {
  await sharp(input)
    .resize(1200)
    .jpeg({ quality: 80 })
    .toFile(output);

  fs.unlinkSync(input);
};
