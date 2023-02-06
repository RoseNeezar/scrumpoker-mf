# Micro frontend Scrumpoker

Micro frontend scrumpoker application than can be consume by other micro frontends.

## Features

- Create game
- Join game
- Share game links
- Player voting
- Hide/Show vote
- Create new round
- Player Session persistence

## Tech Stack

### Frontend

- Reactjs (craco)
- Typescript
- Tailwind css
- Zustand

### Backend

- Express
- Typescript
- Mongodb
- Trpc
- Pusherjs

### Devops

- Docker
- Docker compose
- Github Actions

## Installation

Use the env.example file to know which variable is needed from firebase.

```bash
cp .env.example .env
```

```bash
yarn i && yarn dev
```

App runs by default at http://localhost:3030

## Helpers

Install lazydocker on your system. This tool can help visualise container logs.

## License

[MIT](https://choosealicense.com/licenses/mit/)
