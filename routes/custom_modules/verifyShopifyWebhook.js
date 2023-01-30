var config = require('../../config/config.js');
const crypto = require('crypto');
const _ = require('lodash');
require('dotenv').config();

const SERVER_PORT = config.SERVER_PORT;
const SHOPIFY_WEBHOOK_VERIFICATION_KEY = config.SHOPIFY_WEBHOOK_VERIFICATION_KEY;



module.exports = function verifyShopifyWebhook(req, res, buf, encoding){
    if(buf && buf.length){
        const rawBody = buf.toString(encoding || 'utf8');
        const hmac = req.get('X-Shopify-Hmac-Sha256');

        const hash = crypto
            .createHmac('sha256', SHOPIFY_WEBHOOK_VERIFICATION_KEY)
            .update(rawBody, 'utf8', 'hex')
            .digest('base64');

        req.custom_shopify_verified = (hmac === hash);

    }else {
        req.custom_shopify_verified = false;
    }
}