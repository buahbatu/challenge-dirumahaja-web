import { HttpError, DBContext } from 'tymon';

import BaseController from './base/base_controller';
import AuthMiddleware from '../middlewares/firebase';
import { IContext, IData, IHandlerOutput } from 'src/typings/common';
import MilooService from '../services/miloo_service';
import * as bluebird from 'bluebird';
import UserRepository from '../repositories/user_repo';
import NotificationService from '../services/notification_service';

export default class ScheduleController extends BaseController {
    public constructor() {
        super();
        this.setMiddleware(AuthMiddleware);
    }

    public async notifyCovid19(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            const userRepo = new UserRepository();
            const [covid19Data, users] = await Promise.all([MilooService.getCovid19Data(false), userRepo.findAll({})]);

            await bluebird.map(
                users,
                (user): Promise<void> => NotificationService.sendCovidNotification(covid19Data, user.username),
                { concurrency: 5 }
            );

            return {
                message: 'all user notified',
                data: covid19Data
            };
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    protected setRoutes(): void {
        this.addRoute('post', '/covid19', this.notifyCovid19);
    }
}
