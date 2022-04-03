# Blackjack

Blackjack is a static site where you can play blackjack without using any frameworks.

## Technology stack

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Installation

1. Clone this repository

```bash
git clone git@github.com:3kezoh/blackjack.git
```

2. Start the web server

```bash
docker-compose up --detach
```

3. Go to <http://localhost:8080>

```bash
# To stop the server
docker-compose down --remove-orphans --volumes --timeout 0
```

## License

[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/3kezoh/blackjack/blob/master/LICENSE)

This project is licensed under the terms of the [MIT License](https://choosealicense.com/licenses/mit/).
