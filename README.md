![kih smp](public/display.gif)

# kih smp

basically rewrote the next.js server so it can connect to a custom Python 3 API. The API can run a 1.20.* minecraft servers on a Raspberry Pi using ngrok. *NOTE: only works on UNIX systems*

## Getting Started

1. Clone the repository to your local machine.

2. Install the dependencies by running `npm install` or `yarn install`.

3. Replace the `AUTH_TOKEN` and `MAP_TOKEN` in [`pages/api/index.py`](pages/api/index.py) with your own ngrok auth token.

4. Install your Forge modded Minecraft server in the `ALL_SERVERS/SERVER` directory.

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Assuming your Raspberry Pi is connected to the same network as your local machine, you should be able to access the server at the IP address of the Raspberry Pi on port 3000. To find the IP address of the Raspberry Pi, you can run the following command on the Raspberry Pi:

```bash
ifconfig
```

## API Endpoints

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

- `/api/status`: Get the status of the Minecraft server.
- `/api/start`: Start the Minecraft server.
- `/api/ip`: Get the IP address of the Minecraft server.
- `/api/map`: Get the map of the Minecraft server.
- `/api/stop`: Stop the Minecraft server.
- `/api/players`: Get the online players on the Minecraft server.

## Building
To build the project, run the following command:

```bash
yarn build
```

This will build the project for production and output the files to the `.next` directory.

## Deployment
To run the server in production mode, run the following command:

```bash
yarn start
```

## Hosting the Application
Unfortunately, the application cannot be hosted on Vercel due to the fact that the server is not serverless. However, you can host the application on a Raspberry Pi or any other server that supports Node.js. Here is the basic ngrok command to expose the server to the internet:

```bash
./ngrok http 3000
```

**Note:** For fixed subdomains, you can setup a simple reverse proxy using Nginx or Apache.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.