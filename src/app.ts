import { HttpError, DBContext, FirebaseContext, RedisContext } from 'tymon';
import { Application } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';

import AuthController from './controllers/auth_controller';
import ProfileController from './controllers/profile_controller';
import SessionController from './controllers/session_controller';
import EmblemController from './controllers/emblem_controller';
import ScheduleController from './controllers/schedule_controller';
import AdminBaseController from './controllers/admin/admin_base_controller';

import ExceptionHandler from './middlewares/exception';
import NotFoundHandler from './middlewares/not_found';

import ApiGuard from './middlewares/guard';
import RateLimiter from './middlewares/ratelimiter';
import Worker from './jobs';

class App {
    private app: Application;
    private port: number = 3000;

    public constructor(port: number) {
        this.app = express();
        this.port = port;

        this.setupModules();
        this.setupPlugins();
        this.setupControllers();
        this.setupExceptionHandlers();
    }

    private setupControllers(): void {
        this.app.use('/admin', new AdminBaseController().getRoutes());
        this.app.use('/auth', new AuthController().getRoutes());
        this.app.use('/profile', new ProfileController().getRoutes());
        this.app.use('/session', new SessionController().getRoutes());
        this.app.use('/emblem', new EmblemController().getRoutes());
        this.app.use('/schedule', new ScheduleController().getRoutes());
    }

    private setupModules(): void {
        HttpError.initialize();
        DBContext.initialize({
            connection_string: String(process.env.DB_CONNECTION_STRING),
            models_path: '/src/models'
        });
        RedisContext.initialize({
            connection_string: String(process.env.REDIS_CONNECTION_STRING)
        });
        FirebaseContext.initialize({
            service_account_path: String(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
        });
        Worker.initialize({
            connection_string: String(process.env.REDIS_CONNECTION_STRING)
        });
    }

    private setupPlugins(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(RateLimiter());
        this.app.use(ApiGuard);
    }

    private setupExceptionHandlers(): void {
        this.app.use(NotFoundHandler);
        this.app.use(ExceptionHandler);
    }

    public start(): void {
        this.app.listen(this.port, (): void => {
            console.info('server started on port: ' + this.port);
        });
    }
}

export default App;
