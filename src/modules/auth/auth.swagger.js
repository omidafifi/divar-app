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
