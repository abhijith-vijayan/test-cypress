context("API Calls", () => {
    beforeEach(() => {
        cy.visit("https://json-db-server.herokuapp.com/")
    })

    // TEST 1
    it("JSON-API: should fire GET request", () => {
        cy.request("https://json-db-server.herokuapp.com/api")
            .should((response) => {
                expect(response.status).to.eq(200);
                expect(response.body)
                    .to.have.property("data")
                    .and.to.contain({
                        message: "API is up and running"
                    })

            })
    })

    function getRandomString() {
        return (Math.random() + 1).toString(36).substring(2, 9)
    }

    // TEST 2
    it("JSON-API: should fire POST request", () => {
        const randomId = getRandomString();
        // call api to create a note
        cy.request("POST", "https://json-db-server.herokuapp.com/notes", {
            id: randomId,
            message: "This is a note"
        })
        .should((response) => {
            // check if this request created a note
            expect(response).property('status').to.equal(201)
            // and this its body
            expect(response.body)
                // 1. has an id property in the response object
                .property('id')
                // 2. and be a string
                .to.be.a('string')
                // 3. with the value we supplied
                .and.to.equal(randomId)
        })
        // get the body.id property
        .its("body")
        .its("id")
        // after the create request, get the item from API and see if it's there
        .then((id) => {
            cy.request(
                // fire request to eg: https://json-db-server.herokuapp.com/notes/abcdef
                "https://json-db-server.herokuapp.com/notes/" + id)
                .should((response) => {
                    // check if the secondary request returns 200
                    expect(response.status).to.eq(200);
                    // and the response has the actual id
                    expect(response.body)
                        .to.have.property("id")
                        .and.to.equal(id)
                })
        })
    })

    it("JSON-API: should fire get request to get an array", () => {
        cy.request("https://json-db-server.herokuapp.com/notes")
            .should((response) => {
                expect(response.status).to.eq(200);
                expect(response.body)
                    .to.be.a( 'array')
                    // the notes would have at least one because we already created one earlier
                    .and.to.have.length.gt(0)
            })
            // get 0th item from body
            .its("body")
            .its("0")
            .then((firstNote) => {
                // and the response has an id
                expect(firstNote)
                    .to.have.property("id")
                    .to.be.a('string')
            })

    })
})