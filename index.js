import { ApolloServer, UserInputError } from 'apollo-server'
import { gql } from 'apollo-server'
import { randomUUID } from 'crypto'

const persons = [
  {
    name: 'John Doe',
    phone: '123-456-7890',
    street: '123 Main St',
    city: 'Anytown',
    id: randomUUID(),
  },
  {
    name: 'Jane Smith',
    phone: '987-654-3210',
    street: '456 Elm St',
    city: 'Othertown',
    id: randomUUID(),
  },
  {
    name: 'Alice Johnson',
    street: '789 Oak St',
    city: 'Sometown',
    id: randomUUID(),
  },
]

const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }

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

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(name: String!, phone: String!): Person
  }
`

// obligatorio en graphql: !

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (root, args) => {
      if (!args.phone) return persons

      const byPhone = (person) =>
        args.phone === 'YES' ? person.phone : !person.phone

      return persons.filter(byPhone)
    },
    findPerson: (root, args) => {
      const { name } = args
      return persons.find((person) => person.name === name)
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new UserInputError('name must be unique', {
          invalidArgs: args.name,
        })
      }
      const person = { ...args, id: randomUUID() }
      persons.push(person) // update database with new person
      return person
    },
    editNumber: (root, args) => {
      const personIndex = persons.findIndex((p) => p.name === args.name)
      if (personIndex === -1) return null

      const person = persons[personIndex]

      const updatedPerson = { ...person, phone: args.phone }
      persons[personIndex] = updatedPerson

      return updatedPerson
    },
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`)
})

// graphql si algo no existe, no se encuentra: null
