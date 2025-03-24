# Senior Capstone

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Static Badge](https://img.shields.io/badge/Project%20Tracker-Click%20Me-0000ff?link=https%3A%2F%2Fgithub.com%2Fusers%2Fderrickdryer%2Fprojects%2F5%2F)

## Table of Contents

- [Senior Capstone](#senior-capstone)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Installation](#installation)
    - [Prerequsites](#prerequsites)
    - [Method 1: Cloning the Repo](#method-1-cloning-the-repo)
    - [Method 2: Using Docker](#method-2-using-docker)
  - [Message from the developers](#message-from-the-developers)
  - [License](#license)
  - [Authors \& Contributors](#authors--contributors)

## Introduction

Our team is working on a service-learning project to analyze a series of disparate business processes in order to redesign into an optimized and streamlined information systems (software) solution by considering technical, user & business requirements. We will then apply a software development methodology to develop and implement the information systems (software) solution. Lastly, our team will produce a software installation support and systems users' manual for this system.

For inquiries, please email <contact@derrickdryer.com>

## Installation

### Prerequsites

You must have the following:

- MariaDB Database with a preconfigured user and database
- Node.js (Unneeded if using docker image)
- NPM (Unneeded if using docker image)

### Method 1: Cloning the Repo

1. Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/derrickdryer/senior-capstone.git
```

2. Change into the project directory:

```bash
cd senior-capstone
```

3. Create an environment file with the following variables:

```bash
# .env
DB_HOST="Your host"
DB_PORT=3306
DB_USER="Your username"
DB_PASSWORD="Your password"
DB_DATABASE="Your database name"
```

4. Install the dependencies:

```bash
npm install
```

5. Run the server:

```bash
npm start
```

**Note:** If you wish to have the server constantly running it would be better to create a service for it.

6. Navigate to the following URL in your browser:

```bash
http:/YOURHOSTIP:3000
```

### Method 2: Using Docker

1. Pull the docker image from the docker hub:

```bash
docker pull ghcr.io/derrickdryer/derrickdryer/senior-capstone:latest
```

2. Create an environment file with the following variables:

```bash
# .env
DB_HOST="Your host"
DB_PORT=3306
DB_USER="Your username"
DB_PASSWORD="Your password"
DB_DATABASE="Your database name"
```

3. Run the docker image:

```bash
docker run -d --env-file .env -p 3000:3000 ghcr.io/derrickdryer/senior-capstone:latest
```

4. Navigate to the following URL in your browser:

```bash
http://YOURHOSTIP:3000
```

## Message from the developers

This project is not a production stable website and will not receive updates after May 3, 2025. You are free to utilize it for your own purposes based on the MIT License, but we will not be providing support for it. Lastly, we are not responsible for any damages that may occur from using this software. Thank you for your understanding.

## License

This project is licensed under the MIT License — see **[LICENSE](https://github.com/derrickdryer/senior-capstone/blob/prod/LICENSE)** file for more details.

## Authors & Contributors

**Pennsylvania Western University, California**
_Bachelor's of Computer Information Systems_

- Derrick Dryer
- Kolson DeSocio
- Sarah Cusick
