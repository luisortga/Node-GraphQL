import { ApolloServer } from 'apollo-server'
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
  type person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [person!]!
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
  },
}

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`)
})
