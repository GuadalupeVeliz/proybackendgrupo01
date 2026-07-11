const { randomUUID } = require('crypto');
const path = require('path');
const supabase = require('../../config/supabase.config');

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'paquetes';
const CARPETA = 'paquetes';

const extensionPorMime = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const rutaDesdeUrlPublica = (url) => {
  if (!url || typeof url !== 'string') return null;
  const marcador = `/storage/v1/object/public/${encodeURIComponent(BUCKET)}/`;
  const indice = url.indexOf(marcador);
  if (indice === -1) return null;
  return decodeURIComponent(url.slice(indice + marcador.length).split('?')[0]);
};

const obtenerUrlPublica = (ruta) => {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(ruta);
  if (!data?.publicUrl) throw new Error('Supabase no devolvió una URL pública para la imagen.');
  return data.publicUrl;
};

const subirImagen = async (archivo) => {
  const extension = extensionPorMime[archivo.mimetype] || path.extname(archivo.originalname).toLowerCase();
  const ruta = `${CARPETA}/${randomUUID()}${extension}`;
  const { error } = await supabase.storage.from(BUCKET).upload(ruta, archivo.buffer, {
    contentType: archivo.mimetype,
    upsert: false,
  });
  if (error) throw new Error(`No se pudo subir una imagen a Supabase: ${error.message}`);
  return { ruta, url: obtenerUrlPublica(ruta) };
};

const eliminarImagen = async (rutaOUrl) => {
  const ruta = rutaOUrl.startsWith('http') ? rutaDesdeUrlPublica(rutaOUrl) : rutaOUrl;
  if (!ruta) return;
  const { error } = await supabase.storage.from(BUCKET).remove([ruta]);
  if (error) throw new Error(`No se pudo eliminar una imagen de Supabase: ${error.message}`);
};

const eliminarImagenes = async (rutasOUrls = []) => {
  const rutas = rutasOUrls
    .map((valor) => (valor?.startsWith('http') ? rutaDesdeUrlPublica(valor) : valor))
    .filter(Boolean);
  if (rutas.length === 0) return;
  const { error } = await supabase.storage.from(BUCKET).remove(rutas);
  if (error) throw new Error(`No se pudieron eliminar imágenes de Supabase: ${error.message}`);
};

const subirImagenes = async (archivos = []) => {
  const subidas = [];
  try {
    for (const archivo of archivos) subidas.push(await subirImagen(archivo));
    return subidas;
  } catch (error) {
    await eliminarImagenes(subidas.map(({ ruta }) => ruta)).catch(() => undefined);
    throw error;
  }
};

module.exports = {
  subirImagen,
  subirImagenes,
  obtenerUrlPublica,
  eliminarImagen,
  eliminarImagenes,
  rutaDesdeUrlPublica,
};
