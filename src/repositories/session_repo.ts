import SQLRepo from './base/sql_repository';
import { IContext } from 'src/typings/common';
import { Session } from '../typings/models';

export default class SessionRepository extends SQLRepo<Session> {
    public constructor(context?: IContext) {
        super('Session', context);
    }
}
