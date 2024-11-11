# Get the W3ather

## Installation instructions

To get started, clone the repo and create a .env file in your root directory. Enter the following API keys in the file. You can create API keys for each service from https://home.openweathermap.org/users/sign_up and https://platform.openai.com/settings/organization/api-keys or you can ask Wes for the keys he used to create this repo :)

```env
OPENWEATHERMAP_API_KEY=<OpenWeatherMap API key>
OPENAI_API_KEY=<OpenAI API key>
```

Once your .env file is created, make sure you have (pnpm)[https://pnpm.io/installation] installed, and from the root directory run:

```sh
pnpm install
```

Once the depenencies finish installing, start the client and server by running:

```sh
pnpm start
```

The server will start up on port 3000, and the client will start up on port 4200. To visit the app UI, go to http://localhost:4200 in your browser

## Running the Tests

To run tests for both the client and server run

```sh
pnpm test
```

Or to run test for just the client or server run

```sh
pnpm test:client
```

or

```sh
pnpm test:server
```

## CI

To see the CI test runs for the repo, visit https://cloud.nx.app/orgs/672b8d5d423b8f1d8d05cfa4/workspaces/672ba11b74b40c6c71191a5b/overview
