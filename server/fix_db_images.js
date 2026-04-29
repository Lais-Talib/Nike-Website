const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product.js'); // Ensure correct path to model

dotenv.config();

const fixImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Fix Nike ZoomX Vaporfly NEXT% 2 (replace Puma image)
    const vaporfly = await Product.findOneAndUpdate(
      { name: 'Nike ZoomX Vaporfly NEXT% 2' },
      { image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd17b420-b388-4c8a-aaaa-e0a98ddf175f/zoomx-vaporfly-next-2-mens-road-racing-shoes-glWqfm.png' },
      { new: true }
    );
    if (vaporfly) console.log('Fixed Vaporfly image');

    // Fix Nike Sunray Protect 3 (replace high heels image)
    const sunray = await Product.findOneAndUpdate(
      { name: 'Nike Sunray Protect 3' },
      { image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/a240ec88-c782-4467-bc13-8fc65d564bb3/sunray-protect-3-little-kids-sandals-vB0m5q.png' },
      { new: true }
    );
    if (sunray) console.log('Fixed Sunray Protect image');

    // Fix Nike Phantom Luna Kids (replace bridge running image)
    const phantom = await Product.findOneAndUpdate(
      { name: 'Nike Phantom Luna Kids' },
      { image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/23e98cc1-660c-482a-aeb4-500ea5463ed9/phantom-gx-2-academy-little-older-kids-mg-low-top-football-boot-7Hh62M.png' },
      { new: true }
    );
    if (phantom) console.log('Fixed Phantom Luna image');

    console.log('Database images fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing images:', error);
    process.exit(1);
  }
};

fixImages();
