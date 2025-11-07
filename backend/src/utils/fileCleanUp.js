import fs from "fs";

export const cleanupLocalFiles = (files) => {
  if (!files) return;
  Object.values(files)
    .flat()
    .forEach((file) => {
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
};