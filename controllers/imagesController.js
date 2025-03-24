// controllers/imagesController.js
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
    ctx.body = { images: rows }; // ✅ Return wrapped array
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'Error fetching images', error: error.message };
  }
};

// POST /api/images
exports.createImage = async (ctx) => {
    const { property_id, apartment_id, image_url, caption } = ctx.request.body;
  
    if (!property_id || !image_url) {
      ctx.status = 400;
      ctx.body = { message: 'Property ID and Image URL are required.' };
      return;
    }
  
    const query =
      'INSERT INTO images (property_id, apartment_id, image_url, caption) VALUES (?, ?, ?, ?)';
    const params = [
      property_id,
      apartment_id || null,
      JSON.stringify([image_url]), // ✅ Make it a JSON array
      caption || null,
    ];
  
    try {
      const [result] = await pool.query(query, params);
      ctx.body = {
        image_id: result.insertId,
        property_id,
        apartment_id,
        image_url: [image_url], // return as array for consistency
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
  const { property_id, apartment_id, image_url, caption } = ctx.request.body;

  const query =
    'UPDATE images SET property_id = ?, apartment_id = ?, image_url = ?, caption = ? WHERE image_id = ?';
  const params = [property_id, apartment_id || null, image_url, caption || null, id];

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
