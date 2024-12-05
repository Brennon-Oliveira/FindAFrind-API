# RF (Requisitos Funcionais)
* [ ] Deve ser possível cadastrar um pet
* [ ] Deve ser possível atualizar um pet
* [ ] Deve ser possível atualizar os dados da ORG
* [ ] Deve ser possível marcar um pet como adotado
* [ ] Deve ser possível listar todos os pets disponíveis para adoção de um cidade
* [ ] Deve ser possível filtrar pets por suas características
* [ ] Deve ser possível visualizar detalhes de um pet para adoção
* [x] Deve ser possível se cadastrar como uma ORG
* [x] Deve ser possível realizar login como uma ORG
* [ ] Deve ser possível buscar os dados da sua logada ORG
* [ ] Deve ser possível buscar pet por nome
* [ ] Deve ser possível ver todas as cidades pelo estado
* [ ] Deve ser possível ver a quantidade de pets na cidade selecionada
# RG (Regras de Negócio)
* [ ] Um pet deve ter as informações:
  - Nome
  - Sobre (Máximo de 300 caracteres)
  - Idade
  - Porte: De um a três
  - Nível de energia: De um a cinco
  - Nível de independênica: De um a cinco
  - Ambiente:
    - Ambiente fechado
    - Ambiente amplo
    - Ambos
  - Fotos (Mínimo 1)
  - Requisitos para adoção (Mínimo 1)
* [ ] Para listar os pets, é obrigatório passar a cidade
* [x] Para cadastrar uma ORG, precisa dos dados:
  - Nome do responsável
  - Email
  - CEP
  - Endereco 
  - Whatsapp
  - Senha
* [x] O email deve ser único por organização
* [x] O CEP deve um número com 8 dígitos
* [x] O whatsapp deve ser um número com 13 digitos
* [ ] Os dados possíveis de atualizar de uma ORG são:
  - Nome do responsável
  - CEP
  - Endereco
  - Whatsapp
* [ ] Para logar como uma organização, precisa do email e senha
* [ ] Um pet deve estar ligado a uma org
* [ ] O usuário que quer adotar entrará em contato com a ORG via WhatsApp
* [ ] Todos os filtros, além de cidade, são opcionais
* [ ] Só deve ser possível cadastrar um pet numa cidade válida
* [ ] As rotas de Admin só podem ser acessadas por um usuário logado na ORG
# RNF (Requisitos Não Funcionais)
* [x] A autenticação deve utilizar JWT
* [ ] Deve-se utilizar a estratégia de Refresh Token
* [ ] O upload das imagens deve ocorrer numa ferramenta externa (Como aws bucket)
* [ ] O upload das imagens deve ocorrer por meio de uma url pré assinada para a ferramenta externa escolhida
* [ ] No banco, deve ser salvo apenas o endereço das imagens
