# 🛰️ FastCrystal
O FastCrystal é uma aplicação móvel desenvolvida em React Native com Expo, projetada para cientistas e pesquisadores gerenciarem e monitorarem experimentos de cristalização de proteínas em ambientes orbitais.

A aplicação conecta-se a uma API Java Spring Boot para receber dados de amostras, realizar uploads de imagens microscópicas e gerenciar o fluxo de predição de dados.

# 🚀 Funcionalidades Principais
Monitoramento de Amostras: Visualização das amostras de proteína processadas, incluindo status, data de captura e métricas físicas.

Upload e Visualização de Imagens: Sistema de upload integrado com armazenamento em servidor local e recuperação dinâmica de imagens via URL.

Predição via Inteligência Artificial: Formulário para submissão de novos alvos proteicos com suporte a processamento de dados para predição.

Tema Dinâmico: Suporte a Modo Escuro (Dark Mode) e Modo Claro, com persistência via AsyncStorage.

Interceptor Global de Rede: Arquitetura resiliente que trata erros de conexão e facilita a comunicação com o backend.

# 📂 Estrutura do Projeto
O projeto utiliza a arquitetura baseada em arquivos do Expo Router.

<img width="602" height="142" alt="image" src="https://github.com/user-attachments/assets/b8a4013d-49f7-47b7-8b4b-6b3bbb8f28eb" />

# 🛠️ Tecnologias Utilizadas

**Frontend: React Native, Expo (SDK 50+)**

**Backend: Java Spring Boot (com MySQL)**

**Gerenciamento de Estado: React Context API**

**Persistência: AsyncStorage**

# ⚙️ Configuração e Instalação
### 1. Requisitos de Ambiente (Backend)
Para rodar a API, é necessário ter o Java instalado em sua máquina.

Download do Java: Acesse o repositório oficial e faça o download da versão compatível: Baixar Java (JDK 21+)

Configuração: Após a instalação, certifique-se de que o JAVA_HOME está configurado nas variáveis de ambiente do seu sistema.

### 2. Configuração do Frontend
Clonar o Repositório

Bash
git clone https://github.com/GabrielNakashima/GlobalSolution_Crystalization.git
cd GlobalSolution_Crystalization
Instalar Dependências

Bash
npm install
Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto:

Snippet de código
## Para rodar no navegador (Web):
EXPO_PUBLIC_API_URL=http://localhost:8080

## Para rodar no celular/emulador (Substitua pelo IP da sua máquina):
EXPO_PUBLIC_API_URL=http://192.168.x.x:8080
Executar a Aplicação
Certifique-se de que o seu backend Java já esteja iniciado na porta 8080. Depois, execute:

Bash
npx expo start

## 🔐 Dados de Autenticação (Ambiente de Homologação)

Como os experimentos possuem caráter de segurança crítica, a autenticação atual está vinculada ao sistema de segurança local criptografado. Para acessar a plataforma em ambiente de testes, utilize as seguintes credenciais padrão:

* **Correio Eletrônico**: `admin@crystal.com`

* **Chave de Acesso**: `123456`

# 🎥 Demonstração em Vídeo
Para visualizar o fluxo completo da aplicação e o funcionamento da integração com a API, assista ao vídeo abaixo:

https://youtu.be/Xzj4Fk3LBI8
