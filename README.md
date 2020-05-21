## Express.js + TypeScript + Mongoose/TypeORM => Boilerplate

> Encapsulate express framework with typescript, and configure commonly used express third-party packages. For more details about typescript config, see tsconfig.json in the root directory.

### 0. .env file

> Put all config parameters here.

### 1. Config Directory

> src/config | alias @config/

- Put similar type configuration parameters of .env file in the same file and export default {}

### 2. Controller Directory

> MVC - Controller | alias @controllers/

### 3. Route Directory

> MVC - Route | alias @routes/

### 4. Models Directory

> MVC - Model | alias @models/

- Use MongoDB: Name like xxx.schema.ts
- Use TypeORM: Name like xxx.entity.ts
- Use Mysql / PostgreSQL: Name like: xxx.model.ts

### 5. Public Directory

> Public dir | store pic, file, etc.

### 6. Exceptions Directory

> Encapsulate some common used exceptions like: HttpException, NotFoundException(404), BadRequestException(400), InvalidCredentialException(401), ServerErrorrException(500)

### 7. Utils Directory

> Put utils function here

### 8. Usage

- Install packages: `yarn install`
- Run in development mode: `yarn start:dev`
- Build: `yarn build`
