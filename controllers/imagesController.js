const pool = require('../database'); // Import MySQL connection pool

// GET /api/images?property_id=...&apartment_id=...
exports.getImages = async (ctx) => {
  let { property_id, apartment_id } = ctx.request.query;
  let query = 'SELECT * FROM images';
  let params = [];

  if (property_id || apartment_id) {
    const conditions = [];
    if (property_id) {
      conditions.push(' property_id = ?');
      params.push(property_id);
    }
    if (apartment_id) {
      conditions.push(' apartment_id = ?');
      params.push(apartment_id);
    }
    query += ' WHERE' + conditions.join(' AND ');
  }

  try {
    const [rows] = await pool.query(query, params);

    // Convert the binary blob to a base64 string so it's easier to work with on the client side
    rows.forEach((row) => {
      if (row.image_data && Buffer.isBuffer(row.image_data)) {
        row.image_data = row.image_data.toString('base64');
      }
    });
    ctx.body = { images: rows }; // Return wrapped array
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'Error fetching images', error: error.message };
  }
};

// POST /api/images
exports.createImage = async (ctx) => {
  const { property_id, apartment_id, image_data, mime_type, caption } =
    ctx.request.body;

  if (!property_id || !image_data || !mime_type) {
    ctx.status = 400;
    ctx.body = {
      message: 'Property ID, image data, and MIME type are required.',
    };
    return;
  }

  // Validate MIME type
  if (mime_type !== 'image/jpeg' && mime_type !== 'image/png') {
    ctx.status = 400;
    ctx.body = {
      message: 'Invalid image type. Only JPEG and PNG are allowed.',
    };
    return;
  }

  // Convert base64 string to a Buffer
  const buffer = Buffer.from(image_data, 'base64');
  const query =
    'INSERT INTO images (property_id, apartment_id, image_data, mime_type, caption) VALUES (?, ?, ?, ?, ?)';
  const params = [
    property_id,
    apartment_id || null,
    buffer,
    mime_type,
    caption || null,
  ];

  try {
    const [result] = await pool.query(query, params);
    ctx.body = {
      image_id: result.insertId,
      property_id,
      apartment_id,
      // Return the original base64 string for consistency
      image_data,
      mime_type,
      caption,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'Error creating image', error: error.message };
  }
};

// PUT /api/images/:id
exports.updateImage = async (ctx) => {
  const { id } = ctx.params;
  const { property_id, apartment_id, image_data, mime_type, caption } =
    ctx.request.body;

  // If updating the image, both the data and its type must be provided and validated.
  if (
    image_data &&
    (!mime_type || (mime_type !== 'image/jpeg' && mime_type !== 'image/png'))
  ) {
    ctx.status = 400;
    ctx.body = {
      message: 'Invalid image type provided. Only JPEG and PNG are allowed.',
    };
    return;
  }

  // Construct update query based on provided fields.
  let query = 'UPDATE images SET property_id = ?, apartment_id = ?, ';
  const params = [property_id, apartment_id || null];

  if (image_data) {
    query += ' image_data = ?, mime_type = ?, ';
    const buffer = Buffer.from(image_data, 'base64');
    params.push(buffer, mime_type);
  }

  query += ' caption = ? WHERE image_id = ?';
  params.push(caption || null, id);

  try {
    await pool.query(query, params);
    ctx.body = { message: 'Image updated successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'Error updating image', error: error.message };
  }
};

// DELETE /api/images/:id
exports.deleteImage = async (ctx) => {
  const { id } = ctx.params;
  const query = 'DELETE FROM images WHERE image_id = ?';
  const params = [id];

  try {
    await pool.query(query, params);
    ctx.body = { message: 'Image deleted successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'Error deleting image', error: error.message };
  }
};
