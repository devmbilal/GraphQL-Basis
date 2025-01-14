const { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql');
const Customer = require('../models/Customer');

// GraphQL Object Type for Customer
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        tel: { type: GraphQLString },
        email: { type: GraphQLString },
        details: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    })
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parent, args) {
                return Customer.find(); 
            }
        },
        customer: {
            type: CustomerType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Customer.findById(args.id); 
            }
        }
    }
});

// Mutations for Create, Update, Delete
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                tel: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                details: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                const customer = new Customer({
                    firstName: args.firstName,
                    lastName: args.lastName,
                    tel: args.tel,
                    email: args.email,
                    details: args.details
                });
                return customer.save(); 
            }
        },
        deleteCustomer: {
            type: CustomerType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return Customer.findByIdAndRemove(args.id); 
            }
        },
        updateCustomer: {
            type: CustomerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                tel: { type: GraphQLString },
                email: { type: GraphQLString },
                details: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Customer.findByIdAndUpdate(args.id, {
                    firstName: args.firstName,
                    lastName: args.lastName,
                    tel: args.tel,
                    email: args.email,
                    details: args.details,
                    updatedAt: Date.now()
                }, { new: true }); 
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
