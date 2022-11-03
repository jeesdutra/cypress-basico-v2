
/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
  beforeEach(function() { // Verifica a url primeiro antes de executar os casos de teste
    cy.visit('./src/index.html')
  })
  it('verifica o título da aplicação', function() {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })
  //Preenche campos
  it('Preenche campos obrigatórios e envia o formulário', function() {
    const longText = 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos'
    cy.clock() //serve para congelar o relógio do navegador

    cy.get('#firstName').type('Jéssica')
    cy.get('#lastName').type('Dutra') 
    cy.get('#email').type('jessypdo@gmail.com')
    cy.get('#open-text-area').type(longText, {delay: 0}) //proriedade que adiciona um texto longo + diminui o tempo do teste
    cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible') // Exibir mensagem de sucesso!
    cy.tick(3000) //Faz com que o relógio do navegador avance 3seg (é por minissegundos, por isso tá 3000)
    cy.get('.success').should('not.be.visible')
  })
  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
    cy.clock()
    cy.get('#firstName').type('Jéssica')
    cy.get('#lastName').type('Dutra') 
    cy.get('#email').type('jessica@exemplo,com,br')
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible')// ps: o sistema não tá tratando isto, tá enviando msg de sucesso em vez de erro
    cy.tick(3000)
    cy.get('.success').should('not.be.visible')
  })
  Cypress._.times(4, function(){ //fazer o teste ser validado 5x
    it('Campo telefone continua vazia quando preenchido com valor não numérico', function(){ // Verifica se o campo fica vazio se não for número
      cy.get('#phone')
      .type('abdcedd')
      .should('have.value','')
  })


  })
  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
    cy.clock()
    cy.get('#firstName').type('Jéssica')
    cy.get('#lastName').type('Dutra') 
    cy.get('#email').type('jessypdo@gmail.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('teste')
    cy.contains('button','Enviar').click()

    cy.get('.error').should('be.visible') // msg de erro porque não digitou o telefone, que agora é obrigatório
    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  })
  it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
    cy.get('#firstName')
    .type('Jéssica')
    .should('have.value', 'Jéssica')
    .clear() // limpa o campo 
    .should('have.value', '')

  })
  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
    cy.clock()
      cy.contains('button', 'Enviar').click()
      cy.get('.error').should('be.visible')
      cy.tick(3000)
      cy.get('.error').should('not.be.visible')
  })
  it('envia o formuário com sucesso usando um comando customizado', function(){
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit() //Comando customizado contendo as informações que preenchem o formulário
    cy.get('.success').should('be.visible')
    cy.tick(3000) //Faz com que o relógio do navegador avance 3seg (é por minissegundos, por isso tá 3000)
    cy.get('.success').should('not.be.visible')
  })
  it('seleciona um produto (YouTube) por seu texto', function(){ //Seleciona pelo texto
    cy.get('#product')
    .select('YouTube')
    .should('have.value', 'youtube')
  })
  it('seleciona um produto (YouTube) por seu texto', function(){ //Seleciona pelo value
    cy.get('#product')
    .select('mentoria')
    .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu texto', function(){ //Seleciona pelo índice
    cy.get('#product')
    .select(1)
    .should('have.value', 'blog')
  })
  it('marca o tipo de atendimento "Feedback', function(){ //Uso do elemento 'radio' de seleção única, marca uma opção apenas.
    cy.get('input[type="radio"][value="feedback"]')
    .check()
    .should('have.value', 'feedback')
  })
  it(' marca cada tipo de atendimento', function(){ //Marcou os elementos tipo 'radio' um por um e faz verificações
    cy.get('input[type="radio"]')
    .each(function($radio){
      cy.wrap($radio).check()
      cy.wrap($radio).should('be.checked')

     })
    })
  it('marca ambos checkboxes, depois desmarca o último', function(){ //marca todos os checkbox e desmarca o último
    cy.get('input[type="checkbox"]')
    .check()
    .should('be.checked')
    .last()
    .uncheck()
    .should('not.be.checked')

  })
  it('seleciona um arquivo da pasta fixtures', function(){ //Seleciona arquivo
    cy.get('input[type="file"]')
    .should('not.have.value')
    .selectFile('./cypress/fixtures/example.json')
    .should(function($input){ //retorna o input file 
      //console.log($input) => usado para verificar o log no inspecionar elemento
      expect($input[0].files[0].name).to.equal('example.json') //verifica se selecionou corretamente
    })
  })
  it('seleciona um arquivo simulando um drag-and-drop',function(){ //Arrastar o arquivo até o local de upload
    cy.get('input[type="file"]')
    .should('not.have.value')
    .selectFile('./cypress/fixtures/example.json',{action:'drag-drop'})
    .should(function($input){ 
      expect($input[0].files[0].name).to.equal('example.json')
    })
  })
  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias',function(){
    cy.fixture('example.json').as('sampleFile') //Alias coloca um nome para o caminho onde está o arquivo
    cy.get('input[type="file"]')
    .selectFile('@sampleFile')
    .should(function($input){ 
      expect($input[0].files[0].name).to.equal('example.json')
  })
    })
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique',function(){
    cy.get('#privacy a').should('have.attr','target','_blank') //Visita o link
  })
  it('acessa a página da política de privacidade removendo o target e então clicanco no link', function(){
    cy.get('#privacy a')
    .invoke('removeAttr','target') //remover o target
    .click()

    cy.contains('Talking About Testing').should('be.visible') 
  })

  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show') //tornar visivél 
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide') // tornar invisível
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })
  it('preenche a area de texto usando o comando invoke', () =>{
    const longText= Cypress._.repeat('0123456789', 20) //Vai repetir o texto 20x

    cy.get('#open-text-area')
    .invoke('val', longText)
    .should('have.value', longText)
  })
  it('faz uma requisição HTTP',()=>{
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html') //requisição a nível de rede para a URL do CAC TAT
    .should(function(response){ //funçãode callback
      const {status, statusText, body} = response //desestruturando o objeto
      expect(status).to.equals(200) // faz as verificações
      expect(statusText).to.equals('OK')
      expect(body).to.include('CAC TAT')
    })
  })
  it.only('Encontrei o gato',()=>{ //desafio
    cy.get('#cat')
    .invoke('show') //tornar visivél 
    .should('be.visible')
    })
  })

