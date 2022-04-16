const http = require("http");

const PORT = 4500;
const DEFAULT_HEADER = { "Content-Type": "application/json" };
const HeroFactory = require("./factories/heroFactory");
const heroService = HeroFactory.generateInstance();
const Hero = require("./entities/hero");

const routes = {
    "/heroes:get": async (request, response) => {
        const { id } = request.queryString;
        console.log({ id });
        const heroes = await heroService.find(id);
        response.write(JSON.stringify({ results: heroes }));

        return response.end();
    },

    "/heroes:post": async (request, response) => {
        //Isso é um async iterator
        for await (const data of request) {
            try {
                //await Promise.reject('/heores:get')

                const item = JSON.parse(data);
                console.log("item", item);
                const hero = new Hero(item);
                const { error, valid } = hero.isValid();
                if (!valid) {
                    response.writeHead(400, DEFAULT_HEADER);
                    response.write(JSON.stringify({ error: error.join(",") }));
                    return response.end();
                }
                const id = await heroService.create(hero);
                response.writeHead(201, DEFAULT_HEADER);
                response.write(
                    JSON.stringify({ success: "User Created with success", id })
                );

                //Aqui tem um return porque nesse projeto está sendo enviado apenas um objeto body por requisição,
                // se fosse um arquivo que seria "upado" sob demanda, poderia entrar mais vezes em um mesmo evento,
                //aí tem que tirar esse return, blz?

                return response.end();
            } catch (error) {
                handleError(response)(error);
            }
        }
    },

    default: (request, response) => {
        response.write("Hello");
        response.end();
    },
};

const handleError = (response) => {
    return (error) => {
        console.error("Deu ruim aqui ein!!", error);
        response.writeHead(500, DEFAULT_HEADER);
        response.write(JSON.stringify({ error: "Internal Server Error" }));
        return response.end();
    };
};

const handler = (request, response) => {
    const { url, method } = request;

    const [first, route, id] = url.split("/");

    request.queryString = { id: isNaN(id) ? id : Number(id) };

    const key = `/${route}:${method.toLowerCase()}`;

    response.writeHead(200, DEFAULT_HEADER);

    const chosen = routes[key] || routes.default;
    return chosen(request, response).catch(handleError(response));
};

http.createServer(handler).listen(PORT, () => {
    console.log(`Server is running on Port:${PORT}`);
});
