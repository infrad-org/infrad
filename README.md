<img src="https://user-images.githubusercontent.com/649392/198850498-a059cc50-ad57-4ff6-887b-d80d088fb565.png" width=35% height=35%>

Infrad is a web-based application that enables people wanting to increase the livability of their cities and towns. Ideas, initiatives and concerns can be interchanged and discussed. Changes and progress can be transparantly shared and tracked.

If you are interested in what is currently being worked on, and what will be next, check out the [Trello board](https://trello.com/b/eNd1jl6u/infrad).

## Implementation

Infrad is written in TypeScript.

The **frontend** is built with of React and [UnoCSS](https://github.com/unocss/unocss) using [MapLibre GL JS](https://maplibre.org/) for showing maps.

A [serverless](https://en.wikipedia.org/wiki/Serverless_computing) **backend** is used (meaning there are no specific servers that need to be managed). In particular, the main backend is deployed to [CloudFlare Workers](https://workers.cloudflare.com/), with [vite-plugin-ssr](https://vite-plugin-ssr.com/) handling SSR and [Telefunc](https://telefunc.com/) handling RPC calls. PostgreSQL is used as a database, with [PostgREST](https://postgrest.org/en/stable/) as an intermediary since arbitrary TCP connections are not possible from Cloudflare Workers.

A diagram of this architecture can be found below. The main motivation for choosing this setup was development speed, not scalability or architectural soundness. Nevertheless, it will be interesting to learn about the limitations and strenghts of this architecture. 

![infrad-architecture drawio](https://user-images.githubusercontent.com/649392/198850553-8856f9e2-5ca0-4b55-b468-1c8ff1d7654d.png)

You need to use `docker-compose up` to run PostgreSQL and PostgREST locally. Then you can run `npm run dev` to run the dev server.

## See Also

- [Veilig Verkeer Nederland Participatiepunt](https://participatiepunt.vvn.nl/) (the Netherlands)
- [Cyclestreets](https://www.cyclestreets.net/photomap/) (United Kingdom)
- [Cyclescape](https://www.cyclescape.org/) (United Kingdom)
- [DansMaRue](https://play.google.com/store/apps/details?id=fr.paris.android.signalement&hl=en&gl=US) (Paris, France)
