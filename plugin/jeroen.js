const {v4: uuid} = require('uuid');

module.exports = loadPlugin = (resources, service) => {
    const api = resources.api;

    return {
        enable: cb => {
            process.nextTick(() => cb(null, true));
        },
        disable: cb => {
            process.nextTick(() => cb(null, true));
        },
        handleMessage: (message, meta) => {
            console.log(`Received message.`, message);

            if (!meta.fresh) {
                return;
            }

            const url = `https://turbokut.nl/?seed=${uuid()}&max_width=512`;

            console.log('Responding to message...', url);
            api.sendPhoto({
                chat_id: message.chat.id,
                photo: url
            });
        },
        handleInlineQuery: (message) => {
            console.log(`Received in-line query.`, message);

            if (!message?.query) {
                api.answerInlineQuery({
                    inline_query_id: message.id,
                    results: []
                });
                return;
            }

            const text = message.query.trim();

            const options = Array(12).fill(true)
                .map(() => {
                    const isTop = Math.random() < 0.5;

                    const id = uuid();
                    const url = maxWidth => `https://turbokut.nl/?seed=${id}&${isTop ? 'top' : 'bottom'}=${encodeURIComponent(text)}&max_width=${maxWidth}`;

                    return {
                        type: 'photo',
                        id,
                        title: id,
                        photo_url: url(512),
                        thumb_url: url(200)
                    };
                });

            console.log('Responding to in-line query...', options);
            api.answerInlineQuery({
                inline_query_id: message.id,
                results: options
            });
        }
    };
};