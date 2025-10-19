/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Auth Mobile and Routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     sendOTP:
 *       type: object
 *       required:
 *         - mobile
 *       properties:
 *         mobile:
 *           type: string
 *     checkOTP:
 *       type: object
 *       required:
 *         - mobile
 *         - code
 *       properties:
 *         mobile:
 *           type: string
 *         code:
 *           type: string
 */

/**
 * @swagger
 *
 * /auth/send-otp:
 *   post:
 *     summary: login with OTP in this endpoint
 *     tags:
 *       - Auth
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/sendOTP'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sendOTP'
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * @swagger
 *
 * /auth/check-otp:
 *   post:
 *     summary: check OTP for login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/checkOTP'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/checkOTP'
 *     responses:
 *       200:
 *         description: Success
 */
