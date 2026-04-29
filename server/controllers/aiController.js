const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

// @desc    Get AI response for shopping assistance
// @route   POST /api/ai/chat
// @access  Public
const getChatResponse = async (req, res) => {
  const { message, chatHistory = [] } = req.body;

  try {
    console.log('AI Chat Request received:', message);
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_key_here') {
      console.error('Gemini API Key is missing or invalid.');
      return res.status(500).json({ message: 'Gemini API Key is missing. Please add it to your .env file.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Fetch all products to give context to AI
    const products = await Product.find({});
    const productContext = products.map(p => 
      `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Subcategory: ${p.subcategory}, Price: $${p.price}, Color: ${p.color}, Description: ${p.description}`
    ).join('\n');

    const systemPrompt = `
      You are "Nike Assistant", a premium AI shopping expert for a Nike-inspired e-commerce store.
      Your goal is to help users find the perfect shoes from our catalog.
      
      Here is our current product catalog:
      ${productContext}
      
      NEW FEATURE: ACTIONS
      You can now interact with the user's shopping cart.
      If a user explicitly asks you to "add to cart", "buy this", or "I want this one", you should include a special command at the END of your message in exactly this format:
      [ACTION: ADD_TO_CART, ID: {product_id}]
      
      Example: "Great choice! I've added the Air Jordan 1 to your cart for you. [ACTION: ADD_TO_CART, ID: 1]"
      
      Guidelines:
      1. Be professional, enthusiastic, and helpful.
      2. If a user asks for recommendations, suggest specific shoes from the catalog above.
      3. Always include the price and name of the shoes you recommend.
      4. If we don't have exactly what they want, suggest the closest alternative.
      5. Keep responses concise but "premium" in tone.
      6. Use the product names exactly as they appear in the catalog.
      7. ONLY use the [ACTION] tag if the user clearly wants to add the item to their cart.
    `;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I am your Nike Assistant. How can I help you find the perfect pair of shoes today?" }] },
        ...chatHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }))
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    console.log('AI Response:', text);

    res.json({ text });
  } catch (error) {
    console.error('AI Chat Error:', error);
    if (error.message && error.message.includes('leaked')) {
      return res.status(403).json({ message: 'Gemini API Key reported as leaked. Please generate a new one at https://aistudio.google.com/app/apikey' });
    }
    res.status(500).json({ message: 'AI Assistant is temporarily unavailable.' });
  }
};

module.exports = { getChatResponse };
