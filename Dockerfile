# Используем образ Node.js как базовый
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем bun (используем curl для загрузки bun)
RUN curl -fsSL https://bun.sh/install | bash

# Добавляем bun в PATH
ENV PATH="/root/.bun/bin:$PATH"

# Копируем package.json и файлы проекта
COPY package*.json ./

# Устанавливаем зависимости через bun
RUN bun install

# Копируем исходный код проекта
COPY . .

# Устанавливаем порты, которые будет слушать приложение
EXPOSE 3003 4433

# Указываем команду запуска
CMD ["bun", "run", "index.ts"]
