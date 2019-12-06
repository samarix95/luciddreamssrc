const providers = ['vk'];

const PORT = 3001;

const callbacks = providers.map(provider => {
    return process.env.NODE_ENV === 'production'
        ? `https://luciddreamsback.herokuapp.com/${provider}/callback`
        : `http://localhost:` + PORT + `/${provider}/callback`
});

const [vkURL] = callbacks;

exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
    ? 'https://react-auth-twitter.netlify.com'
    : ['http://localhost:3000/', 'http://localhost:3000/']

exports.VK_CONFIG = {
    clientID: 7227007,
    clientSecret: "Q8lAKUXmmZfeGYD2rQZx",
    callbackURL: vkURL,
}

exports.PORT = 3001;