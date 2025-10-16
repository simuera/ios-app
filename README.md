## License

**This repository is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).**

You may read, fork, and use the code for **personal, educational, or evaluation purposes only**.  
**Commercial use, redistribution, resale, or inclusion in paid products/services is strictly prohibited** without written permission from the copyright holder (Emir Alakus).

If you want to request a commercial license or discuss usage rights, contact: **emirabdullah2007@gmail.com**

> 🔒 **Notice:** This project is provided for transparency and portfolio demonstration only.  
> Viewing and learning from the code is allowed — **using any part of it in commercial or monetized products is not permitted** without a signed license agreement.

See the full [LICENSE.md](./LICENSE.md) for complete terms.

# 1. Setup environment
cp .env.example .env

# 2. Install dependencies
npm ci
npm install

# 3. Generate Prisma client
npx prisma generate --schema=server/prisma/schema.prisma

# 4. Build
npm run build

# 5. Run server
npm start
# DOCKER
cd tasktool-server
docker-compose up -d --build
curl http://localhost:3000/api/health

# Swift Setup (Xcode)

Open the iOS project in Xcode

Set API base URL to http://localhost:3000 (simulator) or http://<your-ip>:3000 (physical device)

Build & run
