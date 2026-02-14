import crypto from 'node:crypto'; 

const mainRouter = (req, res, wss) => {
    console.log(wss);
    
  function generateApiKey(length = 32) {
    // Generate random bytes and convert to a hex string
    return crypto
      .randomBytes(Math.ceil(length))
      .toString("base64")
      .slice(0, length);
  }
  res.json({ message: "success", key: generateApiKey() }).status(200);
};

export default mainRouter;
