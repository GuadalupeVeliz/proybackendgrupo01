const axios = require('axios');

const traducir = async (texto, idiomaDestino) => {
    try {
        const response = await axios.get(
            'https://api.mymemory.translated.net/get',
            {
                params: {
                    q: texto,
                    langpair: `es|${idiomaDestino}`
                }
            }
        );

        return response.data.responseData.translatedText;

    } catch (error) {
        console.error(
            'Error traduciendo:',
            error.response?.data || error.message
        );

        return texto;
    }
};

module.exports = { traducir };