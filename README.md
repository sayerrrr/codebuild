# ReSource API

## Getting started

1. Install npm dependencies:

```
cd resource-api
npm install
```

#

2.  Generate Nexus & Prisma types:

```
npm run generate
```

### This should generate a .prisma/ directory and nexus types

#

3. If developing with local postgres database, migrate types and generate schema:

```
npm run prisma:migrate
```

#

3. Start development server:

```
npm run dev:watch
```

#

4. Open up Graphql Playground: <b>localhost:4000/graphql</b>

#

5. Run Prisma Studio to verify schema:

```
npm run prisma:studio
```

### Testing Enviornment Setup

1. Make sure postgres is installed on your local machine

2. Create databes named "testing"

3. make sure to create "root" user with "superuser" permissions (or update TESTING_DB path in env)
