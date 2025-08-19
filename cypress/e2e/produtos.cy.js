/// <reference types= "cypress"/>
import contrato from '../contratos/produtos.contratos'


describe('Teste de API em produtos', () => {

    let token    
    beforeEach(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => {
            token = tkn
        })
    });

    it('Deve validar contrato de produtos com sucesso', () => {
        cy.request('produtos').then(response =>{
            return contrato.validateAsync(response.body)
        })
    });
    it('Listar produtos - GET', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).should((response) => {
            expect(response.status).equal(200)
            expect(response.body).to.have.property('produtos')
        })
    });
    it('Cadastrar produto - POST', () => {
        let produto = 'Produto EBAC ' + Math.floor(Math.random() * 1000000000)
        cy.cadastrarProduto(token, produto, 35, 'Kingstom', 401).should((response) => {
            expect(response.status).equal(201)
            expect(response.body.message).equal('Cadastro realizado com sucesso')
        })
    });
    it('Deve validar produto cadastrado anteriormente - POST', () => {
        cy.cadastrarProduto(token, 'Pendrive 4.0', 35, 'Kingstom', 401)
        .should((response) => {
            expect(response.status).equal(400)
            expect(response.body.message).equal('Já existe produto com esse nome')
        })
    });
    it('Deve editar um produto com sucesso - PUT', () => {
        cy.editarProduto('0kegxzRNtWer0D6Z', token, 'iPhone 15', 13500, 'Primeiro iPhone com AI', 500)
        .then((response) => {
            expect(response.status).equal(200)
            expect(response.body.message).equal('Registro alterado com sucesso')
        })
    });
    it('Deve deletar um produto - DELETE', () => {
        cy.deletarProduto('4dYmoqEQROH90iwC', token)
        .then((response) =>{
            expect(response.status).equal(200)
            expect(response.body.message).equal('Registro excluído com sucesso')
        })
    });
})
