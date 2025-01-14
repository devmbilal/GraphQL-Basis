const { request } = require('graphql-request');
const graphqlEndpoint = 'http://localhost:5000/graphql'; 

// Homepage
exports.homepage = async (req, res) => {
    const messages = req.flash('info');
    const locals = {
        title: 'Node Js',
        description: 'User Management System',
    };

    let perPage = 12;
    let page = req.query.page || 1;

    const query = `
        query GetCustomers($page: Int, $perPage: Int) {
            customers(page: $page, perPage: $perPage) {
                id
                firstName
                lastName
                tel
                email
                details
                createdAt
            }
            countCustomers
        }
    `;

    const variables = { page: parseInt(page), perPage };

    try {
        const { customers, countCustomers } = await request(graphqlEndpoint, query, variables);

        res.render('index', {
            locals,
            customers,
            current: page,
            pages: Math.ceil(countCustomers / perPage),
            messages,
        });
    } catch (error) {
        console.log(error);
    }
};

// Add Customer Form
exports.addCustomer = (req, res) => {
    const locals = {
        title: 'Add New Customer',
        description: 'User Management System',
    };
    res.render('customer/add', locals);
};

// Post New Customer
exports.postCustomer = async (req, res) => {
    const mutation = `
        mutation AddCustomer($input: CustomerInput!) {
            addCustomer(input: $input) {
                id
            }
        }
    `;

    const variables = {
        input: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            tel: req.body.tel,
            email: req.body.email,
            details: req.body.details,
        },
    };

    try {
        await request(graphqlEndpoint, mutation, variables);
        req.flash("info", "New customer has been added.");
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
};

// View Customer
exports.view = async (req, res) => {
    const query = `
        query GetCustomer($id: ID!) {
            customer(id: $id) {
                id
                firstName
                lastName
                tel
                email
                details
                createdAt
            }
        }
    `;

    const variables = { id: req.params.id };

    try {
        const { customer } = await request(graphqlEndpoint, query, variables);

        const locals = {
            title: 'View Customer Data',
            description: 'User Management System',
        };

        res.render('customer/view', { locals, customer });
    } catch (error) {
        console.log(error);
    }
};

// Edit Customer Form
exports.edit = async (req, res) => {
    const query = `
        query GetCustomer($id: ID!) {
            customer(id: $id) {
                id
                firstName
                lastName
                tel
                email
                details
                createdAt
            }
        }
    `;

    const variables = { id: req.params.id };

    try {
        const { customer } = await request(graphqlEndpoint, query, variables);

        const locals = {
            title: 'Edit Customer Data',
            description: 'User Management System',
        };

        res.render('customer/edit', { locals, customer });
    } catch (error) {
        console.log(error);
    }
};

// Update Customer
exports.editPost = async (req, res) => {
    const mutation = `
        mutation UpdateCustomer($id: ID!, $input: CustomerInput!) {
            updateCustomer(id: $id, input: $input) {
                id
            }
        }
    `;

    const variables = {
        id: req.params.id,
        input: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            tel: req.body.tel,
            email: req.body.email,
            details: req.body.details,
        },
    };

    try {
        await request(graphqlEndpoint, mutation, variables);
        res.redirect(`/edit/${req.params.id}`);
    } catch (error) {
        console.log(error);
    }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
    const mutation = `
        mutation DeleteCustomer($id: ID!) {
            deleteCustomer(id: $id)
        }
    `;

    const variables = { id: req.params.id };

    try {
        await request(graphqlEndpoint, mutation, variables);
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
};

// Search Customers
exports.searchCustomers = async (req, res) => {
    const locals = {
        title: 'Search Customer Data',
        description: 'User Management System',
    };

    const query = `
        query SearchCustomers($searchTerm: String!) {
            searchCustomers(searchTerm: $searchTerm) {
                id
                firstName
                lastName
                tel
                email
                details
            }
        }
    `;

    const variables = { searchTerm: req.body.searchTerm };

    try {
        const { searchCustomers } = await request(graphqlEndpoint, query, variables);

        res.render('search', { customers: searchCustomers, locals });
    } catch (error) {
        console.log(error);
    }
};

// About Page
exports.about = async (req, res) => {
    const locals = {
        title: 'About',
        description: 'User Management System',
    };

    try {
        res.render('about', locals);
    } catch (error) {
        console.log(error);
    }
};
