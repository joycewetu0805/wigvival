export const uploadImage = async (req, res) => {
  res.json({
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
};
