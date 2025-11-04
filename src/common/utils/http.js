// توابع کمکی برای درخواست‌های HTTP
const { default: axios } = require("axios");
require("dotenv").config();

// دریافت جزئیات آدرس از API نقشه بر اساس مختصات
const getAddressDetail = async (lat, lng) => {
    let result;
    
    if (lat && lng) {
        result = await axios.get(`${process.env.GEOLOCATION_API_URL}?lat=${lat}&lon=${lng}`, {
            headers: {
                "x-api-key": process.env.GEOLOCATION_API_TOKEN
            }
        }).then(response => response.data);
    }
    
    return {
        province: result?.province,
        city: result?.city,
        district: result?.region ?? result?.district,
        address: result?.address,
    };
};

module.exports = {
    getAddressDetail
};