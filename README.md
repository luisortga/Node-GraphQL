<div align="center">

# Node GraphQL

### Learning GraphQL with Node.js & Apollo Server

[![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-339933?style=for-the-badge\&logo=node.js\&logoColor=white)](https://nodejs.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-17.0.2-E10098?style=for-the-badge\&logo=graphql\&logoColor=white)](https://graphql.org/)
[![Apollo Server](https://img.shields.io/badge/Apollo%20Server-3.13.0-311C87?style=for-the-badge\&logo=apollographql\&logoColor=white)](https://www.apollographql.com/docs/apollo-server/)
[![Axios](https://img.shields.io/badge/Axios-HTTP%20Client-5A29E6?style=for-the-badge\&logo=axios\&logoColor=white)](https://axios-http.com/)
[![JSON Server](https://img.shields.io/badge/JSON%20Server-REST%20Mock-000000?style=for-the-badge)](https://github.com/typicode/json-server)
[![pnpm](https://img.shields.io/badge/pnpm-11.8.0-F69220?style=for-the-badge\&logo=pnpm\&logoColor=white)](https://pnpm.io/)
[![GitHub](https://img.shields.io/badge/Repository-GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)](https://github.com/luisortga/Node-GraphQL)

<br>

<img src="https://skillicons.dev/icons?i=nodejs,graphql,js&theme=dark" alt="Technology Stack">

</div>

---

## Overview

**Node GraphQL** is a learning project focused on understanding how to build and consume a **GraphQL API with Node.js and Apollo Server**.

The project is currently in development and serves as a practical environment for exploring fundamental GraphQL concepts such as:

* Schemas
* Types
* Queries
* Mutations
* Resolvers
* Arguments
* Enums
* Nested objects
* Input validation
* GraphQL errors
* REST API integration

The current example is based around a small collection of **persons and their addresses**, providing a simple domain for experimenting with GraphQL operations.

---

## Project Status

> **Status: Learning / In Progress**

This repository is intentionally being developed incrementally.

The current implementation already includes a working Apollo Server with GraphQL schema definitions, queries, mutations, resolvers, and communication with a REST endpoint through Axios.

Future iterations will expand the API and explore additional GraphQL features.

---

## Architecture

One of the main learning goals of this project is understanding how GraphQL can sit between a client and an existing REST API.

```text
┌──────────────────────────────┐
│        GraphQL Client        │
│                              │
│      Query / Mutation        │
└──────────────┬───────────────┘
               │
               │ GraphQL
               ▼
┌──────────────────────────────┐
│       Apollo Server          │
│                              │
│       Node.js Runtime        │
├──────────────────────────────┤
│                              │
│          Schema              │
│             │                │
│          Resolvers            │
└──────────────┬───────────────┘
               │
               │ HTTP / Axios
               ▼
┌──────────────────────────────┐
│         REST API             │
│                              │
│       JSON Server            │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          db.json             │
│                              │
│      Persons Collection      │
└──────────────────────────────┘
```

The current `allPersons` resolver demonstrates this architecture by requesting `/persons` from the REST endpoint and then returning the data through GraphQL.

---

## Technology Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nodejs,graphql,js&theme=dark" alt="Node GraphQL Technologies">

</div>

| Technology    | Purpose                              |
| ------------- | ------------------------------------ |
| Node.js       | JavaScript runtime                   |
| GraphQL       | API query language and runtime       |
| Apollo Server | GraphQL server implementation        |
| Axios         | HTTP communication with the REST API |
| JSON Server   | Local REST API / mock backend        |
| JavaScript    | Application language                 |
| pnpm          | Package management                   |

The project currently uses **GraphQL 17.0.2**, **Apollo Server 3.13.0**, **Axios 1.20.0**, and **JSON Server 1.0.0-beta.15**. The repository is configured as an ES Module project and specifies pnpm 11.8.0 as its package manager.

---

## GraphQL Schema

The current schema defines two main object types:

```graphql
type Address {
  street: String!
  city: String!
}

type Person {
  name: String!
  phone: String
  address: Address!
  id: ID!
}
```

The `Person` type contains an `Address` object, demonstrating how GraphQL can represent relationships between objects.

```text
Person
  │
  ├── name
  ├── phone
  ├── id
  │
  └── address
       ├── street
       └── city
```

The schema also defines a `YesNo` enum:

```graphql
enum YesNo {
  YES
  NO
}
```

This enum is currently used by the `allPersons` query to optionally filter people based on whether they have a phone number.

---

## Queries

The current API exposes three queries.

### `personCount`

Returns the number of persons currently stored in the in-memory collection.

```graphql
query {
  personCount
}
```

### `allPersons`

Returns all persons.

```graphql
query {
  allPersons {
    name
    phone
    address {
      street
      city
    }
  }
}
```

It also accepts an optional `phone` argument:

```graphql
query {
  allPersons(phone: YES) {
    name
    phone
  }
}
```

or:

```graphql
query {
  allPersons(phone: NO) {
    name
  }
}
```

The resolver currently retrieves persons from the REST API and applies the phone filter when requested.

### `findPerson`

Searches for a person by name.

```graphql
query {
  findPerson(name: "John Doe") {
    name
    phone
    address {
      street
      city
    }
  }
}
```

The query returns `null` when the person cannot be found.

---

## Mutations

GraphQL mutations are used to modify data.

The current schema provides two mutations.

### `addPerson`

Creates a new person.

```graphql
mutation {
  addPerson(
    name: "Peter Parker"
    phone: "555-1234"
    street: "20 Ingram Street"
    city: "New York"
  ) {
    name
    phone
    address {
      street
      city
    }
  }
}
```

The resolver generates a unique identifier using Node.js `randomUUID()`.

It also validates that another person with the same name does not already exist. If the name is already registered, a GraphQL `UserInputError` is thrown.

---

### `editNumber`

Updates the phone number of an existing person.

```graphql
mutation {
  editNumber(
    name: "John Doe"
    phone: "555-9876"
  ) {
    name
    phone
  }
}
```

If the requested person does not exist, the resolver returns `null`.

---

## Resolvers

Resolvers connect the GraphQL schema with the actual application logic.

```text
                 GraphQL Operation
                        │
                        ▼
                   Resolver
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
         Local Data          REST API
              │                   │
              └─────────┬─────────┘
                        ▼
                     Result
```

The project currently implements resolvers for:

```text
Query
├── personCount
├── allPersons
└── findPerson

Mutation
├── addPerson
└── editNumber

Person
└── address
```

The nested `Person.address` resolver transforms the `street` and `city` properties into the GraphQL `Address` object.

---

## GraphQL + REST

One of the most interesting aspects of this project is the coexistence of **GraphQL and REST**.

The current flow is:

```text
Client
   │
   │ GraphQL Query
   ▼
Apollo Server
   │
   │ Resolver
   ▼
Axios
   │
   │ HTTP GET
   ▼
JSON Server
   │
   ▼
db.json
```

For example, when executing:

```graphql
query {
  allPersons {
    name
    phone
  }
}
```

the GraphQL resolver internally performs:

```http
GET http://localhost:3000/persons
```

and transforms the REST response into the GraphQL response.

This is a useful introduction to the idea of using GraphQL as an abstraction layer over existing REST services.

---

## Data Source

The current development environment uses **JSON Server** as a lightweight REST API.

The `db.json` file contains the initial `persons` collection:

```json
{
  "persons": [
    {
      "name": "Luis Ortega",
      "phone": "123-456-7890",
      "street": "123 Main St",
      "city": "Anytown"
    }
  ]
}
```

The repository currently includes three example persons in the JSON database.

This setup keeps the project intentionally simple while the GraphQL layer is being learned.

---

## Project Structure

```text
Node-GraphQL/
│
├── GraphQL.png
├── db.json
├── index.js
│
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
│
└── .gitignore
```

### Main Files

| File                  | Responsibility                      |
| --------------------- | ----------------------------------- |
| `index.js`            | Apollo Server, schema and resolvers |
| `db.json`             | JSON Server data source             |
| `package.json`        | Dependencies and scripts            |
| `pnpm-lock.yaml`      | Locked dependency versions          |
| `pnpm-workspace.yaml` | pnpm workspace configuration        |
| `GraphQL.png`         | Project visual/reference            |

The current repository contains these files at its root.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/luisortga/Node-GraphQL.git
```

Enter the project:

```bash
cd Node-GraphQL
```

Install dependencies with pnpm:

```bash
pnpm install
```

The project specifies pnpm `11.8.0` as its package manager.

---

## Running the REST Data Source

Start JSON Server:

```bash
pnpm run json-server
```

This starts the local REST API on:

```text
http://localhost:3001
```

The script is defined directly in `package.json` as:

```json
"json-server": "json-server --watch db.json --port 3001"
```

> **Development note:** The current GraphQL resolver requests `http://localhost:3000/persons`, while the repository's `json-server` script starts JSON Server on port `3001`. These ports should be aligned before running the complete GraphQL → REST workflow.

---

## Running GraphQL

Start the GraphQL server:

```bash
node index.js
```

Apollo Server starts the GraphQL service using its default `listen()` configuration.

The terminal prints the server URL after startup:

```text
Server listening on http://localhost:4000/
```

The exact URL is provided by Apollo Server when the server starts.

---

## Development Workflow

The intended local workflow is:

```text
1. Clone Repository
        │
        ▼
2. pnpm install
        │
        ▼
3. Start JSON Server
        │
        ▼
4. Start Apollo Server
        │
        ▼
5. Open GraphQL Client
        │
        ▼
6. Execute Queries / Mutations
        │
        ▼
7. Inspect Resolver Behavior
```

This allows the project to be used as a hands-on GraphQL learning environment.

---

## GraphQL vs REST

This project also provides an opportunity to understand the difference between REST and GraphQL.

### REST

A REST API commonly exposes multiple resources and endpoints:

```text
GET /persons
GET /persons/:id
POST /persons
PUT /persons/:id
```

### GraphQL

GraphQL exposes a schema that allows clients to request the fields they need:

```graphql
query {
  allPersons {
    name
    phone
    address {
      city
    }
  }
}
```

The client controls the shape of the response.

```text
REST
────
Endpoint → Server determines response structure


GraphQL
───────
Query → Client specifies requested fields
```

The project explores this difference by placing GraphQL on top of a REST data source.

---

## Concepts Practiced

This repository is currently focused on learning:

* GraphQL fundamentals
* GraphQL schemas
* Object types
* Scalar types
* Non-null types
* Enums
* Queries
* Mutations
* Arguments
* Resolvers
* Nested resolvers
* GraphQL error handling
* `UserInputError`
* REST integration
* Axios
* Apollo Server
* JSON Server
* Node.js ES Modules
* `randomUUID()`
* API architecture

---

## Learning Roadmap

As the project grows, the next concepts can be added progressively:

```text
GraphQL Fundamentals
        │
        ▼
Queries & Mutations
        │
        ▼
Resolvers
        │
        ▼
REST Integration
        │
        ▼
Input Types
        │
        ▼
Validation
        │
        ▼
Authentication
        │
        ▼
Database Integration
        │
        ▼
GraphQL Subscriptions
        │
        ▼
Production API
```

Potential future topics include:

* Input types
* Custom scalars
* Better error handling
* Authentication
* Authorization
* Database integration
* Pagination
* Filtering
* Sorting
* GraphQL subscriptions
* Testing
* Schema documentation
* Production deployment

---

## Current Limitations

This is an early-stage learning project, so several aspects are intentionally simple.

### In-Memory Data

Some GraphQL operations currently work with an in-memory `persons` array rather than a persistent database.

### Local REST Dependency

The `allPersons` resolver currently depends on a local JSON Server endpoint.

### Development Configuration

The REST port used by the resolver and the port configured in the JSON Server script currently need to be synchronized.

These limitations are part of the current development stage and provide opportunities for future improvements.

---

## Learning Objective

The main goal of this repository is to understand **how GraphQL works internally**, rather than simply using a GraphQL library without understanding its components.

The core relationship being explored is:

```text
                 GraphQL
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
     Schema      Resolver      Client
       │            │
       │            ▼
       │         Data Source
       │            │
       │      ┌─────┴─────┐
       │      ▼           ▼
       │    REST        Database
       │
       └──────────────► API
```

Understanding this flow provides a foundation for building more complete GraphQL services in future projects.

---

## Future Improvements

Planned improvements for this project include:

* Fix and centralize the REST API URL
* Introduce GraphQL input types
* Add persistent database storage
* Improve validation
* Add authentication
* Add authorization
* Add pagination
* Add filtering and sorting
* Add automated tests
* Improve project structure
* Separate schema and resolver modules
* Add environment variables
* Add API documentation
* Explore GraphQL subscriptions
* Deploy the API

---

## Author

<div align="center">

### Luis Ortega

Backend Developer · DevOps Learner · Frontend Learner

<br>

<a href="https://github.com/luisortga">
<img src="https://img.shields.io/badge/GitHub-luisortga-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
</a>

</div>

---

<div align="center">

### Node GraphQL

**GraphQL · Node.js · Apollo Server · REST Integration**

<br>

<img src="https://skillicons.dev/icons?i=nodejs,graphql,js&theme=dark" alt="Technologies">

<br><br>

<a href="https://github.com/luisortga/Node-GraphQL">
<img src="https://img.shields.io/badge/View%20Repository-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository">
</a>

</div>
